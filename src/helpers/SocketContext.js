import React from "react";
import socketio from "socket.io-client";

// You already had this logic — keep it
const SOCKET_URL = window.location.host.split(":")[0];

// Create socket connection
export const socket = socketio.connect(SOCKET_URL + ":9090", { transports: ["websocket"] });

// React context to share socket
export const SocketContext = React.createContext();

// 🧩 Add a listener for gm_codes_changed (new)
socket.on("connect", () => {
  console.log("[RTC] Connected to backend at " + SOCKET_URL);
});

socket.on("disconnect", () => {
  console.log("[RTC] Disconnected from backend");
});

socket.on("gm_codes_changed", (filename) => {
  console.log("[RTC] gm_codes folder changed:", filename);
  // Dispatch a global browser event for other components to catch
  window.dispatchEvent(new Event("gm_codes_update"));
});
