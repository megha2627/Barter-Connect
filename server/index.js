const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const skillRoutes = require("./routes/skills");
const offerRoutes = require("./routes/offers");
const notificationRoutes = require("./routes/notifications");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/offers", offerRoutes(io));
app.use("/api/notifications", notificationRoutes);

server.listen(5000, () => console.log("Server running on port 5000"));
