import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;

            // Custom stylish clothes materials (cloning original material to preserve skinning)
            const shirt = character.getObjectByName("BODY.SHIRT") as THREE.Mesh;
            if (shirt && shirt.material) {
              shirt.material = (shirt.material as THREE.MeshStandardMaterial).clone();
              (shirt.material as THREE.MeshStandardMaterial).color.set("#134F31"); // Forest Green
              (shirt.material as THREE.MeshStandardMaterial).roughness = 0.5;
              (shirt.material as THREE.MeshStandardMaterial).metalness = 0.05;
              (shirt.material as THREE.MeshStandardMaterial).needsUpdate = true;
            }

            const pant = character.getObjectByName("Pant") as THREE.Mesh;
            if (pant && pant.material) {
              pant.material = (pant.material as THREE.MeshStandardMaterial).clone();
              (pant.material as THREE.MeshStandardMaterial).color.set("#18181B"); // Sleek Charcoal Slate
              (pant.material as THREE.MeshStandardMaterial).roughness = 0.7;
              (pant.material as THREE.MeshStandardMaterial).needsUpdate = true;
            }

            const shoe = character.getObjectByName("Shoe") as THREE.Mesh;
            if (shoe && shoe.material) {
              shoe.material = (shoe.material as THREE.MeshStandardMaterial).clone();
              (shoe.material as THREE.MeshStandardMaterial).color.set("#134F31"); // Matching Forest Green sneakers
              (shoe.material as THREE.MeshStandardMaterial).roughness = 0.45;
              (shoe.material as THREE.MeshStandardMaterial).needsUpdate = true;
            }


            const sole = character.getObjectByName("Sole") as THREE.Mesh;
            if (sole && sole.material) {
              sole.material = (sole.material as THREE.MeshStandardMaterial).clone();
              (sole.material as THREE.MeshStandardMaterial).color.set("#F8FAFC"); // Clean white soles
              (sole.material as THREE.MeshStandardMaterial).roughness = 0.3;
              (sole.material as THREE.MeshStandardMaterial).needsUpdate = true;
            }


            // Smile deformation on Face mesh (Plane.007)
            const faceMesh = character.getObjectByName("Plane.007") as THREE.Mesh;
            if (faceMesh && faceMesh.geometry) {
              const posAttr = faceMesh.geometry.attributes.position;
              const v = new THREE.Vector3();
              for (let i = 0; i < posAttr.count; i++) {
                v.fromBufferAttribute(posAttr, i);
                // Mouth region is centered around X=0, Y=12.48, Z=0.94
                const dx = v.x;
                const dy = v.y - 12.48;
                const dz = v.z - 0.92;
                const dist = Math.sqrt(dx * dx + dy * dy + (dz > 0 ? dz * dz : 0));

                if (dist < 0.3 && v.z > 0.82) {
                  const absX = Math.abs(v.x);
                  // Lift mouth corners as |x| grows outwards to create a warm smile
                  const liftFactor = Math.pow(Math.min(absX / 0.22, 1.0), 1.5);
                  const falloff = Math.max(0, 1 - dist / 0.3);
                  const deltaY = liftFactor * 0.055 * falloff;
                  const deltaZ = liftFactor * 0.015 * falloff;
                  posAttr.setXYZ(i, v.x, v.y + deltaY, v.z + deltaZ);
                }
              }
              posAttr.needsUpdate = true;
              faceMesh.geometry.computeVertexNormals();
            }

            // Relaxed, happy eyebrow pose
            const eyebrowL = character.getObjectByName("eyebrow_L");
            const eyebrowR = character.getObjectByName("eyebrow_R");
            if (eyebrowL) {
              eyebrowL.position.y += 0.025;
              eyebrowL.rotation.z += 0.06;
            }
            if (eyebrowR) {
              eyebrowR.position.y += 0.025;
              eyebrowR.rotation.z -= 0.06;
            }

            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            const footR = character.getObjectByName("footR");
            const footL = character.getObjectByName("footL");
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;

