import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./waitingScreen.scss"; // Import SCSS file
import { socket } from "../../Components/SocketManger";



function WaitingScreen() {
  const navigate = useNavigate();


  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');
  const [isHost,setIsHost] = useState(true);
  const [players, setPlayers] = useState([
  ]);

  
  useEffect(() => {
    // Emit only once when component mounts
    socket.emit("send-data", { roomCode });

    // Set up listener
    const handleReceiveData = ({ data }) => {
      if(data.host[0] !== socket.id){
        setIsHost(false);
      }
      setPlayers(data.players);
    };
    

    socket.on("recieve-data", handleReceiveData);

    socket.on("player-disconnect",({data})=>{
      setPlayers(data.players);
    })

    socket.on("host-disconnect",()=>{
      alert("Host has disconnected! You can join other room");
      navigate("/");
    });

    socket.on("game-started",()=>{
      navigate("/quiz?room="+roomCode);
    })

    // Cleanup listener when component unmounts
    return () => {
      socket.off("recieve-data", handleReceiveData);
    };
  }, [navigate, roomCode]); 

  
  


  const handleStartGame = () => {
    console.log("Game Started!");
    socket.emit("start-game",{roomCode});
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
