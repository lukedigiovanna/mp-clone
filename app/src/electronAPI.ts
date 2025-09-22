declare global {
    interface Window {
        electronAPI: {
            startHost: (port: number) => Promise<{ success: boolean }>;
            stopHost: () => Promise<{ success: boolean }>;
            quitApp: () => void;
        };
    }
}
