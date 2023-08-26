import { io, characters, connectedSocket } from "../index.js";
import { findPath } from "./pathFinder.js";

export const handleOnCharacterMove = (from, to) => {
  const socket = connectedSocket;
  const character = characters.find((character) => character.id === socket.id);
  const path = findPath(from, to);
  console.log("path", path);
  if (!path) {
    return;
  }
  character.position = from;
  character.path = path;
  io.emit("playerMove", character);
};

export const handleOnDisconnect = () => {
  const socket = connectedSocket;
  console.log("user disconnected");
  characters.splice(
    characters.findIndex((character) => character.id === socket.id),
    1
  );
  io.emit("characters", characters);
};
