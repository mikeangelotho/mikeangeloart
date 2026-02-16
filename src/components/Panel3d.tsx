import * as three from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { onCleanup, onMount, Suspense } from "solid-js";

export class SceneManager {
  #renderer: three.WebGLRenderer | null = null;
  private scene: three.Scene | null = null;
  private camera: three.PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private model: three.Object3D | null = null;
  private animationId: number | null = null;
  private scrollHandler: (() => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private placeholder: HTMLElement | null = null;
  container: HTMLElement | null = null;
  private isRunning = false;
  private initialized = false;
  _zoom: number;

  constructor(zoom: number = 16) {
    this._zoom = zoom;
  }

  get zoom() {
    return this._zoom;
  }

  dispose() {
    this.stopAnimation();
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
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
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

  startAnimation() {
    if (this.initialized && !this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  stopAnimation() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    if (!this.#renderer || !this.scene || !this.camera || !this.isRunning)
      return;
    this.animationId = requestAnimationFrame(this.animate);
    this.#renderer.render(this.scene, this.camera);
  };

  init(element: HTMLElement, modelName: string) {
    if (this.initialized) return;

    // Mobile performance optimization
    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    this.container = element;
    this.placeholder = document.createElement("div");
    this.placeholder.className =
      "absolute top-0 left-0 text-black/10 dark:text-white/10 w-full h-full";
    this.placeholder.textContent = "Loading 3D";
    this.placeholder.style.display = "flex";
    this.placeholder.style.alignItems = "center";
    this.placeholder.style.justifyContent = "center";
    this.container.appendChild(this.placeholder);

    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera(25, width / height, 0.1, 10);
    this.camera.position.z = 6;
    this.controls = new OrbitControls(this.camera, element);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.update();
    // Performance optimizations
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 0.75 : 1);
    this.#renderer = new three.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "default",
    });
    this.#renderer.setSize(width, height);
    this.#renderer.toneMapping = three.ACESFilmicToneMapping;
    this.#renderer.toneMappingExposure = 1;
    this.#renderer.setPixelRatio(pixelRatio);
    this.#renderer.shadowMap.enabled = !isMobile;
    this.#renderer.shadowMap.type = three.PCFSoftShadowMap;
    element.appendChild(this.#renderer.domElement);


    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelName, (gltf) => {
      if (this.placeholder) {
        this.placeholder.remove();
        this.placeholder = null;
      }
      this.model = gltf.scene;
      if (this.scene) {
        this.scene.add(this.model);
      }
      this.model.rotation.y = 0.66;
      this.model.rotation.x = -0.33;

      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, 128, 128);
      gradient.addColorStop(0, "#3366ffff");
      gradient.addColorStop(1, "#ffffffff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      const gradientTexture = new three.CanvasTexture(canvas);
      gradientTexture.wrapS = three.ClampToEdgeWrapping;
      gradientTexture.wrapT = three.ClampToEdgeWrapping;
      gradientTexture.colorSpace = three.SRGBColorSpace;
      gradientTexture.needsUpdate = true;

      const defaultMaterial = new three.MeshPhysicalMaterial({
        map: gradientTexture,
        metalness: 0,
        roughness: 0.25,
        transmission: 0.5,
        thickness: 1,
        ior: 1.45,
      });

      this.model.traverse((child) => {
        if (!(child instanceof three.Mesh)) return;
        child.castShadow = true;
        child.receiveShadow = false;
        switch (child.name) {
          default:
            child.material = defaultMaterial;
            break;
        }
      });
    });

    const ambient = new three.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    const dirLight = new three.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    // Reduce shadow quality on mobile
    const shadowSize = isMobile ? 256 : 512;
    dirLight.shadow.mapSize.width = shadowSize;
    dirLight.shadow.mapSize.height = shadowSize;
    this.scene.add(dirLight);

    const shadowPlaneGeo = new three.PlaneGeometry(50, 50);
    const shadowMat = new three.ShadowMaterial({ opacity: 0.3 });
    const shadowPlane = new three.Mesh(shadowPlaneGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1;
    shadowPlane.receiveShadow = false;
    this.scene.add(shadowPlane);

    this.scrollHandler = () => {
      if (this.model) {
        // Reduce scroll rotation frequency on mobile
        const rotationAmount = isMobile ? 0.04 : 0.075;
        this.model.rotation.y += rotationAmount;
      }
    };
    window.addEventListener("scroll", this.scrollHandler);

    this.initialized = true;
    this.startAnimation();
  }

  handleResize(element: HTMLElement) {
    if (!this.camera || !this.#renderer || !this.scene) return;

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    // Update camera aspect
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer size
    this.#renderer.setSize(width, height);

    // Re-calculate pixel ratio (important for switching between high-dpi screens)
    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 0.75 : 1);
    this.#renderer.setPixelRatio(pixelRatio);

    // Update controls to reflect new viewport
    if (this.controls) {
      this.controls.update();
    }

    // Force an immediate render so the change is instantaneous
    this.#renderer.render(this.scene, this.camera);
  }
}

export default function Panel3d(props: { model: string }) {
  let wrapper!: HTMLDivElement;

  onMount(() => {
    const sceneManager = new SceneManager(8);

    // 1. Define the resize handler outside the observer
    const resizeHandler = () => {
      if (wrapper) {
        sceneManager.handleResize(wrapper);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("opacity-25", entry.isIntersecting);
          if (entry.isIntersecting) {
            if (sceneManager.container === null) {
              sceneManager.init(wrapper, props.model);
              // 2. Attach listener once initialization happens
              window.addEventListener("resize", resizeHandler);
            }
            sceneManager.startAnimation();
          } else {
            sceneManager.stopAnimation();
          }
        });
      },
      { threshold: 0.1 }, // Lowered threshold for better mobile detection
    );

    observer.observe(wrapper);

    onCleanup(() => {
      window.removeEventListener("resize", resizeHandler);
      observer.disconnect();
      sceneManager.dispose();
    });
  });

  return (
    <div
      ref={wrapper}
      class="absolute top-0 left-0 h-full mx-auto w-full def__animate -z-1 opacity-0 not-dark:invert not-dark:hue-rotate-145 contrast-125 brightness-125"
    ></div>
  );
}