import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;
    let isCancelled = false;

    const width = canvasDiv.current.clientWidth || window.innerWidth;
    const height = canvasDiv.current.clientHeight || window.innerHeight;
    const aspect = width / (height || 1);
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const onContextLost = (event: Event) => {
      event.preventDefault();
    };
    const onContextRestored = () => {
      if (characterModel) {
        handleResize(renderer, camera, canvasDiv, characterModel);
      }
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let characterModel: THREE.Object3D | null = null;
    let introFinished = false;
    let introTrackingWeight = 0;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    let progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter().then((gltf) => {
      if (isCancelled || !gltf) return;
      const animations = setAnimations(gltf);
      hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
      mixer = animations.mixer;
      characterModel = gltf.scene;

      scene.add(characterModel);

      headBone = characterModel.getObjectByName("spine006") || null;
      screenLight = characterModel.getObjectByName("screenlight") || null;
      progress.loaded().then(() => {
        setTimeout(() => {
          if (!isCancelled) {
            light.turnOnLights();
            animations.startIntro(() => {
              introFinished = true;
            });
          }
        }, 1100);
      });
    });



    const onResize = () => {
      if (characterModel) {
        handleResize(renderer, camera, canvasDiv, characterModel);
      }
    };
    window.addEventListener("resize", onResize);

    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };
    let debounce: number | undefined;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // On mobile, if scrolled far down past the hero section, skip heavy 3D rendering
      const isMobile = window.innerWidth <= 1024;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (isMobile && scrollY > window.innerHeight * 2.5) {
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      if (mixer) {
        mixer.update(delta);
      }

      if (headBone) {
        if (introFinished) {
          introTrackingWeight = Math.min(1, introTrackingWeight + delta * 1.2);
        }

        if (introTrackingWeight > 0.01) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x * introTrackingWeight,
            interpolation.y * introTrackingWeight,
            THREE.MathUtils.lerp
          );
        }
        light.setPointLight(screenLight);
      }

      renderer.render(scene, camera);
    };
    animate();


    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      clearTimeout(debounce);
      scene.clear();
      renderer.dispose();
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      if (canvasDiv.current && renderer.domElement && canvasDiv.current.contains(renderer.domElement)) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

