import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development"
    ? undefined
    : "localhost:4000";

export const socket = io(URL);
