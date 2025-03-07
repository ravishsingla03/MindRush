const io = require("socket.io")(5000, {
    cors: {
        origin: "*",
    }
});

const rooms = {}; // Store rooms and players

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("create-room", () => {
        const roomCode = Math.random().toString(36).substring(7).toUpperCase();
        rooms[roomCode] = { players: [socket.id] };
        socket.join(roomCode);
        socket.emit("room-created", { roomCode, players: rooms[roomCode].players });
        console.log(rooms);
    });
    
    socket.on("join-room", ({ roomCode }) => {
        console.log(rooms);
        if (rooms[roomCode]) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            console.log(`Player ${socket.id} joined room ${roomCode}`);
            
            // Send updated player list to ALL clients in the room
            io.to(roomCode).emit("player-joined", { players: rooms[roomCode].players });
        } else {
            socket.emit("room-error", { message: "Room not found" });
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove player from rooms when they disconnect
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter(player => player !== socket.id);
            io.to(roomCode).emit("player-joined", { players: rooms[roomCode].players });
        }
    });
});
