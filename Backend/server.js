const io = require("socket.io")(5000, {
  cors: {
    origin: "*",
  },
});

const rooms = {}; // Store rooms and players

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("create-room", () => {
    const roomCode = Math.random().toString(36).substring(7).toUpperCase();
    rooms[roomCode] = { host: [socket.id], players: [socket.id] };
    socket.join(roomCode);
    socket.emit("room-created", { roomCode });
    console.log(rooms);
  });

  socket.on("join-room", ({ roomCode }) => {
    if (rooms[roomCode]) {
      //todo: if it is not present in any room then add if yes then first remove it from that

      rooms[roomCode].players.push(socket.id);
      socket.join(roomCode);
      // console.log(`Player ${socket.id} joined room ${roomCode}`);
      // Send updated player list to ALL clients in the room
      io.to(roomCode).emit("player-joined", {
        players: rooms[roomCode].players,
        roomCode,
      });
      io.to(roomCode).emit("room-joined");
    } else {
      socket.emit("room-error", { message: "Room not found" });
    }
    console.log(rooms);
  });

  socket.on("start-game", ({ roomCode }) => {
    io.to(roomCode).emit("game-started");
  });

  //to fetch questions from the api
  socket.on("get-questions", async ({ roomCode }) => {
    try {
      // Add error handling for fetch
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18"
      );
      const questions = await response.json();

      // Validate the response format
      if (questions) {
        // Update room with questions and initialize answer arrays
        rooms[roomCode] = {
          ...rooms[roomCode],
          questions: [],
        };
        // Emit questions to clients
        io.to(roomCode).emit("questions", questions);
      } else {
        // Handle invalid response format
        console.error("Invalid questions format received from API");
        io.to(roomCode).emit("questions-error", {
          message: "Failed to load questions. Please try again.",
        });
      }
    } catch (error) {
      // Handle any errors during fetch
      console.error("Error fetching questions:", error);
      io.to(roomCode).emit("questions-error", {
        message: "Failed to load questions. Please try again.",
      });
    }
  });

  socket.on("send-answer", ({roomCode }) => {
    rooms[roomCode].questions.push(socket.id);
  });

  socket.on("wrong-answer",({roomCode})=>{
    rooms[roomCode].players = rooms[roomCode].players.filter(
      (player) => player !== socket.id
    );
    // Check if any players are left in the room
    if (rooms[roomCode].players.length === 0) {
      io.to(roomCode).emit("no-players-left");
      delete rooms[roomCode];
    }
  })

  socket.on("answer-not-selected", ({ roomCode }) => {
    rooms[roomCode].players = rooms[roomCode].players.filter(
      (player) => player !== socket.id
    );
    // Check if any players are left in the room
    if (rooms[roomCode].players.length === 0) {
      io.to(roomCode).emit("no-players-left");
      delete rooms[roomCode];
    }
  });

  socket.on("send-data", ({ roomCode }) => {
    for (let room in rooms) {
      if (room == roomCode) {
        io.to(roomCode).emit("recieve-data", { data: rooms[room] });
      }
    }
  });

  // Remove player from rooms when they disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Find the room that contains this socket
    const roomCode = Object.keys(rooms).find((code) =>
      rooms[code].players.includes(socket.id)
    );

    // Only proceed if we found a room
    if (roomCode && rooms[roomCode]) {
      // Remove the player from the room
      rooms[roomCode].players = rooms[roomCode].players.filter(
        (player) => player !== socket.id
      );

      // Check if room is empty
      if (rooms[roomCode].players.length === 0) {
        delete rooms[roomCode];
      }
      // Check if disconnected player was the host
      else if (socket.id === rooms[roomCode].host[0]) {
        delete rooms[roomCode];
        io.to(roomCode).emit("host-disconnect");
      }

      // Notify remaining players about the disconnect
      io.to(roomCode).emit("player-disconnect", {
        data: rooms[roomCode],
      });
    }
  });
});
