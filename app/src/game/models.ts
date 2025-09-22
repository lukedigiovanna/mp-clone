
const ModelPaths = {
    TEAPOT: "/src/assets/models/the_utah_teapot/scene.gltf"
} as const;

type ModelKey = keyof typeof ModelPaths;

export { ModelPaths }
export type { ModelKey };
