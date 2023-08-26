/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.11 Beach Character.glb 
*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import { userAtom } from "../SocketManager";
import { useAtom } from "jotai";
import { useGrid } from "../../hooks/useGrid";
const MOVEMENT_SPEED = 0.032;
export function BeachCharacter({
  hairColor = "white",
  topColor = "orange",
  bottomColor = "darkred",
  id,
  ...props
}) {
  const position = useMemo(() => props.position, []);
  const [path, setPath] = useState();
  const { gridToVector3 } = useGrid();

  useEffect(() => {
    const path = [];
    props.path?.forEach((gridPosition) => {
      path.push(gridToVector3(gridPosition));
    });
    setPath(path);
  }, [props.path]);

  const group = useRef();
  const { scene, materials, animations } = useGLTF(
    "/models/characters/Beach Character.glb"
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  const [user] = useAtom(userAtom);

  useFrame((state) => {
    if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
      const direction = group.current.position
        .clone()
        .sub(path[0])
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);
      group.current.position.sub(direction);
      group.current.lookAt(path[0]);
      setAnimation("CharacterArmature|Run");
    } else if (path?.length) {
      path.shift();
    } else {
      setAnimation("CharacterArmature|Idle");
    }
    if (id === user) {
      state.camera.position.x = group.current.position.x + 8;
      state.camera.position.y = group.current.position.y + 8;
      state.camera.position.z = group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }
  });

  return (
    <group
      ref={group}
      {...props}
      position={position}
      dispose={null}
      name={`character-${id}`}
    >
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group name="Beach_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Beach_Feet_1"
              geometry={nodes.Beach_Feet_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Beach_Feet_1.skeleton}
            />
            <skinnedMesh
              name="Beach_Feet_2"
              geometry={nodes.Beach_Feet_2.geometry}
              material={materials.Red_Dark}
              skeleton={nodes.Beach_Feet_2.skeleton}
            />
          </group>
          <group name="Beach_Legs" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Beach_Legs_1"
              geometry={nodes.Beach_Legs_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Beach_Legs_1.skeleton}
            />
            <skinnedMesh
              name="Beach_Legs_2"
              geometry={nodes.Beach_Legs_2.geometry}
              material={materials.Red_Dark}
              skeleton={nodes.Beach_Legs_2.skeleton}
            >
              <meshBasicMaterial color={bottomColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Beach_Legs_3"
              geometry={nodes.Beach_Legs_3.geometry}
              material={materials.White}
              skeleton={nodes.Beach_Legs_3.skeleton}
            />
          </group>
          <group name="Beach_Body" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Beach_Body_1"
              geometry={nodes.Beach_Body_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Beach_Body_1.skeleton}
            />
            <skinnedMesh
              name="Beach_Body_2"
              geometry={nodes.Beach_Body_2.geometry}
              material={materials.LightBrown}
              skeleton={nodes.Beach_Body_2.skeleton}
            >
              <meshBasicMaterial color={topColor} />
            </skinnedMesh>
          </group>
          <group name="Beach_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Beach_Head_1"
              geometry={nodes.Beach_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Beach_Head_1.skeleton}
            />
            <skinnedMesh
              name="Beach_Head_2"
              geometry={nodes.Beach_Head_2.geometry}
              material={materials.Eyebrows}
              skeleton={nodes.Beach_Head_2.skeleton}
            />
            <skinnedMesh
              name="Beach_Head_3"
              geometry={nodes.Beach_Head_3.geometry}
              material={materials.Eye}
              skeleton={nodes.Beach_Head_3.skeleton}
            />
            <skinnedMesh
              name="Beach_Head_4"
              geometry={nodes.Beach_Head_4.geometry}
              material={materials.Hair}
              skeleton={nodes.Beach_Head_4.skeleton}
            >
              <meshBasicMaterial color={hairColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Beach_Head_5"
              geometry={nodes.Beach_Head_5.geometry}
              material={materials.Earrings}
              skeleton={nodes.Beach_Head_5.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/characters/Beach Character.glb");
