import { useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import { mapAtom } from "./SocketManager";
import { useAtom } from "jotai";
import { SkeletonUtils } from "three-stdlib";

export const Item = ({ item }) => {
  const { name, gridPosition, size, rotation } = item;
  const [map] = useAtom(mapAtom);
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  useEffect(() => {
    if (!map) return;
    console.log([size[0] / map.gridDivision, 0, size[1] / map.gridDivision]);
  }, [map]);
  return (
    <primitive
      object={clone}
      position={[
        size[0] / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
        0,
        size[1] / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
      ]}
      rotation-y={(rotation || 0) * (Math.PI / 2)}
    />
  );
};
