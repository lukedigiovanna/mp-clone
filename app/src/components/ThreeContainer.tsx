import * as React from "react";
import { Scene } from "../game/scene";

const ThreeContainer: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;
        const scene = new Scene(containerRef.current);
        return () => {
            scene.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full">
        
        </div>
    )
}

export { ThreeContainer };
