import * as React from "react";
import { useNavigate } from "react-router";

interface MenuButton {
    text: string;
    onClick: () => void;
}


const MainPage: React.FC = () => {
    const navigate = useNavigate();

    const menuButtons: MenuButton[] = [
        {
            text: "Host Game",
            onClick() {
                navigate("/game");
            }
        },
        {
            text: "Join Game",
            onClick() {
                navigate("/game");
            }
        },
        {
            text: "Settings",
            onClick() {

            }
        },
        {
            text: "Quit",
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
                            key={i}
                            onClick={menuButton.onClick}
                            className="cursor-pointer bg-yellow-300 border-4 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-8 py-2 font-bold uppercase tracking-widest text-lg font-mono hover:bg-pink-400 active:shadow-none transition-all duration-75 max-w-xs w-full">
                            { menuButton.text }
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export { MainPage };
