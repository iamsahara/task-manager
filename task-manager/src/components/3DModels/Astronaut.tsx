import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRef } from "react";
import * as THREE from "three";

const AstronautModel = () => {
  const model = useLoader(GLTFLoader, "/src/assets/glb/cute_astronaut.glb");
  const astronautRef = useRef<THREE.Object3D>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() / 10; 
    if (astronautRef.current) {
      const radius = 10; 
      astronautRef.current.position.x = Math.sin(time) * radius * 0.6; 
      astronautRef.current.position.z = Math.cos(time) * radius * 0.5; 
      astronautRef.current.position.y = Math.sin(time ) * 1; 
      astronautRef.current.rotation.y += 0.001; 
      astronautRef.current.rotation.x += 0.005; 
      astronautRef.current.rotation.z += 0.008; 
    }
  });

  return <primitive ref={astronautRef} object={model.scene} scale={2} />;
};

const Astronaut: React.FC = () => {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      camera={{ position: [20, 2, 6], fov: 50 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} />
      <Stars radius={100} depth={30} count={3000} factor={6} fade />
      <AstronautModel />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        target={cameraTarget.current}
      />
    </Canvas>
  );
};

export default Astronaut;