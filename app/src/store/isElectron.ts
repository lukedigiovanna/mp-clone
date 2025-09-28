import { create } from "zustand";

const isElectron = create<boolean>(() => (window.electronAPI !== undefined));

export { isElectron };
