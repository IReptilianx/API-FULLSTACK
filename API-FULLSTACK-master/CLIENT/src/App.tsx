import { useReducer, useState } from "react";
import Login from "./Complements/Login";
import Form from "./Complements/Form";
import { activityReducer, initialState, Activity } from "./reducers/activity-reducers";
import ActivityList from "./Complements/ActivityList";
import Home from "./Complements/Home";
import "./index.css";

function App() {
  const [state, dispatch] = useReducer(activityReducer, initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showHome, setShowHome] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowHome(false);
  };

  const handleLogout = () => {
    console.log("handleLogout ejecutado");
    console.log("Estado antes:", { isAuthenticated, showHome });
    setIsAuthenticated(false);
    setShowHome(true);
    console.log("Estado después: isAuthenticated=false, showHome=true");
  };

  return (
    <>
      <div className="main-content">
        {showHome ? (
          <Home />
        ) : isAuthenticated ? (
          <>
            <Form dispatch={dispatch} state={state} />
            <ActivityList activities={state.activities as Activity[]} />
            <button className="logout-button" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </>
  );
}

export default App;
