import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <SocketManager />
      <Canvas
        shadows
        camera={{
          position: [30, 10, 16],
          fov: 30,
        }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
