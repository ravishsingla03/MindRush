import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./waitingScreen.scss"; // Import SCSS file



function WaitingScreen() {



const [roomCode,setRoomCode] = useState("");
const [isHost,setIsHost] = useState(true);

  const [players, setPlayers] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "Player 6",
  ]);

  const handleStartGame = () => {
    console.log("Game Started!");
    // Add WebSocket event here to notify all players that the game is starting
  };

  return (
    <div className="waiting-container">
      <h1 className="waiting-title">Waiting for Players to Join</h1>
      <p className="waiting-text">
        Share this room code with your friends:{" "}
        <span className="room-code">{roomCode}</span>
      </p>
      <ul className="player-list">
        {players.map((player, index) => (
          <li key={index} className="player-item">
            {player}
          </li>
        ))}
      </ul>
      {isHost ? (
        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>
      ) : (
        <p className="waiting-message">Host will start the game soon...</p>
      )}
    </div>
  );
}

export default WaitingScreen;
