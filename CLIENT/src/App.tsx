import { useReducer, useState } from "react";
import Login from "./Complements/Login";
import Form from "./Complements/Form";
import { activityReducer, initialState } from "./reducers/activity-reducers";
import ActivityList from "./Complements/ActivityList";
import "./index.css";

function App() {
  const [state, dispatch] = useReducer(activityReducer, initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <div className="main-content">
        {isAuthenticated ? (
          <>
            <Form dispatch={dispatch} state={state} />
            <ActivityList activities={state.activities} />
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
