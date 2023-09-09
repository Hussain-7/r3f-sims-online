import { Server } from "socket.io";
import { map, items } from "./config.js";
import { findPath, updateGrid } from "./utils/pathFinder.js";
import {
  generateRandomHexColor,
  generateRandomPosition,
} from "./utils/character.js";

export const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

export const characters = [];
// Update the grid map state according to the item positions
// and set walkable and unwalkable positions
updateGrid();
io.on("connection", (socket) => {
  console.log("user connected");
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
    avatarUrl: "https://models.readyplayer.me/64e3dccdc603b299c00ec9fa.glb",
  });
  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);
  socket.on("characterAvatarUpdate", (avatarUrl) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.avatarUrl = avatarUrl;
    io.emit("characters", characters);
  });
  socket.on("move", (from, to) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    const path = findPath(from, to);
    if (!path) {
      return;
    }
    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
  });

  socket.on("itemsUpdate", (items) => {
    map.items = items;
    characters.forEach((character) => {
      character.path = [];
      character.position = generateRandomPosition();
    });
    updateGrid();
    io.emit("mapUpdate", {
      map,
      characters,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});
