import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import { BeachCharacter } from "./Characters";
import { useAtom } from "jotai";
import * as THREE from "three";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import { useEffect, useRef, useState } from "react";
import { Item } from "./Environment/Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGrid";
import Wall from "./Environment/Wall";
import { buildModeAtom, draggedItemAtom, draggedItemRotationAtom } from "./UI";

export const Experience = () => {
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const { vector3ToGrid, gridToVector3 } = useGrid();
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [items, setItems] = useState(map.items);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const scene = useThree((state) => state.scene);
  const [user] = useAtom(userAtom);
  const onPlaneClicked = (e) => {
    if (!buildMode) {
      const character = scene.getObjectByName(`character-${user}`);
      if (!character) {
        return;
      }
      socket.emit(
        "move",
        vector3ToGrid(character.position),
        vector3ToGrid(e.point)
      );
    } else {
      if (draggedItem !== null) {
        if (canDrop) {
          setItems((prev) => {
            const newItems = [...prev];
            newItems[draggedItem].gridPosition = vector3ToGrid(e.point);
            newItems[draggedItem].rotation = draggedItemRotation;
            return newItems;
          });
        }
        setDraggedItem(null);
      }
    }
  };

  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom
  );
  const [dragPosition, setDragPosition] = useState(null);
  const [canDrop, setCanDrop] = useState(false);
  useEffect(() => {
    if (!draggedItem) return;

    const item = items[draggedItem];
    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];

    let droppable = true;
    // check if item is in bounds in terms of width
    if (
      dragPosition[0] < 0 ||
      dragPosition[0] + width > map.size[0] * map.gridDivision
    ) {
      droppable = false;
    }
    // check if item is in bounds in terms of height
    if (
      dragPosition[1] < 0 ||
      dragPosition[1] + height > map.size[1] * map.gridDivision
    ) {
      droppable = false;
    }
    // check if items is not colliding with other items
    if (!item.walkable && !item.wall) {
      items.forEach((otherItem, index) => {
        if (index === draggedItem) return;

        if (otherItem.walkable || otherItem.wall) return;
        const otherWidth =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[1]
            : otherItem.size[0];
        const otherHeight =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[0]
            : otherItem.size[1];
        // just check if the item is not colliding with other items
        if (
          dragPosition[0] + width > otherItem.gridPosition[0] &&
          dragPosition[0] < otherItem.gridPosition[0] + otherWidth &&
          dragPosition[1] + height > otherItem.gridPosition[1] &&
          dragPosition[1] < otherItem.gridPosition[1] + otherHeight
        ) {
          droppable = false;
        }
      });
    }
    setCanDrop(droppable);
  }, [dragPosition, draggedItem, items]);
  const controls = useRef();
  const state = useThree((state) => state);
  useEffect(() => {
    if (buildMode) {
      state.camera.position.set(30, 10, 16);
      controls.current.target.set(0, 0, 0);
    }
  }, [buildMode]);
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <OrbitControls
        ref={controls}
        // How much we can zoom in or out
        minDistance={5}
        maxDistance={25}
        // How far we can orbit vertically, upper and lower limits.
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        // not allow going below ground
        screenSpacePanning={false}
      />
      {(buildMode ? items : map?.items).map((item, index) => (
        <Item
          key={`${item.name}-${index}`}
          item={item}
          onClick={() => {
            if (!buildMode) return;
            setDraggedItem((prev) => (prev === null ? index : prev));
            setDraggedItemRotation(item.rotation || 0);
          }}
          isDragging={draggedItem === index}
          dragPosition={dragPosition}
          dragRotation={draggedItemRotation}
          canDrop={canDrop}
        />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onPlaneClicked}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        onPointerMove={(e) => {
          if (!buildMode) return;
          const newPosition = vector3ToGrid(e.point);
          if (
            !dragPosition ||
            newPosition[0] !== dragPosition[0] ||
            newPosition[1] !== dragPosition[1]
          ) {
            setDragPosition(newPosition);
          }
        }}
        position-x={map?.size[0] / 2}
        position-z={map?.size[1] / 2}
      >
        <planeGeometry args={map?.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={10} />

      {/* Walls around the grid */}
      <Wall x={map?.size[0] / 2} y={0} />
      <Wall x={map?.size[0] / 2} y={map.size[0]} />
      <Wall
        x={map?.size[0]}
        y={map?.size[0] / 2}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Wall x={0} y={map.size[0] / 2} rotation={[0, Math.PI / 2, 0]} />
      {!buildMode &&
        characters?.map((character) => (
          <BeachCharacter
            key={character?.id}
            id={character?.id}
            path={character?.path}
            position={gridToVector3(character?.position)}
            hairColor={character?.hairColor}
            topColor={character?.topColor}
            bottomColor={character?.bottomColor}
          />
        ))}
    </>
  );
};
