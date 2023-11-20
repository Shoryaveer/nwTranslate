import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [language, setLanguage] = useState("EN-US");

  const joinRoom = () => {
    if (username !== "" && room !== "" && language !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <div className="joinChatWelcome">
            <p>Welcome To: Switch!</p>
            <img src="switch-logo.png" width={250}/>
          </div>
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          What Language do you speak?
          <select className="language-select" onChange={e => setLanguage(e.target.value)}>
            <option value="en-US">EN-US</option>
            <option value="es">ES</option>
          </select>
          <button onClick={joinRoom}>Start!</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} preferredLang = {language}/>
      )}
    </div>
  );
}

export default App;
