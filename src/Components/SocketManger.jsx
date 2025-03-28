import { useEffect} from "react";
import {io} from "socket.io-client";

export const socket = io("http://localhost:5000");



export const SocketManager = () => {
    useEffect(() => {
        function onConnect(){
            console.log("Connected to server");
        }
        function onDisconnect(){
            console.log("Disconnected from server");
        }
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        }
    }, []);
}