import { io } from "socket.io-client";

// Tạo socket connection
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

// Socket event handlers
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;
