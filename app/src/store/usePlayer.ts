import { create } from "zustand";
import type { Player } from "../models/player";

interface PlayerStore {
    player: Player | null;
    setPlayer: (player: Player | null) => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    player: null,
    setPlayer: (player: Player | null) => set({ player }),
}));

export { usePlayer };