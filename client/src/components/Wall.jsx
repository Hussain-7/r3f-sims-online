import React from "react";
import * as THREE from "three";
import { mapAtom } from "./SocketManager";
import { useAtom } from "jotai";

const Wall = ({ x, y, rotation = [0, 0, 0] }) => {
  const [map] = useAtom(mapAtom);
  return (
    <>
      <mesh position={[x, 0.5, y]} rotation={rotation}>
        <planeGeometry args={[map.size[0], 1]} />
        <meshBasicMaterial color="#444654" opacity={0.5} transparent={true} />
      </mesh>
    </>
  );
};

export default Wall;
