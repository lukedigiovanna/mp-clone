import * as React from "react";
import { useNavigate } from "react-router";

import client from "../networking/client";
import { isElectron } from "../store/isElectron";

interface MenuButton {
    text: string;
    enabled: boolean;
    onClick: () => void;
}


const MainPage: React.FC = () => {
    const navigate = useNavigate();

    const menuButtons: MenuButton[] = [
        {
            text: "Host Game",
            enabled: isElectron(),
            async onClick() {
                let address;
                try {
                    const response = await window.electronAPI.startHost();
                    if (!response.success) {
                        throw Error();
                    }
                    address = response.address;
                }
                catch {
                    alert("Failed to start server!");
                    return;
                }
                try {
                    const connected = await client.connect(address);
                    if (!connected) {
                        window.electronAPI.stopHost();
                        throw Error();
                    }
                    navigate("/lobby");
                }
                catch {
                    alert("Failed to join server");
                }
            }
        },
        {
            text: "Join Game",
            enabled: true,
            onClick() {
                navigate("/join");
            }
        },
        {
            text: "Settings",
            enabled: true,
            onClick() {

            }
        },
        {
            text: "Quit",
            enabled: isElectron(),
            onClick() {
                window.electronAPI.quitApp();
            }
        }
    ] as const;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-pink-200 to-yellow-300 flex flex-col items-center justify-start">
            <h1 className="mt-16 text-4xl font-extrabold uppercase font-mono bg-yellow-200 border-4 border-black rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 mb-8 w-fit mx-auto tracking-widest text-black text-center">
                Mario Party™
            </h1>
            <div className="flex flex-col w-full items-center justify-center gap-y-2">
                {
                    menuButtons.map((menuButton, i) => (
                        <button 
                            disabled={!menuButton.enabled}
                            key={i}
                            onClick={menuButton.onClick}
                            title={menuButton.enabled ? "" : "This action only works in an Electron client"}
                            className="cursor-pointer bg-yellow-300 border-4 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-8 py-2 font-bold uppercase tracking-widest text-lg font-mono hover:bg-pink-400 active:shadow-none transition-all duration-75 max-w-xs w-full disabled:opacity-50 disabled:cursor-auto disabled:bg-yellow-300">
                            { menuButton.text }
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export { MainPage };
