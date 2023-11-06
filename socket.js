import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development"
    ? undefined
    : "https://gembulcimotbackend.onrender.com";

export const socket = io(URL);
