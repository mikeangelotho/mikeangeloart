import * as three from "three";
import { GLTFLoader, HDRLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { onCleanup, onMount, Suspense } from "solid-js";
import { H2 } from "~/layout/Headings";

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
      "absolute top-0 left-0 text-black/10 dark:text-white/10";
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
    this.camera.position.z = this.zoom;
    this.controls = new OrbitControls(this.camera, element);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.update();
    // Performance optimizations
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5);
    this.#renderer = new three.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "default",
    });
    this.#renderer.setSize(width, height);
    this.#renderer.setClearColor(0x000000, 0);
    this.#renderer.toneMapping = three.ACESFilmicToneMapping;
    this.#renderer.toneMappingExposure = 1;
    this.#renderer.setPixelRatio(pixelRatio);
    this.#renderer.shadowMap.enabled = !isMobile;
    this.#renderer.shadowMap.type = three.PCFSoftShadowMap;
    this.#renderer.domElement.style.position = "absolute";
    this.#renderer.domElement.style.top = "0";
    this.#renderer.domElement.style.left = "0";
    element.appendChild(this.#renderer.domElement);

    const pmrem = new three.PMREMGenerator(this.#renderer);
    new HDRLoader().load(
      "https://cdn.mikeangelo.art/qwantani_night_puresky_4k.hdr",
      (hdr) => {
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

          const canvas = document.createElement("canvas");
          canvas.width = 2;
          canvas.height = 256;
          const ctx = canvas.getContext("2d")!;
          const gradient = ctx.createLinearGradient(0, 0, 0, 256);
          gradient.addColorStop(0, "#00c0ffff");
          gradient.addColorStop(1, "#0060ffff");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 2, 256);

          const gradientTexture = new three.CanvasTexture(canvas);
          gradientTexture.wrapS = three.ClampToEdgeWrapping;
          gradientTexture.wrapT = three.ClampToEdgeWrapping;
          gradientTexture.colorSpace = three.SRGBColorSpace;
          gradientTexture.needsUpdate = true;

          const defaultMaterial = new three.MeshPhysicalMaterial({
            map: gradientTexture,
            metalness: 0,
            roughness: 0,
            transmission: 1.25,
            thickness: 1,
            envMap: this.scene?.environment,
            envMapIntensity: 1,
            ior: 1.45,
            clearcoat: 0.5,
            clearcoatRoughness: 0,
          });

          const highlightMaterial = new three.MeshPhysicalMaterial({
            color: 0x00dc88,
            metalness: 0,
            roughness: 0,
            envMap: this.scene?.environment,
            envMapIntensity: 1.5,
          });

          this.model.traverse((child) => {
            if (!(child instanceof three.Mesh)) return;
            child.castShadow = true;
            child.receiveShadow = false;
            switch (child.name) {
              case "Cube001":
              case "Cube002":
              case "Cube003":
                child.material = highlightMaterial;
                break;
              default:
                child.material = defaultMaterial;
                break;
            }
          });
        });
      },
    );

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
    if (!this.camera || !this.#renderer) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }
}

export function init3dScene(
  wrapper: HTMLDivElement,
  data: string,
): [SceneManager, IntersectionObserver] {
  const sceneManager = new SceneManager(8);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (sceneManager.container === null) {
            sceneManager.init(wrapper, data);
            const resizeHandler = () => sceneManager.handleResize(wrapper);
            window.addEventListener("resize", resizeHandler);
          }
          sceneManager.startAnimation();
        } else {
          sceneManager.stopAnimation();
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(wrapper);
  return [sceneManager, observer];
}

export default function Panel3d({
  data,
  headline,
  paragraph,
  reverse = false,
}: {
  data: string;
  headline: string;
  paragraph: string;
  reverse?: boolean;
}) {
  let wrapper3d!: HTMLDivElement;
  onMount(() => {
    const [sceneManager, observer] = init3dScene(wrapper3d, data);

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.dispatchEvent(new CustomEvent("pause-bg-animations"));
          } else {
            window.dispatchEvent(new CustomEvent("resume-bg-animations"));
          }
        });
      },
      { threshold: 0.3 },
    );

    sceneObserver.observe(wrapper3d);

    onCleanup(() => {
      sceneManager.dispose();
      observer.disconnect();
      sceneObserver.disconnect();
    });
  });

  return (
    <section class="lg:py-12 w-full">
      <div class="w-full max-w-7xl lg:px-6 mx-auto grid lg:flex items-center">
        <div
          class={`h-fit w-full flex flex-col-reverse ${
            reverse ? `lg:flex-row-reverse` : `lg:flex-row`
          } gap-3 items-center`}
        >
          <div class="w-full px-6 py-12 md:px-12 lg:rounded-3xl grid gap-3 border-t lg:border dark:border-t-white dark:border-white/10 border-black/10 text-black dark:text-white bg-white dark:bg-neutral-950 backdrop-blur-3xl dark:shadow-[0px_-16px_18px_-18px_rgba(255,255,255,0.8)]">
            <H2>{headline}</H2>
            <p class="text-black/50 dark:text-white/50">{paragraph}</p>
          </div>
          <Suspense>
          <div
            ref={wrapper3d}
            class="hover:scale-95 my-12 lg:my-0 min-h-72 mx-auto w-full def__animate cursor-grab"
          ></div>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
