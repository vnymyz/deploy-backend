import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development"
    ? undefined
    : "https://api.render.com/deploy/srv-cl1itn8310os73da4eag?key=y5jFOc1d_yM";

export const socket = io(URL);
