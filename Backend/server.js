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
        rooms[roomCode] = { host: [socket.id] ,players: [socket.id] };
        socket.join(roomCode);
        // socket.emit("room-created", { roomCode, players: rooms[roomCode].players });
        console.log(rooms);
    });
    
    socket.on("join-room", ({ roomCode }) => {
        if (rooms[roomCode]) {
            //todo: if it is not present in any room then add if yes then first remove it from that
             
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            // console.log(`Player ${socket.id} joined room ${roomCode}`);
            
            // Send updated player list to ALL clients in the room
            io.to(roomCode).emit("player-joined", { players: rooms[roomCode].players, roomCode });
        } else {
            socket.emit("room-error", { message: "Room not found" });
        }
        console.log(rooms);
    });

    socket.on("start-game",async ({ roomCode }) => {
        io.to(roomCode).emit("game-started");
        var questions = await fetch("https://opentdb.com/api.php?amount=20&category=18")
        questions = await questions.json();
        io.to(roomCode).emit("questions", questions);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove player from rooms when they disconnect
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter(player => player !== socket.id);
            if(rooms[roomCode].players.length === 0) {
                delete rooms[roomCode];
            }
        }
        // Send updated player list to ALL clients in the room
    });
});
