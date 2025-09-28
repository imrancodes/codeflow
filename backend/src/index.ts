import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./connection";
import userRoute from "./routes/user";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import roomRoute from "./routes/room";

dotenv.config();

const app = express();
const server = createServer(app);
const mongoUrl = process.env.DATABASE_URL;

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const latestCode: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId, userName) => {
    socket.join(roomId);

    socket.to(roomId).emit("userJoined", `${userName} joined the code room`);

    if (latestCode[roomId]) {
      socket.emit("updateCode", latestCode[roomId]);
    }
  });

  socket.on("codeSync", (roomId, code) => {
    latestCode[roomId] = code;
    socket.to(roomId).emit("updateCode", code);
  });

  socket.on("inputSync", (roomId, input) => {
    socket.to(roomId).emit("updateInput", input);
  });

  socket.on("outputSync", (roomId, output) => {
    socket.to(roomId).emit("updateOutput", output);
  });

  socket.on("errorSync", (roomId, error) => {
    socket.to(roomId).emit("updateError", error);
  });
  socket.on("isPendingSync", (roomId, pending) => {
    socket.to(roomId).emit("updateIsPending", pending);
  });

  socket.on("leaveRoom", (roomId, userName) => {
    socket.leave(roomId);

    socket.to(roomId).emit("userLeave", `${userName} leave the code room`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoute);
app.use("/api/room", roomRoute);

if (!mongoUrl) {
  throw new Error("DATABASE_URL is not defined in .env");
}

dbConnection(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
