import * as three from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class SceneManager {
  #renderer: three.WebGLRenderer | null = null;
  private scene: three.Scene | null = null;
  private camera: three.PerspectiveCamera | null = null;
  private model: three.Object3D | null = null;
  private scrollHandler: (() => void) | null = null;
  private animationId: number | null = null;
  private initialized = false;
  _zoom: number;

  constructor(zoom: number = 16) {
    this._zoom = zoom;
  }

  // NEW: Start the animation loop
  startAnimation() {
    if (this.animationId) return; // Already running
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      if (this.model) {
        // Optional: Continuous slow rotation
        this.model.rotation.y += 0.005;
      }
      this.render();
    };
    animate();
  }

  // NEW: Stop the animation loop to save battery/CPU
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private render() {
    if (this.#renderer && this.scene && this.camera) {
      this.#renderer.render(this.scene, this.camera);
    }
  }

  init(element: HTMLElement, modelName: string) {
    if (this.initialized) return;
    this.initialized = true;

    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera(
      isMobile ? 40 : 25,
      width / height,
      0.1,
      10,
    );
    this.camera.position.z = 6;

    this.#renderer = new three.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "default",
    });

    this.#renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 0.75 : 1),
    );
    this.#renderer.setSize(width, height);
    element.appendChild(this.#renderer.domElement);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelName, (gltf) => {
      this.model = gltf.scene;
      this.scene!.add(this.model);
      this.model.rotation.set(-0.33, 0.66, 0);

      // Simple material setup
      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 2;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createLinearGradient(0, 0, 0, 2);
      grad.addColorStop(0, "#3366ff");
      grad.addColorStop(1, "#ffffff");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2, 2);

      const mat = new three.MeshStandardMaterial({
        map: new three.CanvasTexture(canvas),
        roughness: 0.4,
      });

      this.model.traverse((child) => {
        if (child instanceof three.Mesh) child.material = mat;
      });

      this.render();
    });

    const ambient = new three.AmbientLight(0xffffff, 0.8);
    const dirLight = new three.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    this.scene.add(ambient, dirLight);

    this.scrollHandler = () => {
      if (this.model) {
        this.model.rotation.y += isMobile ? 0.04 : 0.075;
        if (!this.animationId) this.render(); // Render on scroll if loop is stopped
      }
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }

  handleResize(element: HTMLElement) {
    if (!this.camera || !this.#renderer) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.fov = window.innerWidth < 768 ? 40 : 25;
    this.camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
    this.render();
  }

  dispose() {
    this.stopAnimation();
    if (this.scrollHandler)
      window.removeEventListener("scroll", this.scrollHandler);
    if (this.#renderer) {
      this.#renderer.dispose();
      this.#renderer.domElement.remove();
    }
    this.scene?.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material)
        Array.isArray(obj.material)
          ? obj.material.forEach((m: any) => m.dispose())
          : obj.material.dispose();
    });
  }
}
