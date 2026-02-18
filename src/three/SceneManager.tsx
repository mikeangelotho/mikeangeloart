import * as three from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class SceneManager {
  #renderer: three.WebGLRenderer | null = null;
  private scene: three.Scene | null = null;
  private camera: three.PerspectiveCamera | null = null;
  private model: three.Object3D | null = null;
  private scrollHandler: (() => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private placeholder: HTMLElement | null = null;
  container: HTMLElement | null = null;
  private initialized = false;
  _zoom: number;

  constructor(zoom: number = 16) {
    this._zoom = zoom;
  }

  dispose() {
    if (this.placeholder) {
      this.placeholder.remove();
      this.placeholder = null;
    }

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.#renderer) {
      this.#renderer.dispose();
      this.#renderer.domElement.remove();
      this.#renderer = null;
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj instanceof three.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      this.scene = null;
    }

    this.camera = null;
    this.model = null;
    this.container = null;
    this.initialized = false;
  }

  private render() {
    if (this.#renderer && this.scene && this.camera) {
      this.#renderer.render(this.scene, this.camera);
    }
  }

  init(element: HTMLElement, modelName: string) {
    if (this.initialized) return;

    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

    this.container = element;

    // Placeholder
    this.placeholder = document.createElement("div");
    this.placeholder.className =
      "absolute top-0 left-0 text-black/10 dark:text-white/10 w-full h-full flex items-center justify-center";
    this.placeholder.textContent = "Loading 3D";
    this.container.appendChild(this.placeholder);

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera(25, width / height, 0.1, 10);
    this.camera.position.z = 6;

    // Renderer (lighter config)
    this.#renderer = new three.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "low-power",
    });

    const pixelRatio = Math.min(
      window.devicePixelRatio,
      isMobile ? 0.75 : 1
    );

    this.#renderer.setPixelRatio(pixelRatio);
    this.#renderer.setSize(width, height);

    // Disable expensive tone mapping
    this.#renderer.toneMapping = three.NoToneMapping;

    element.appendChild(this.#renderer.domElement);

    // Load model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelName, (gltf) => {
      if (this.placeholder) {
        this.placeholder.remove();
        this.placeholder = null;
      }

      this.model = gltf.scene;
      this.scene!.add(this.model);

      this.model.rotation.y = 0.66;
      this.model.rotation.x = -0.33;

      // Gradient texture
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;

      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, 128, 128);
      gradient.addColorStop(0, "#3366ff");
      gradient.addColorStop(1, "#ffffff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      const gradientTexture = new three.CanvasTexture(canvas);
      gradientTexture.colorSpace = three.SRGBColorSpace;

      // Cheaper material
      const defaultMaterial = new three.MeshStandardMaterial({
        map: gradientTexture,
        metalness: 0,
        roughness: 0.4,
      });

      this.model.traverse((child) => {
        if (child instanceof three.Mesh) {
          child.material = defaultMaterial;
        }
      });

      this.render(); // Render once after load
    });

    // Simple lighting (no shadows)
    const ambient = new three.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const dirLight = new three.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    // Scroll rotation (render only when needed)
    this.scrollHandler = () => {
      if (!this.model) return;

      const rotationAmount = isMobile ? 0.04 : 0.075;
      this.model.rotation.y += rotationAmount;

      this.render();
    };

    window.addEventListener("scroll", this.scrollHandler);

    this.initialized = true;
  }

  handleResize(element: HTMLElement) {
    if (!this.camera || !this.#renderer) return;

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(
      window.devicePixelRatio,
      isMobile ? 0.75 : 1
    );

    this.#renderer.setPixelRatio(pixelRatio);
    this.#renderer.setSize(width, height);

    this.render();
  }
}
