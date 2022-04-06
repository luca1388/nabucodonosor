import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      let status;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/status`);
      if (response.ok) {
        status = await response.json();
        setStatus(status.message);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cookiesCheck = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}/cookies`)
      .then((resp) => resp.json())
      .then(() => fetchStatus())
      .catch((e) => console.error(e));
  }, [fetchStatus]);

  useEffect(() => {
    cookiesCheck();
  }, [cookiesCheck]);

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: `${process.env.REACT_APP_COLOR}`}}>
        <h1>Nabucodonosor</h1>
        <p>Frontend URL: {window.location.href} (prod env)</p>
        <p>API URL: {process.env.REACT_APP_API_URL}</p>
        <p>Status response:</p>
        <p>{status}</p>
      </header>
    </div>
  );
}

export default App;
