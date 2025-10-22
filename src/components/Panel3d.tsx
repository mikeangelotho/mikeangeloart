import * as three from "three";
import { GLTFLoader, HDRLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { onMount } from "solid-js";

class SceneManager {
  private renderer: three.WebGLRenderer | null = null;
  private scene: three.Scene | null = null;
  private camera: three.PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private model: three.Object3D | null = null;
  private animationId: number | null = null;
  private scrollHandler: (() => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private placeholder: HTMLElement | null = null;
  private container: HTMLElement | null = null;

  dispose() {
    if (this.placeholder) {
      this.placeholder.remove();
      this.placeholder = null;
    }
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
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
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
      this.renderer = null;
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
  }

  init(element: HTMLElement, modelName: string) {
    this.dispose();
    this.container = element;
    this.placeholder = document.createElement("div");
    this.placeholder.className = "absolute top-0 left-0";
    this.placeholder.textContent = "Loading 3D";
    this.placeholder.style.color = "lightgray";
    this.placeholder.style.fontSize = "14px";
    this.placeholder.style.position = "absolute";
    this.placeholder.style.display = "flex";
    this.placeholder.style.alignItems = "center";
    this.placeholder.style.justifyContent = "center";
    this.placeholder.style.width = "100%";
    this.placeholder.style.height = "100%";
    this.placeholder.style.pointerEvents = "none";
    this.container.style.position = "relative";
    this.container.appendChild(this.placeholder);

    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera(15, width / height, 0.1, 100);
    this.camera.position.z = 11;
    this.controls = new OrbitControls(this.camera, element);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.update();
    this.renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = three.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = three.PCFSoftShadowMap;
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    element.appendChild(this.renderer.domElement);
    const pmrem = new three.PMREMGenerator(this.renderer);
    new HDRLoader().load("/public/qwantani_night_puresky_4k.hdr", (hdr) => {
      const envMap = pmrem.fromEquirectangular(hdr).texture;
      if (this.scene) {
        this.scene.environment = envMap;
      }
      hdr.dispose();
      pmrem.dispose();
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

        function createVerticalGradientTexture(
          colorTop: string,
          colorBottom: string
        ): three.Texture {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 256;
          const ctx = canvas.getContext("2d")!;
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, colorTop);
          gradient.addColorStop(1, colorBottom);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const texture = new three.CanvasTexture(canvas);
          texture.wrapS = three.ClampToEdgeWrapping;
          texture.wrapT = three.ClampToEdgeWrapping;
          texture.colorSpace = three.SRGBColorSpace;
          texture.needsUpdate = true;
          return texture;
        }

        this.model.traverse((child) => {
          if (!(child instanceof three.Mesh)) return;
          child.castShadow = true;
          child.receiveShadow = true;
          const envMap = this.scene?.environment;
          switch (child.name) {
            case "Cube001":
            case "Cube002":
            case "Cube003":
              child.material = new three.MeshPhysicalMaterial({
                color: 0x0066ff,
                metalness: 0,
                roughness: 0,
                envMap,
                envMapIntensity: 1.5,
              });
              break;
            default:
              const gradientTexture = createVerticalGradientTexture(
                "#ffffff",
                "#0066ff"
              );
              child.material = new three.MeshPhysicalMaterial({
                map: gradientTexture,
                metalness: 0,
                roughness: 0.4,
                transmission: 1.25,
                thickness: 0,
                envMap,
                envMapIntensity: 1,
                ior: 1.45,
                clearcoat: 1,
                clearcoatRoughness: 0,
              });
              break;
          }
        });
      });
    });
    const ambient = new three.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    const dirLight = new three.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
    const shadowPlaneGeo = new three.PlaneGeometry(50, 50);
    const shadowMat = new three.ShadowMaterial({ opacity: 0.3 });
    const shadowPlane = new three.Mesh(shadowPlaneGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1;
    shadowPlane.receiveShadow = false;
    this.scene.add(shadowPlane);
    this.scrollHandler = () => {
      if (this.model) this.model.rotation.y += 0.075;
    };
    window.addEventListener("scroll", this.scrollHandler);
    this.animate();
  }

  handleResize(element: HTMLElement) {
    if (!this.camera || !this.renderer) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = () => {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.animationId = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}

const sceneManager = new SceneManager();

export default function Panel3d(props: {
  data: string;
  headline: string;
  paragraph: string;
  reverse: boolean;
}) {
  onMount(() => {
    const wrapper3D = document.querySelector("#wrapper3d") as HTMLElement;
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          requestAnimationFrame(() => {
            sceneManager.init(target, props.data);
            const resizeHandler = () => {
              if (sceneManager) {
                sceneManager.handleResize(target);
              }
            };
            window.addEventListener("resize", resizeHandler);
          });
          observer.unobserve(target);
        }
      });
    });
    observer.observe(wrapper3D);
  });

  return (
    <section class="w-full max-w-7xl lg:py-36 lg:px-6 mx-auto grid lg:flex items-center">
      <div class="h-fit w-full grid lg:flex gap-3 items-center">
        <div class="w-full p-12 lg:rounded-3xl grid gap-3 dark:border-t dark:border-t-white lg:border dark:border-white/10 border-black/10 bg-white dark:bg-neutral-900/80 backdrop-blur-3xl dark:shadow-[0px_-16px_18px_-18px_rgba(255,255,255,0.8)]">
          <h2>{props.headline}</h2>
          <p>{props.paragraph}</p>
        </div>
        <div
          id="wrapper3d"
          class="hover:scale-95 my-36 lg:my-0 min-h-72 mx-auto row-start-1 w-full def__animate cursor-grab"
        ></div>
      </div>
    </section>
  );
}
