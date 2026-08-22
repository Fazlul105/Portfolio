import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;

  const currentWidth = window.innerWidth;
  // Ignore purely vertical resize on mobile (address bar collapse/expand during scroll)
  const isWidthChanged = Math.abs(currentWidth - lastWidth) > 5;
  if (!isWidthChanged && lastWidth > 0) {
    return;
  }
  lastWidth = currentWidth;

  const width = canvasDiv.current.clientWidth || window.innerWidth;
  const height = canvasDiv.current.clientHeight || window.innerHeight;

  if (width > 0 && height > 0) {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}

