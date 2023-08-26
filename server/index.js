import { Server } from "socket.io";
import { map, items } from "./config.js";
import { updateGrid } from "./utils/pathFinder.js";
import {
  generateRandomHexColor,
  generateRandomPosition,
} from "./utils/character.js";
import {
  handleOnCharacterMove,
  handleOnDisconnect,
} from "./utils/socketEventHandlers.js";
export const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5173",
    // add multiple origins with an array of strings and regexps
  },
});

io.listen(3001);

export const characters = [];
export let connectedSocket;
// Update the grid map state according to the item positions
// and set walkable and unwalkable positions
updateGrid();

io.on("connection", (socket) => {
  connectedSocket = socket;
  console.log("user connected");
  // Generate a random position for the new character
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });
  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });
  io.emit("characters", characters);
  socket.on("move", handleOnCharacterMove);
  socket.on("disconnect", handleOnDisconnect);
});
