import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model() {
  const gltf = useGLTF('/models/model.glb')
  return <primitive object={gltf.scene} scale={1} />
}

export default function ModelScene() {
  return (
    <Canvas style={{ height: "400px" }} camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <directionalLight position={[2, 2, 2]} />
      <Model />
      <OrbitControls />
    </Canvas>
  )
}