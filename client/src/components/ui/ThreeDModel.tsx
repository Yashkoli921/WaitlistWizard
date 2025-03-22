import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import { evaluate } from 'mathjs';
import * as THREE from 'three';

interface ThreeDModelProps {
  formula?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  resolution?: number;
}

const ThreeDModel = ({ 
  formula = "sin(sqrt(x**2+y**2))",
  xMin = -5,
  xMax = 5,
  yMin = -5,
  yMax = 5,
  resolution = 50
}: ThreeDModelProps) => {
  
  const meshData = useMemo(() => {
    if (!formula) return null;
    
    try {
      // Create grid of vertices
      const vertices = [];
      const indices = [];
      const xStep = (xMax - xMin) / resolution;
      const yStep = (yMax - yMin) / resolution;
      
      // Generate vertices
      for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
          const x = xMin + i * xStep;
          const y = yMin + j * yStep;
          let z = 0;
          
          try {
            z = evaluate(formula, { x, y });
            if (isNaN(z) || !isFinite(z)) z = 0;
            // Clamp extreme values
            z = Math.min(Math.max(z, -10), 10);
          } catch (e) {
            z = 0;
          }
          
          vertices.push(x, z, y); // Note: y and z are swapped to get a "standard" 3D graph orientation
        }
      }
      
      // Generate indices for faces
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const a = i * (resolution + 1) + j;
          const b = i * (resolution + 1) + j + 1;
          const c = (i + 1) * (resolution + 1) + j + 1;
          const d = (i + 1) * (resolution + 1) + j;
          
          // Two triangles per grid cell
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
      
      // Generate colors
      const colors = [];
      for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
          const vertexIndex = i * (resolution + 1) + j;
          const z = vertices[vertexIndex * 3 + 1]; // y-value (height)
          
          // Map z value to color (gold for high values, navy blue for low)
          const t = (z + 10) / 20; // Normalize z to [0,1]
          const r = 0.1 + 0.7 * t; // Dark blue to gold
          const g = 0.1 + 0.5 * t;
          const b = 0.5 - 0.3 * t;
          
          colors.push(r, g, b);
        }
      }
      
      return { vertices, indices, colors };
    } catch (error) {
      console.error("Error generating 3D mesh data:", error);
      return null;
    }
  }, [formula, xMin, xMax, yMin, yMax, resolution]);

  if (!meshData) {
    return <div className="flex items-center justify-center h-full">Error generating 3D model</div>;
  }

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
      <color attach="background" args={['#0A1A2F']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#D4AF37" />
      <CustomMesh meshData={meshData} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <gridHelper args={[10, 10, '#222222', '#333333']} rotation={[Math.PI / 2, 0, 0]} />
      <axesHelper args={[5]} />
    </Canvas>
  );
};

interface CustomMeshProps {
  meshData: {
    vertices: number[];
    indices: number[];
    colors: number[];
  };
}

const CustomMesh = ({ meshData }: CustomMeshProps) => {
  const { vertices, indices, colors } = meshData;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // Set vertices
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    // Set colors
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Set faces
    geo.setIndex(indices);
    
    // Compute normals for proper lighting
    geo.computeVertexNormals();
    
    return geo;
  }, [vertices, indices, colors]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
};

export default ThreeDModel;
