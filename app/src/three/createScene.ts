// src/three/createScene.ts
import * as THREE from "three";

export function createScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Cube
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 2);
  scene.add(light);

  // Animation loop
  let frameId: number;
  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  animate();

  // Resize handling
  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", onResize);

  // Cleanup
  const dispose = () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    container.removeChild(renderer.domElement);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };

  return { dispose };
}
