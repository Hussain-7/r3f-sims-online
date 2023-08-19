import { Environment, OrbitControls } from "@react-three/drei";
import { Adventurer } from "./Characters/Adventurer";
import { Witch } from "./Characters/Witch";
import { BeachCharacter } from "./Characters/BeachCharacter";
import { ScifiCharacter } from "./Characters/ScifiCharacter";
import { HoodedAdventurer } from "./Characters/HoodedAdventurer";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" background />
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <BeachCharacter position={[0, 0, 0]} hairColor="red" />
      <BeachCharacter position={[1, 0, 0]} />
      <BeachCharacter position={[2, 0, 0]} />
      <BeachCharacter position={[3, 0, 0]} />
    </>
  );
};
