// src/three/createScene.ts
import * as THREE from "three";
import { Resources } from "./resources";

class SceneObject {
    public readonly mesh: THREE.Mesh;

    constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

class Game {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private container: HTMLDivElement;
    
    private currentFrameId: number = 0;

    private objects: SceneObject[] = [];

    private onResize: () => void;

    constructor(container: HTMLDivElement) {
        this.scene = new THREE.Scene();
        const aspect = container.clientWidth / container.clientHeight;
        const d = 8;
        this.camera = new THREE.OrthographicCamera(
            -d * aspect, d * aspect, d, -d, 1, 1000
        );
        this.camera.position.set(-15, 10, -15);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        this.container = container;

        this.onResize = (() => {
            const aspect = container.clientWidth / container.clientHeight;
            this.camera.left = -d * aspect;
            this.camera.right = d * aspect;
            this.camera.top = d;
            this.camera.bottom = -d;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        }).bind(this);
        window.addEventListener("resize", this.onResize);

        // Cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1);
        const grassMaterial = new THREE.MeshStandardMaterial({ map: Resources.getTexture("GRASS") });
        const cobbleMaterial = new THREE.MeshStandardMaterial({ map: Resources.getTexture("COBBLE") });

        for (let x = -20; x <= 20; x++) {
            for (let z = -20; z <= 20; z++) {
                const mesh = new THREE.Mesh(cubeGeometry, grassMaterial);
                mesh.position.set(x, 0, z);
                this.scene.add(mesh);
            }
        }

        for (let i = -20; i <= 20; i++) {
            for (let y = 1; y <= 3; y++) {
                const mesh = new THREE.Mesh(cubeGeometry, cobbleMaterial);
                mesh.position.set(20, y, i);
                this.scene.add(mesh);
            }
        }

        const cylinderGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 12);
        const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x202ae6 });
        for (let x = -5; x <= 5; x += 2) {
            const blueSpace = new THREE.Mesh(cylinderGeometry, blueMaterial);
            blueSpace.position.set(x, 1, -2);
            this.scene.add(blueSpace);
        }

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        light.position.set(0, 20, 0);
        this.scene.add(light);

        const teapot = Resources.getModel("TEAPOT").scene.clone();
        teapot.scale.set(0.02, 0.02, 0.02);
        this.scene.add(teapot);

        this.animate();
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        this.currentFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    dispose() {
        cancelAnimationFrame(this.currentFrameId);
        window.removeEventListener("resize", this.onResize);
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
    }
}

export { Game };
