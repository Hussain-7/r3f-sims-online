import { map } from "../config.js";
import { grid } from "./pathFinder.js";
export const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

export const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
