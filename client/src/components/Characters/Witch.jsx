/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.11 Witch.glb -o Witch.jsx 
*/

import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Witch(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    "/models/characters/Witch.glb"
  );
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group name="Witch_Body" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Witch_Body_1"
              geometry={nodes.Witch_Body_1.geometry}
              material={materials.Purple}
              skeleton={nodes.Witch_Body_1.skeleton}
            />
            <skinnedMesh
              name="Witch_Body_2"
              geometry={nodes.Witch_Body_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Witch_Body_2.skeleton}
            />
            <skinnedMesh
              name="Witch_Body_3"
              geometry={nodes.Witch_Body_3.geometry}
              material={materials.Gold}
              skeleton={nodes.Witch_Body_3.skeleton}
            />
            <skinnedMesh
              name="Witch_Body_4"
              geometry={nodes.Witch_Body_4.geometry}
              material={materials.Brown2}
              skeleton={nodes.Witch_Body_4.skeleton}
            />
          </group>
          <skinnedMesh
            name="Witch_Feet"
            geometry={nodes.Witch_Feet.geometry}
            material={materials.Brown2}
            skeleton={nodes.Witch_Feet.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
          <group name="Witch_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Witch_Head_1"
              geometry={nodes.Witch_Head_1.geometry}
              material={materials.Purple}
              skeleton={nodes.Witch_Head_1.skeleton}
            />
            <skinnedMesh
              name="Witch_Head_2"
              geometry={nodes.Witch_Head_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Witch_Head_2.skeleton}
            />
            <skinnedMesh
              name="Witch_Head_3"
              geometry={nodes.Witch_Head_3.geometry}
              material={materials.Gold}
              skeleton={nodes.Witch_Head_3.skeleton}
            />
            <skinnedMesh
              name="Witch_Head_4"
              geometry={nodes.Witch_Head_4.geometry}
              material={materials.Hair_Black}
              skeleton={nodes.Witch_Head_4.skeleton}
            />
            <skinnedMesh
              name="Witch_Head_5"
              geometry={nodes.Witch_Head_5.geometry}
              material={materials.Brown}
              skeleton={nodes.Witch_Head_5.skeleton}
            />
          </group>
          <group name="Witch_Legs" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Witch_Legs_1"
              geometry={nodes.Witch_Legs_1.geometry}
              material={materials.Purple}
              skeleton={nodes.Witch_Legs_1.skeleton}
            />
            <skinnedMesh
              name="Witch_Legs_2"
              geometry={nodes.Witch_Legs_2.geometry}
              material={materials.Gold}
              skeleton={nodes.Witch_Legs_2.skeleton}
            />
            <skinnedMesh
              name="Witch_Legs_3"
              geometry={nodes.Witch_Legs_3.geometry}
              material={materials.Brown}
              skeleton={nodes.Witch_Legs_3.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/characters/Witch.glb");
