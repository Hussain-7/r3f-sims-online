import { Server } from "socket.io";
import { map, items } from "./config.js";
import pathfinding from "pathfinding";
const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5173",
    // add multiple origins with an array of strings and regexps
  },
});

io.listen(3001);

const characters = [];

const grid = new pathfinding.Grid(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
);

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

const findPath = (start, end) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

const updateGrid = () => {
  map.items.forEach((item) => {
    if (item.walkable || item.wall) {
      return;
    }
    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid.setWalkableAt(
          item.gridPosition[0] + x,
          item.gridPosition[1] + y,
          false
        );
      }
    }
  });
};

updateGrid();

const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");

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

  socket.on("move", (from, to) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    const path = findPath(from, to);
    console.log("path", path);
    if (!path) {
      return;
    }
    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
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
