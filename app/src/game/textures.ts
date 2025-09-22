import marioImage from "../assets/mario.png";

const TexturePaths = {
    MARIO: marioImage
} as const;

type TextureKey = keyof typeof TexturePaths;

export { TexturePaths }
export type { TextureKey };
