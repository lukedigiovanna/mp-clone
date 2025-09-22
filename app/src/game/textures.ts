import marioImage from "../assets/mario.png";
import grassImage from "../assets/grass.png";
import cobbleImage from "../assets/cobblestone.png";

const TexturePaths = {
    MARIO: marioImage,
    GRASS: grassImage,
    COBBLE: cobbleImage,
} as const;

type TextureKey = keyof typeof TexturePaths;

export { TexturePaths }
export type { TextureKey };
