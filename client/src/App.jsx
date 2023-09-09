import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";
import { UI, shopModeAtom } from "./components/UI";
import { ScrollControls } from "@react-three/drei";
import { useAtom } from "jotai";

function App() {
  const [shopMode] = useAtom(shopModeAtom);
  return (
    <>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={shopMode ? 4 : 0}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <UI />
    </>
  );
}

export default App;
