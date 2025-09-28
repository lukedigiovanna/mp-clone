import * as React from "react";
import client from "../networking/client";
import { useNavigate } from "react-router";

const JoinPage: React.FC = () => {
    const [ipInput, setIpInput] = React.useState("");
    const [status, setStatus] = React.useState<null | string>(null);
    const navigate = useNavigate();

    const handleJoin = async () => {
        if (!ipInput.trim()) {
            setStatus("Please enter a valid IP address");
            return;
        }

        setStatus("Attempting to join...");
        
        const [ip, portStr] = ipInput.split(":");
        const port = portStr ? parseInt(portStr, 10) : 8080; // default port if none given

        try {
            await client.connect({ ip, port });
            navigate("/lobby");
        }
        catch {
            setStatus("Failed to connect");
        }
        
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-pink-200 to-yellow-300 flex flex-col items-center justify-start">
            <h1 className="mt-8 text-2xl font-extrabold uppercase font-mono bg-yellow-200 border-4 border-black rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 mb-8 w-fit mx-auto tracking-widest text-black text-center">
                Join Game
            </h1>

            <div className="flex flex-col items-center gap-4">
                <input
                    type="text"
                    placeholder="Enter IP (e.g. 192.168.0.5:8080)"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="px-4 py-2 w-64 font-mono border-4 border-black bg-yellow-100 focus:outline-none focus:bg-yellow-200 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                />
                <button
                    onClick={handleJoin}
                    className="px-6 py-2 font-mono font-bold uppercase bg-yellow-200 border-4 border-black rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:bg-yellow-300 transition"
                >
                    Join
                </button>

                {status && (
                    <div className="text-red-400 mt-4 font-mono text-sm bg-yellow-100 border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export { JoinPage };
