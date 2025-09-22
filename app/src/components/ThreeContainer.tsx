import * as React from "react";
import { createScene } from "../three/createScene";

const ThreeContainer: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;
        const { dispose } = createScene(containerRef.current);
        return dispose;
    }, [containerRef]);

    return (
        <div ref={containerRef} className="h-screen w-full bg-blue-400">
        
        </div>
    )
}

export { ThreeContainer };
