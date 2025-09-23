declare global {
    interface Window {
        electronAPI: {
            startHost: () => Promise<{ success: boolean, address: { ip: string, port: number } }>;
            stopHost: () => Promise<{ success: boolean }>;
            quitApp: () => void;
        };
    }
}
