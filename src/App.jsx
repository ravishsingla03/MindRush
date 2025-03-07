import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./styles.css"; // Import the CSS file

const socket = io("http://localhost:5000");

const Room = () => {
    const [roomCode, setRoomCode] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Handle when a player joins
        socket.on("player-joined", ({ players }) => {
            console.log("Updated players list:", players);
            setPlayers(players);
        });

        // Handle room creation
        socket.on("room-created", ({ roomCode, players }) => {
            setRoomCode(roomCode);
            setIsHost(true);
            setPlayers(players);
        });

        // Handle successful join-room response
        socket.on("room-joined", ({ roomCode, players }) => {
            setRoomCode(roomCode);
            setPlayers(players);
        });

        return () => {
            socket.off("player-joined");
            socket.off("room-created");
            socket.off("room-joined");
        };
    }, []);

    const createRoom = () => {
        socket.emit("create-room");
    };

    const joinRoom = () => {
        if (roomCode.trim() === "") {
            alert("Please enter a valid room code.");
            return;
        }
        socket.emit("join-room", { roomCode });
    };

    const handleSetRoom = (e) => {
        setRoomCode(e.target.value);
    };

    return (
        <div className="container">
            <h1 className="title">CSBasics Royale</h1>

            <div className="buttons">
                <button onClick={createRoom} className="btn">Create Room</button>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Enter Room Code" 
                        value={roomCode}
                        onChange={handleSetRoom} 
                        className="input-box"
                    />
                    <button onClick={joinRoom} className="btn">Join Room</button>
                </div>
            </div>

            {roomCode && (
                <div className="room-info">
                    <p>Room Code: <span className="code">{roomCode}</span></p>
                    <p>Players in Room: {players.length}</p>
                    <ul className="player-list">
                        {players.map((player, index) => (
                            <li key={index} className="player">{player}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Room;
