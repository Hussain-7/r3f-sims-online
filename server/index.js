import fs from "fs";
import { Server } from "socket.io";
const origin = process.env.CLIENT_URL || "http://localhost:5173";
const io = new Server({
  cors: {
    origin,
  },
});

io.listen(3000);
console.log("Server started on port 3000, allowed cors origin: " + origin);

import { items } from "./config.js";
import {
  generateRandomPosition,
  findPath,
  updateGrid,
  loadRooms,
} from "./utils/index.js";

// ROOMS MANAGEMENT
export const rooms = [];
loadRooms();

// SOCKET MANAGEMENT
io.on("connection", (socket) => {
  try {
    let room = null;
    let character = null;

    socket.emit("welcome", {
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        nbCharacters: room.characters.length,
      })),
      items,
    });

    socket.on("joinRoom", (roomId, opts) => {
      room = rooms.find((room) => room.id === roomId);
      if (!room) {
        return;
      }
      socket.join(room.id);
      character = {
        id: socket.id,
        session: parseInt(Math.random() * 1000),
        position: generateRandomPosition(room),
        avatarUrl: opts.avatarUrl,
      };
      room.characters.push(character);

      socket.emit("roomJoined", {
        map: {
          gridDivision: room.gridDivision,
          size: room.size,
          items: room.items,
        },
        characters: room.characters,
        id: socket.id,
      });
      onRoomUpdate();
    });

    const onRoomUpdate = () => {
      io.to(room.id).emit("characters", room.characters);
      io.emit(
        "rooms",
        rooms.map((room) => ({
          id: room.id,
          name: room.name,
          nbCharacters: room.characters.length,
        }))
      );
    };

    socket.on("leaveRoom", () => {
      if (!room) {
        return;
      }
      socket.leave(room.id);
      room.characters.splice(
        room.characters.findIndex((character) => character.id === socket.id),
        1
      );
      onRoomUpdate();
      room = null;
    });

    socket.on("characterAvatarUpdate", (avatarUrl) => {
      character.avatarUrl = avatarUrl;
      io.to(room.id).emit("characters", room.characters);
    });

    socket.on("move", (from, to) => {
      const path = findPath(room, from, to);
      if (!path) {
        return;
      }
      character.position = from;
      character.path = path;
      io.to(room.id).emit("playerMove", character);
    });

    socket.on("dance", () => {
      io.to(room.id).emit("playerDance", {
        id: socket.id,
      });
    });

    socket.on("chatMessage", (message) => {
      io.to(room.id).emit("playerChatMessage", {
        id: socket.id,
        message,
      });
    });

    socket.on("passwordCheck", (password) => {
      if (password === room.password) {
        socket.emit("passwordCheckSuccess");
        character.canUpdateRoom = true;
      } else {
        socket.emit("passwordCheckFail");
      }
    });

    socket.on("itemsUpdate", async (items) => {
      if (!character.canUpdateRoom) {
        return;
      }
      if (!items || items.length === 0) {
        return; // security
      }
      room.items = items;
      updateGrid(room);
      room.characters.forEach((character) => {
        character.path = [];
        character.position = generateRandomPosition(room);
      });
      io.to(room.id).emit("mapUpdate", {
        map: {
          gridDivision: room.gridDivision,
          size: room.size,
          items: room.items,
        },
        characters: room.characters,
      });

      fs.writeFileSync("rooms.json", JSON.stringify(rooms, null, 2));
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      if (room) {
        room.characters.splice(
          room.characters.findIndex((character) => character.id === socket.id),
          1
        );
        onRoomUpdate();
        room = null;
      }
    });
  } catch (ex) {
    console.log(ex); // Big try catch to avoid crashing the server (best would be to handle all errors properly...)
  }
});
