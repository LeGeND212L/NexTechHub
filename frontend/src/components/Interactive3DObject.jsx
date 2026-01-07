import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const AnimatedSphere = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Rotate the sphere continuously
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={1}
            floatIntensity={2}
        >
            <Sphere
                ref={meshRef}
                args={[1, 100, 100]}
                scale={hovered ? 1.2 : 1}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <MeshDistortMaterial
                    color="#0066ff"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
};

const Interactive3DObject = () => {
    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            minHeight: '500px'
        }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0080ff" />
                <AnimatedSphere />
                <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={2}
                    maxDistance={10}
                />
            </Canvas>
        </div>
    );
};

export default Interactive3DObject;
