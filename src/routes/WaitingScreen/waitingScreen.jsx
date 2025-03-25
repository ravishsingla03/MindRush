import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./waitingScreen.scss"; // Import SCSS file
import { socket } from "../../Components/SocketManger";



function WaitingScreen() {
  const [roomCode,setRoomCode] = useState();
  const [isHost,setIsHost] = useState(true);

  useEffect(()=>{
    socket.on("room-created",({roomCode,players})=>{
      console.log("Room created with code:",roomCode);
      setRoomCode(roomCode);
      setPlayers(players);
    });
    socket.on("player-joined", ({ players,roomCode }) => {
      console.log("Updated players list:", players);
      setPlayers(players);
      setRoomCode(roomCode);
    });
  },[]);



  const [players, setPlayers] = useState([
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
