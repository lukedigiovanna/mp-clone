
const ModelPaths = {
    TEAPOT: "/src/assets/models/teapot.glb"
} as const;

type ModelKey = keyof typeof ModelPaths;

export { ModelPaths }
export type { ModelKey };
