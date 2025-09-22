// src/three/createScene.ts
import * as THREE from "three";
import { Resources } from "./resources";

class SceneObject {
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;
    public readonly mesh: THREE.Mesh;

    constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(geometry, material);
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

class Scene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private container: HTMLDivElement;
    
    private currentFrameId: number = 0;

    private objects: SceneObject[] = [];

    private onResize: () => void;

    constructor(container: HTMLDivElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        this.container = container;

        this.onResize = (() => {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        }).bind(this);
        window.addEventListener("resize", this.onResize);

        // Cube
        const object = new SceneObject(
            new THREE.BoxGeometry(1, 1),
            new THREE.MeshStandardMaterial({ map: Resources.getTexture("MARIO") })
        );
        this.objects.push(object);
        this.scene.add(object.mesh);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 2);
        this.scene.add(light);

        const teapot = Resources.getModel("TEAPOT").scene.clone();
        teapot.scale.set(0.02, 0.02, 0.02);
        this.scene.add(teapot);

        this.animate();
    }

    animate() {
        for (const obj of this.objects) {
            obj.mesh.rotation.x += 0.05;
            obj.mesh.rotation.y += 0.05;
        }
        this.renderer.render(this.scene, this.camera);
        this.currentFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    dispose() {
        cancelAnimationFrame(this.currentFrameId);
        window.removeEventListener("resize", this.onResize);
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
        for (const obj of this.objects) {
            obj.dispose();
        }
    }
}

export { Scene };
