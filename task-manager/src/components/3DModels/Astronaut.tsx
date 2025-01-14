import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRef } from "react";
import * as THREE from "three";

const AstronautModel = () => {
  const model = useLoader(GLTFLoader, "/src/assets/glb/cute_astronaut.glb");
  const astronautRef = useRef<THREE.Object3D>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()/6;
    if (astronautRef.current) {
      const radius = 5; 
      astronautRef.current.position.x = Math.sin(time) * radius; 
      astronautRef.current.position.z = Math.cos(time) * radius; 
      astronautRef.current.position.y = Math.sin(time * 1) * 1;
      astronautRef.current.rotation.y += 0.01; 
      astronautRef.current.rotation.x += 0.005; 
    }
  });

  return <primitive ref={astronautRef} object={model.scene} scale={0.9} />;
};

const Astronaut: React.FC = () => {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
      camera={{ position: [0, 1, 5], fov: 50 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} />
      <Stars radius={120} depth={30} count={4000} factor={6} fade />
      <AstronautModel />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default Astronaut;