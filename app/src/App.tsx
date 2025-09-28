import { Routes, Route } from "react-router";
import { MainPage } from "./pages/MainPage";
import { GamePage } from "./pages/GamePage";
import { LobbyPage } from "./pages/LobbyPage";
import { JoinPage } from "./pages/JoinPage";

function App() {
    return (
        <Routes>
            <Route path="/" Component={MainPage} />
            <Route path="/game" Component={GamePage} />
            <Route path="/lobby" Component={LobbyPage} />
            <Route path="/join" Component={JoinPage} />
        </Routes>
    )
}

export default App
