import { useGLTF } from '@react-three/drei'

export default function Model() {
  const gltf = useGLTF('/models/model.glb')

  return (
    <primitive 
      object={gltf.scene} 
      scale={1} 
      position={[0, 0, 0]} 
    />
  )
}