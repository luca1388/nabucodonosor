import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [crew, setCrew] = useState([]);
  const [status, setStatus] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        let crewMembers;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/crew`);
        if (response.ok) {
          crewMembers = await response.json();
          setCrew(crewMembers.crew.list);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchCrew();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
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
    };

    fetchStatus();
  }, []);

  const fetchWeaponsStatus = useCallback(async () => {
    try {
      let status;
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/status/weapons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        status = await response.json();
        console.log(status);
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const loginHandler = useCallback(
    (event) => {
      event.preventDefault();
      fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setToken(data.data.token);
          fetchWeaponsStatus();
        });
    },
    [username, password, fetchWeaponsStatus]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Nabucodonosor</h1>
        <p>Ship crew members: {crew.length}</p>
        <p>Status of the ship: {status}</p>
        Authenticate to get more info:
        <form method="POST" onSubmit={loginHandler}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button onClick={loginHandler}>Login</button>
        </form>
      </header>
    </div>
  );
}

export default App;
