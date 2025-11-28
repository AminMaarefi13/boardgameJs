import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AppProvider } from "./context/AppContext";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <AppProvider>
      <GameProvider>
        <Router>
          <AppRoutes />
        </Router>
      </GameProvider>
    </AppProvider>
    // <GameProvider>
    //   <Router>
    //     <AppRoutes />
    //   </Router>
    // </GameProvider>
  );
}

export default App;
