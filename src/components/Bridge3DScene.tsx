import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, PerspectiveCamera, Environment, useTexture } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

// Animated Water Component
function Water() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[20, 10]} />
      <meshStandardMaterial 
        color="#1e40af" 
        transparent 
        opacity={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

// Bridge Component
function Bridge() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main Bridge Structure */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[8, 0.3, 2]} />
        <meshStandardMaterial 
          color="#71717a" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Bridge Railings */}
      <mesh position={[0, 1, 1.2]}>
        <boxGeometry args={[8, 0.8, 0.1]} />
        <meshStandardMaterial color="#52525b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1, -1.2]}>
        <boxGeometry args={[8, 0.8, 0.1]} />
        <meshStandardMaterial color="#52525b" metalness={0.8} />
      </mesh>

      {/* Support Pillars */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} position={[x, -0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Terrain Component
function Terrain({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={[8, 0.5, 8]} />
      <meshStandardMaterial 
        color={color}
        roughness={0.8}
      />
      {/* Ground Shadow */}
      <mesh position={[0, -0.3, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </mesh>
  );
}

// Interactive Booth Component
function Booth({ 
  position, 
  label, 
  color,
  onHover 
}: { 
  position: [number, number, number], 
  label: string, 
  color: string,
  onHover: (info: string | null) => void 
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  return (
    <group position={position}>
      {/* Main Booth Structure */}
      <mesh 
        ref={meshRef}
        castShadow
        onPointerOver={() => {
          setHovered(true);
          onHover(`${label}: Your gateway to ${label === 'Exporter' ? 'export projects as UAP files' : 'import and merge AI improvements'}`);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1.2, 0.8, 4]} />
        <meshStandardMaterial color={color} metalness={0.6} />
      </mesh>

      {/* Glowing Windows */}
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0.76]}>
          <planeGeometry args={[0.3, 0.5]} />
          <meshStandardMaterial 
            color="#ffeb3b"
            emissive="#ffeb3b"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Glow Effect */}
      <pointLight position={[0, 1, 0]} intensity={hovered ? 2 : 1} color={color} distance={5} />
    </group>
  );
}

// Moving UAP Component
function MovingUAP({ delay = 0 }: { delay?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.x = Math.sin(time * 0.3) * 6 - 2;
      meshRef.current.position.z = Math.cos(time * 0.5) * 1.5;
      meshRef.current.position.y = 2 + Math.sin(time * 0.8) * 0.3;
      meshRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      <Sphere args={[0.3, 16, 16]} castShadow>
        <meshStandardMaterial 
          color="#ec4899" 
          emissive="#ec4899"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      {/* UAP Label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
      >
        .uap
      </Text>
    </group>
  );
}

// App Nodes/Bubbles
function AppNode({ position, label, color }: { position: [number, number, number], label: string, color: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <Sphere 
        args={[0.4, 16, 16]} 
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </Sphere>
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Main Scene Component
function Scene({ onHoverInfo }: { onHoverInfo: (info: string | null) => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 15]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        minDistance={5}
        maxDistance={30}
      />

      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 5, -5]} intensity={0.5} color="#3b82f6" />

      {/* NO-CODE COUNTRY Terrain (Left) */}
      <Terrain position={[-8, 0, 0]} color="#4ade80" />
      <Text
        position={[-8, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        fontWeight="bold"
      >
        NO-CODE COUNTRY
      </Text>

      {/* AI COUNTRY Terrain (Right) */}
      <Terrain position={[8, 0, 0]} color="#c084fc" />
      <Text
        position={[8, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        fontWeight="bold"
      >
        AI COUNTRY
      </Text>

      {/* Bridge */}
      <Bridge />

      {/* Animated Water */}
      <Water />

      {/* Booths */}
      <Booth 
        position={[-3.5, 1, 0]} 
        label="Exporter" 
        color="#3b82f6"
        onHover={onHoverInfo}
      />
      <Booth 
        position={[3.5, 1, 0]} 
        label="Importer" 
        color="#8b5cf6"
        onHover={onHoverInfo}
      />

      {/* App Nodes - NO-CODE COUNTRY */}
      <AppNode position={[-8, 1.5, 2]} label="Lovable" color="#ff6b9d" />
      <AppNode position={[-10, 1.5, -1]} label="Glide" color="#ffd43b" />
      <AppNode position={[-9, 1.5, 1]} label="Bubble" color="#4fb4e8" />
      <AppNode position={[-6, 1.5, -2]} label="Base24" color="#d4e157" />
      <AppNode position={[-7.5, 1.5, -3]} label="Softr" color="#ffa726" />

      {/* App Nodes - AI COUNTRY */}
      <AppNode position={[8, 1.5, 2]} label="ChatGPT" color="#ff69b4" />
      <AppNode position={[10, 1.5, -1]} label="Grok" color="#ff1493" />
      <AppNode position={[9, 1.5, 1.5]} label="DeepSeek" color="#ba68c8" />
      <AppNode position={[6.5, 1.5, -2]} label="Claude" color="#9575cd" />
      <AppNode position={[7.5, 1.5, 2.5]} label="Gemini" color="#b39ddb" />

      {/* Moving UAPs */}
      <MovingUAP delay={0} />
      <MovingUAP delay={2} />
      <MovingUAP delay={4} />

      <Environment preset="city" />
    </>
  );
}

// Main Component
export default function Bridge3DScene() {
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#0a0e1a',
        scale: 2,
        width: 1920,
        height: 1080
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'bridge-scene-hires.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="relative w-full h-[600px]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export HD Screenshot
        </Button>
      </div>

      {/* Hover Info */}
      {hoverInfo && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />
          <p>{hoverInfo}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-white text-xs max-w-xs">
        <p className="font-semibold mb-1">💡 Controls:</p>
        <p>• Drag to rotate • Scroll to zoom • Right-click to pan</p>
        <p>• Hover over booths for info</p>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="w-full h-full rounded-lg overflow-hidden">
        <Canvas shadows>
          <Suspense fallback={null}>
            <Scene onHoverInfo={setHoverInfo} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}