import { create } from "zustand";
import type { ServerError } from "../models/error";

type JoinStatus = "uninitiated" | "pending" | "success" | "failure";

interface JoinStatusStore {
    status: JoinStatus;
    error?: ServerError;
    setStatus: (status: JoinStatus, error?: ServerError) => void;
}

const useJoinStatus = create<JoinStatusStore>((set) => ({
    status: "uninitiated",
    setStatus: (status: JoinStatus, error?: ServerError) => set({ status, error }),
}));

export { useJoinStatus };
