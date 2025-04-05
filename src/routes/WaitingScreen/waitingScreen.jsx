import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./waitingScreen.css"; // Import SCSS file
import { socket } from "../../Components/SocketManger";


function WaitingScreen() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');
  const [isHost, setIsHost] = useState(true);
  const [players, setPlayers] = useState([]);
  const [playonlinemode, setplayonlinemode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    // Emit only once when component mounts
    socket.emit("send-data", { roomCode });

    // Set up listener
    const handleReceiveData = ({ data, playersnames }) => {
      if (data.host[0] === 'Play-online') {
        setplayonlinemode(true);
        setIsHost(false);
      }
      else if (data.host[0] !== socket.id) {
        setIsHost(false);
      }

      var playersnames = data.players.map((player) => {
        return playersnames[player];
      });
      console.log(playersnames);
      setPlayers(playersnames);
    };

    socket.on("recieve-data", handleReceiveData);

    socket.on("player-disconnect", ({ data }) => {
      setPlayers(data.players);
    })

    socket.on("host-disconnect", () => {
      alert("Host has disconnected! You can join other room");
      navigate("/");
    });

    socket.on("game-started", () => {
      navigate("/quiz?room=" + roomCode);
    })

    // Cleanup listener when component unmounts
    return () => {
      socket.off("recieve-data", handleReceiveData);
    };
  }, [navigate, roomCode]);

  useEffect(() => {
    let timer;
    if (playonlinemode) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleStartGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playonlinemode]);

  const handleStartGame = () => {
    console.log("Game Started!");
    socket.emit("start-game", { roomCode });
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
      ) : playonlinemode ? (
        <p className="waiting-text">
          Game will start in ({timeLeft} seconds remaining)
        </p>
      ) : (
        <p className="waiting-text">Waiting for the host to start the game...</p>
      )}
    </div>
  );
}

export default WaitingScreen;
