import { useReducer, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
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

  return (
    <>
      <header className="header">
        <FontAwesomeIcon icon={faCar} />
        Estacionamiento
      </header>
      <div className="main-content">
        {isAuthenticated ? (
          <>
            <Form dispatch={dispatch} state={state} />
            <ActivityList activities={state.activities} />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </>
  );
}

export default App;
