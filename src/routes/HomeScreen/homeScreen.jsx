import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./homeScreen.css";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

function HomeScreen() {
    const navigate = useNavigate();
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
        navigate("/waiting");
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
            <h1 className="title">Mind Rush</h1>
            <h4 className="subtitle">The Ultimate Brain Battle! Think Fast, Stay Last!</h4>

            <div className="buttons">
                <button className="btn">Play Online</button>
                <button onClick={createRoom} className="btn">Create Room</button>
                <button onClick={joinRoom} className="btn">Join Room</button>

            </div>
        </div>

    );
}

export default HomeScreen;