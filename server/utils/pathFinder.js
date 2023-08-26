import { map, items } from "../config.js";
import pathfinding from "pathfinding";


export const grid = new pathfinding.Grid(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
);

export const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

export const findPath = (start, end) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

export const updateGrid = () => {
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
