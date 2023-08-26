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
import { useState } from "react";
import { Item } from "./Environment/Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGrid";
import Wall from "./Environment/Wall";

export const Experience = () => {
  const [buildMode, setBuildMode] = useState(false);
  const { vector3ToGrid, gridToVector3 } = useGrid();
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const scene = useThree((state) => state.scene);
  const [user] = useAtom(userAtom);
  const onCharacterMove = (e) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) {
      return;
    }
    socket.emit(
      "move",
      vector3ToGrid(character.position),
      vector3ToGrid(e.point)
    );
  };

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <OrbitControls />
      {map?.items?.map((item, index) => (
        <Item
          key={`${item.name}-${index}`}
          item={item}
          onClick={() =>
            setDraggedItem((prev) => (prev === null ? index : prev))
          }
          isDragging={draggedItem === index}
        />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onCharacterMove}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        onPointerMove={(e) => {
          if (!buildMode) return;
          const newPosition = vector3ToGrid(e.point);
          // if(!dragPosition || newPosition[0] !==d
        }}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map?.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={10} />

      {/* Walls around the grid */}
      <Wall x={map.size[0] / 2} y={0} />
      <Wall x={map.size[0] / 2} y={map.size[0]} />
      <Wall
        x={map.size[0]}
        y={map.size[0] / 2}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Wall x={0} y={map.size[0] / 2} rotation={[0, Math.PI / 2, 0]} />
      {characters?.map((character) => (
        <BeachCharacter
          key={character.id}
          id={character.id}
          path={character.path}
          position={gridToVector3(character.position)}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
    </>
  );
};
