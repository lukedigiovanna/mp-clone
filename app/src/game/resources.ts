// resources.ts
import * as THREE from 'three';
import { TexturePaths } from './textures';
import type { TextureKey } from './textures';
import { ModelPaths } from './models';
import type { ModelKey } from './models';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/Addons.js';

class ResourceManager {
    private textureLoader = new THREE.TextureLoader();
    private textures: Partial<Record<TextureKey, THREE.Texture>> = {};

    private modelLoader = new GLTFLoader();
    private models: Partial<Record<ModelKey, GLTF>> = {};

    async loadTextures(): Promise<void> {
        const promises = (Object.entries(TexturePaths) as [TextureKey, string][])
            .map(([key, path]) =>
                new Promise<void>((resolve, reject) => {
                    console.log(`[texture-loader] loading ${key} from ${path}`)
                    this.textureLoader.load(
                        path,
                        (tex) => {
                            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                            this.textures[key] = tex;
                            console.log(`[texture-loader] loaded ${key}`)
                            resolve();
                        },
                        undefined,
                        (err) => {
                            console.error(`failed to load texture ${key} with path ${path}`);
                            reject(err);
                        }
                    );
                })
            );

        await Promise.all(promises);
    }

    getTexture<K extends TextureKey>(key: K): THREE.Texture {
        const tex = this.textures[key];
        if (!tex) throw new Error(`Texture "${key}" not loaded`);
        return tex;
    }

    async loadModels(): Promise<void> {
        const promises = (Object.entries(ModelPaths) as [ModelKey, string][])
            .map(([key, path]) => {
                return new Promise<void>((resolve, reject) => {
                    console.log(`[model-loader] loading ${key} from ${path}`)
                    this.modelLoader.load(
                        path,
                        (data: GLTF) => {
                            this.models[key] = data;
                            console.log(`[model-loader] loaded ${key}`)
                            resolve();
                        },
                        undefined,
                        (err) => {
                            console.error(`failed to load model ${key} with path ${path}`);
                            reject(err); 
                        }
                    )
                })
            });

        await Promise.all(promises);
    }

    getModel<K extends ModelKey>(key: K): GLTF {
        const model = this.models[key];
        if (!model) throw new Error(`Model "${key}" not loaded`);
        return model;
    }

    async loadAll() {
        const promises = [
            this.loadTextures(), 
            this.loadModels()
        ];
        await Promise.all(promises);
    }
}

export const Resources = new ResourceManager();
