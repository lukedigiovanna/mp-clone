import { create } from "zustand";

interface Address {
    ip: string;
    port: number;
}

interface IPStore {
    address: Address | null;
    setAddress: (address: Address | null) => void;
}

const useIPAddress = create<IPStore>((set) => ({
    address: null,
    setAddress: (address: Address | null) => set({ address })
}));

export { useIPAddress };
