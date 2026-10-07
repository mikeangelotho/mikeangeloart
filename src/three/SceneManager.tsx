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
  private disposed = false;
  private modelFailed = false;
  private motionEnabled = true;
  private lastFrameTime = 0;
  _zoom: number;

  constructor(zoom: number = 16) { this._zoom = zoom; }

  setMotionEnabled(enabled: boolean) {
    this.motionEnabled = enabled && !this.modelFailed;
    if (!this.motionEnabled) this.stopAnimation();
  }

  startAnimation() {
    if (this.disposed || !this.motionEnabled || this.animationId !== null) return;
    this.lastFrameTime = 0;
    const animate = (time: number) => {
      if (this.disposed || !this.motionEnabled) return;
      const delta = this.lastFrameTime ? Math.min(time - this.lastFrameTime, 64) : 16;
      this.lastFrameTime = time;
      if (this.model) this.model.rotation.y += 0.0003 * delta;
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }

  stopAnimation() {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.lastFrameTime = 0;
  }

  private render() {
    if (!this.disposed && this.#renderer && this.scene && this.camera) {
      this.#renderer.render(this.scene, this.camera);
    }
  }

  private disposeMaterials(materials: Set<three.Material>) {
    const textures = new Set<three.Texture>();
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof three.Texture) textures.add(value);
      });
      material.dispose();
    });
    textures.forEach((texture) => texture.dispose());
  }

  private disposeObject(object: three.Object3D) {
    const geometries = new Set<three.BufferGeometry>();
    const materials = new Set<three.Material>();
    object.traverse((child) => {
      if (!(child instanceof three.Mesh)) return;
      geometries.add(child.geometry);
      const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
      childMaterials.forEach((material) => materials.add(material));
    });
    geometries.forEach((geometry) => geometry.dispose());
    this.disposeMaterials(materials);
  }

  init(element: HTMLElement, modelName: string) {
    if (this.initialized || this.disposed) return;
    this.initialized = true;
    const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const width = Math.max(1, element.offsetWidth);
    const height = Math.max(1, element.offsetHeight);

    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera(isMobile ? 40 : 25, width / height, 0.1, 10);
    this.camera.position.z = 6;
    this.#renderer = new three.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "default",
    });
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 0.75 : 1));
    this.#renderer.setSize(width, height);
    element.appendChild(this.#renderer.domElement);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelName, (gltf) => {
      if (this.disposed || !this.scene) {
        this.disposeObject(gltf.scene);
        return;
      }
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.model.rotation.set(-0.33, 0.66, 0);

      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 2);
        gradient.addColorStop(0, "#3366ff");
        gradient.addColorStop(1, "#ffffff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2, 2);
        const material = new three.MeshStandardMaterial({
          map: new three.CanvasTexture(canvas),
          roughness: 0.4,
        });
        const originals = new Set<three.Material>();
        this.model.traverse((child) => {
          if (!(child instanceof three.Mesh)) return;
          const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
          childMaterials.forEach((original) => originals.add(original));
          child.material = material;
        });
        this.disposeMaterials(originals);
      }
      this.render();
    }, undefined, () => {
      this.modelFailed = true;
      this.stopAnimation();
    });

    const ambient = new three.AmbientLight(0xffffff, 0.8);
    const directional = new three.DirectionalLight(0xffffff, 1.2);
    directional.position.set(5, 5, 5);
    this.scene.add(ambient, directional);
    this.scrollHandler = () => {
      if (!this.model || !this.motionEnabled || this.disposed) return;
      this.model.rotation.y += isMobile ? 0.04 : 0.075;
      if (this.animationId === null) this.render();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }

  handleResize(element: HTMLElement) {
    if (this.disposed || !this.camera || !this.#renderer) return;
    const width = Math.max(1, element.offsetWidth);
    const height = Math.max(1, element.offsetHeight);
    this.camera.aspect = width / height;
    this.camera.fov = window.innerWidth < 768 ? 40 : 25;
    this.camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
    this.render();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stopAnimation();
    if (this.scrollHandler) window.removeEventListener("scroll", this.scrollHandler);
    if (this.scene) this.disposeObject(this.scene);
    if (this.#renderer) {
      this.#renderer.dispose();
      this.#renderer.domElement.remove();
    }
    this.scrollHandler = null;
    this.model = null;
    this.scene = null;
    this.camera = null;
    this.#renderer = null;
  }
}
