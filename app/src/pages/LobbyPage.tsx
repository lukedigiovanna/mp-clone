import * as React from "react";
import { useIP } from "../store/useIP";

const players = [
  { name: "Player 1", isCPU: false, ready: false, character: "Mario" },
  { name: "CPU 1", isCPU: true, ready: true, character: "Luigi" },
  { name: "CPU 2", isCPU: true, ready: true, character: "Peach" },
  { name: "CPU 3", isCPU: true, ready: true, character: "Yoshi" },
] as const;

const characters = ["Teapot"] as const;
// type Character = typeof characters[number];

const LobbyPage: React.FC = () => {
    const ip = useIP((state) => state.ip); 

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-pink-200 to-yellow-300 flex flex-col items-center justify-start">
            <h1 className="mt-8 text-2xl font-extrabold uppercase font-mono bg-yellow-200 border-4 border-black rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 mb-8 w-fit mx-auto tracking-widest text-black text-center">
                Lobby {ip}
            </h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-8 mb-12">
                {players.map((player, i) => (
                <div key={i} className="flex flex-col items-center bg-yellow-200 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-4 min-w-[180px] min-h-[180px] rounded-none">
                    <div className="font-mono font-bold text-lg uppercase mb-2">
                    {player.name} {player.isCPU && <span className="text-xs bg-gray-400 text-white px-2 py-0.5 ml-2 rounded">CPU</span>}
                    </div>
                    <div className="w-16 h-16 bg-gray-300 border-2 border-black mb-2 flex items-center justify-center">
                    <span className="text-2xl">?</span> {/* Placeholder for character image */}
                    </div>
                    <div className={`mt-2 font-mono text-sm font-bold ${player.ready ? 'text-green-600' : 'text-gray-500'}`}> 
                    {player.ready ? 'READY' : 'NOT READY'}
                    </div>
                </div>
                ))}
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-x-4 fixed bottom-8 left-0">
                {characters.map((char, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-300 border-2 border-black flex items-center justify-center mb-1">
                    <span className="text-xl">?</span> {/* Placeholder for character image */}
                    </div>
                    <span className="font-mono text-xs uppercase">{char}</span>
                </div>
                ))}
            </div>
        </div>
    );
};

export { LobbyPage };