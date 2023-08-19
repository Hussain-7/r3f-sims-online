import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { BeachCharacter } from "./Characters";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <ContactShadows blur={2} />
      <BeachCharacter position={[0, 0, 0]} hairColor="red" />
      <BeachCharacter position={[1, 0, 0]} />
      <BeachCharacter position={[2, 0, 0]} />
      <BeachCharacter position={[3, 0, 0]} />
    </>
  );
};
