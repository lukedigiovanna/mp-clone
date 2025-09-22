import * as React from "react";
import { Game } from "../game/game";

const GameContainer: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;
        const game = new Game(containerRef.current);
        return () => {
            game.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full">
        
        </div>
    )
}

export { GameContainer };
