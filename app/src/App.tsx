import { Routes, Route } from "react-router";
import { MainPage } from "./pages/MainPage";
import { GamePage } from "./pages/GamePage";
import { LobbyPage } from "./pages/LobbyPage";

function App() {
    return (
        <Routes>
            {/* <button className="absolute" onClick={() => {
                window.electronAPI.startHost(3000);
            }}>
                Hello
            </button> */}
            <Route path="/" Component={MainPage} />
            <Route path="/game" Component={GamePage} />
            <Route path="/lobby" Component={LobbyPage} />
        </Routes>
    )
}

export default App
