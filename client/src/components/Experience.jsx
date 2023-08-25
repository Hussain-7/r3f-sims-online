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
import { Item } from "./Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGrid";

export const Experience = () => {
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

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <OrbitControls />
      {/* <ContactShadows blur={2} /> */}
      {map?.items?.map((item, index) => (
        <Item key={`${item.name}-${index}`} item={item} />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.1}
        onClick={onCharacterMove}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map?.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
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
