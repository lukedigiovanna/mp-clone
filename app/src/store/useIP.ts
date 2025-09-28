import { create } from "zustand";

interface IPStore {
    ip: string | null;
    setIP: (ip: string | null) => void;
}

const useIP = create<IPStore>((set) => ({
    ip: null,
    setIP: (ip: string | null) => set({ ip: ip })
}));

export { useIP };
