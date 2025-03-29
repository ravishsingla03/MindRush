import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./homeScreen.css";
import { useNavigate } from "react-router-dom";
import { socket, SocketManager } from "../../Components/SocketManger";



function HomeScreen() {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");

    useEffect(() => {
        sessionStorage.setItem("enteredFromHome", "true");
      }, []);

    const createRoom = () => {
        socket.emit("create-room");
         socket.once("room-created",({roomCode})=>{
            setRoomCode(roomCode);
            navigate(`/waiting?room=${roomCode}`,{ replace: true });
        })
    };

    const joinRoom = () => {
        if (roomCode.trim() === "") {
            alert("Please enter a valid room code.");
            return;
        }
        socket.emit("join-room", { roomCode });
        socket.once("room-error", ({ message }) => {
            alert(message);
            return ;
        });
        socket.once("room-joined", () => {
            navigate(`/waiting?room=${roomCode}`,{ replace: true });
        });
    };

    const handleSetRoom = (e) => {
        setRoomCode(e.target.value);
    };

    return (
        <>
        <div className="container">
            <h1 className="title">Mind Rush</h1>
            <h4 className="subtitle">The Ultimate Brain Battle! Think Fast, Stay Last!</h4>

            <div className="buttons">
                <button className="btn">Play Online</button>
                <button onClick={createRoom} className="btn">Create Room</button>
                <input type="text" placeholder="Enter Room Code" className="input" onChange={handleSetRoom} />
                <button onClick={joinRoom} className="btn">Join Room</button>

            </div>
        </div>
        </>

    );
}

export default HomeScreen;