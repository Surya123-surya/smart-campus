import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import '../styles/App.css'

export default function CampusModel() {
  const controls = useRef()
  const [mode, setMode] = useState('rotate')
  const [highlightedName, setHighlightedName] = useState('')
  const [aloneUuid, setAloneUuid] = useState(null)
  const [selectMode, setSelectMode] = useState(null)
  const [fromBuilding, setFromBuilding] = useState(null)
  const [toBuilding, setToBuilding] = useState(null)
  const [pathActive, setPathActive] = useState(false)

  const resetView = () => {
    if (controls.current) {
      controls.current.reset()
      controls.current.enabled = true
    }
    setAloneUuid(null)
    setPathActive(false)
  }

  return (
    <div className="campus-model">
      <div className="campus-model-toolbar">
        <span>AUSKETCH Model Viewer</span>
        <div className="campus-model-status">
          <span>{highlightedName ? `Highlighted: ${highlightedName}` : 'No building selected'}</span>
          <span>From: {fromBuilding?.name || 'None'}</span>
          <span>To: {toBuilding?.name || 'None'}</span>
          {aloneUuid ? (
            <button type="button" className="campus-model-button" onClick={() => setAloneUuid(null)}>
              Show All
            </button>
          ) : null}
        </div>
        <div className="campus-model-toggle">
          <button
            type="button"
            className={`campus-model-button ${mode === 'rotate' ? 'active' : ''}`}
            onClick={() => setMode('rotate')}
          >
            Rotate
          </button>
          <button
            type="button"
            className={`campus-model-button ${mode === 'walk' ? 'active' : ''}`}
            onClick={() => setMode('walk')}
          >
            Walk
          </button>
          <button
            type="button"
            className={`campus-model-button ${selectMode === 'from' ? 'active' : ''}`}
            onClick={() => setSelectMode(selectMode === 'from' ? null : 'from')}
          >
            Set From
          </button>
          <button
            type="button"
            className={`campus-model-button ${selectMode === 'to' ? 'active' : ''}`}
            onClick={() => setSelectMode(selectMode === 'to' ? null : 'to')}
          >
            Set To
          </button>
          <button
            type="button"
            className="campus-model-button"
            disabled={!fromBuilding || !toBuilding}
            onClick={() => {
              if (fromBuilding && toBuilding) {
                setPathActive(true)
                setAloneUuid(null)
                setSelectMode(null)
              }
            }}
          >
            Navigate
          </button>
          <button type="button" className="campus-model-reset" onClick={resetView}>
            Reset
          </button>
        </div>
      </div>
      <Canvas
        camera={{ position: [0, 120, -260], fov: 90, near: 0.1, far: 10000 }}
        className="campus-model-canvas"
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 2, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <Model
            aloneUuid={aloneUuid}
            selectMode={selectMode}
            fromBuilding={fromBuilding}
            toBuilding={toBuilding}
            pathActive={pathActive}
            onHighlight={(name, isHighlighted) => setHighlightedName(isHighlighted ? name : '')}
            onViewAlone={(uuid, name) => {
              setAloneUuid(uuid)
              setHighlightedName(name)
              setPathActive(false)
            }}
            onSelectBuilding={(building) => {
              if (selectMode === 'from') {
                setFromBuilding(building)
                setSelectMode(null)
              }
              if (selectMode === 'to') {
                setToBuilding(building)
                setSelectMode(null)
              }
            }}
          />
          <Environment preset="city" />
        </Suspense>
        <CameraControls mode={mode} controls={controls} />
      </Canvas>
    </div>
  )
}

function CameraControls({ mode, controls: controlsRef }) {
  const controls = useRef()
  const { camera, gl, scene } = useThree()
  const dragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const forward = useRef(new THREE.Vector3())
  const raycaster = useRef(new THREE.Raycaster())

  useEffect(() => {
    if (controls.current) {
      controls.current.enabled = mode === 'rotate'
    }
  }, [mode])

  useFrame(() => {
    controls.current?.update()
  })

  useEffect(() => {
    const canvas = gl.domElement
    canvas.style.touchAction = 'none'

    const handlePointerDown = (event) => {
      if (mode !== 'walk' || event.button !== 0 || !event.isPrimary) return
      event.preventDefault()
      dragging.current = true
      lastPointer.current.x = event.clientX
      lastPointer.current.y = event.clientY
      controls.current.enabled = false
      canvas.style.cursor = 'grabbing'
    }

    const handleCanvasTap = (event) => {
      if (!event.isPrimary || event.button !== 0) return
      const rect = canvas.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.current.setFromCamera(mouse, camera)
      const intersects = raycaster.current.intersectObjects(scene.children, true)

      let point = new THREE.Vector3()
      if (intersects.length > 0) {
        point.copy(intersects[0].point)
      } else {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        raycaster.current.ray.intersectPlane(plane, point)
      }

      if (point) {
        console.log(`Tapped world point: x=${point.x.toFixed(2)}, y=${point.y.toFixed(2)}, z=${point.z.toFixed(2)}`)
      }
    }

    const handlePointerMove = (event) => {
      if (!dragging.current || mode !== 'walk') return
      const dx = event.clientX - lastPointer.current.x
      const dy = event.clientY - lastPointer.current.y
      lastPointer.current.x = event.clientX
      lastPointer.current.y = event.clientY

      camera.getWorldDirection(forward.current)
      forward.current.y = 0
      forward.current.normalize()
      if (forward.current.lengthSq() === 0) return

      const right = new THREE.Vector3().crossVectors(forward.current, camera.up).normalize()
      const speed = 0.08
      const forwardAmount = -dy * speed
      const rightAmount = dx * speed

      camera.position.addScaledVector(forward.current, forwardAmount)
      camera.position.addScaledVector(right, rightAmount)
      controls.current.target.addScaledVector(forward.current, forwardAmount)
      controls.current.target.addScaledVector(right, rightAmount)
      controls.current.update()
    }

    const handleWheel = (event) => {
      if (mode !== 'walk') return
      event.preventDefault()
      camera.getWorldDirection(forward.current)
      forward.current.y = 0
      forward.current.normalize()
      if (forward.current.lengthSq() === 0) return

      const wheelSpeed = 0.05
      const forwardAmount = -event.deltaY * wheelSpeed

      camera.position.addScaledVector(forward.current, forwardAmount)
      controls.current.target.addScaledVector(forward.current, forwardAmount)
      controls.current.update()
    }

    const handlePointerUp = () => {
      if (!dragging.current) return
      dragging.current = false
      if (mode === 'rotate') {
        controls.current.enabled = true
      }
      canvas.style.cursor = 'grab'
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handleCanvasTap)
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handleCanvasTap)
      canvas.removeEventListener('wheel', handleWheel)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [camera, controls, gl, mode, scene])

  useEffect(() => {
    if (controlsRef && controlsRef.current) {
      controlsRef.current = controls.current
    }
  }, [controlsRef])

  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enablePan={false}
      enableRotate={mode === 'rotate'}
      enableZoom
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.7}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
      makeDefault
    />
  )
}

function Model({ aloneUuid, selectMode, fromBuilding, toBuilding, pathActive, onHighlight, onViewAlone, onSelectBuilding }) {
  const gltf = useGLTF('/AUSKETCH.glb')
  const { gl } = useThree()
  const originalMaterials = useRef(new Map())
  const originalRoadMaterials = useRef(new Map())
  const savedVisibility = useRef(new Map())
  const highlightColor = new THREE.Color(0xffaa00)
  const roadColor = new THREE.Color(0x2196f3)

  const getMaterials = (material) => (Array.isArray(material) ? material : [material])

  const restoreMesh = (mesh) => {
    const saved = originalMaterials.current.get(mesh.uuid)
    if (!saved) return
    mesh.material = saved
    originalMaterials.current.delete(mesh.uuid)
  }

  const highlightMesh = (mesh) => {
    const currentMaterial = mesh.material
    const materials = getMaterials(currentMaterial)
    if (!materials.length) return

    originalMaterials.current.set(mesh.uuid, currentMaterial)

    const cloned = materials.map((mat) => {
      if (!mat) return mat
      const clone = mat.clone()
      if ('emissive' in clone) {
        clone.emissive = clone.emissive ? clone.emissive.clone() : new THREE.Color(0x000000)
        clone.emissive.copy(highlightColor)
      }
      return clone
    })

    mesh.material = Array.isArray(currentMaterial) ? cloned : cloned[0]
  }

  const restoreRoad = (mesh) => {
    const saved = originalRoadMaterials.current.get(mesh.uuid)
    if (!saved) return
    mesh.material = saved
    originalRoadMaterials.current.delete(mesh.uuid)
  }

  const highlightRoad = (mesh) => {
    if (originalRoadMaterials.current.has(mesh.uuid)) return
    const currentMaterial = mesh.material
    const materials = getMaterials(currentMaterial)
    if (!materials.length) return

    originalRoadMaterials.current.set(mesh.uuid, currentMaterial)

    const cloned = materials.map((mat) => {
      if (!mat) return mat
      const clone = mat.clone()
      if ('color' in clone) {
        clone.color = clone.color ? clone.color.clone() : new THREE.Color(0xffffff)
        clone.color.copy(roadColor)
      }
      clone.transparent = true
      clone.opacity = 0.65
      return clone
    })

    mesh.material = Array.isArray(currentMaterial) ? cloned : cloned[0]
  }

  const getObjectName = (obj) => {
    return obj.name || obj.parent?.name || 'Unnamed Building'
  }

  const handleSelect = (event) => {
    event.stopPropagation()
    const mesh = event.object
    if (!mesh || !mesh.material) return

    const name = getObjectName(mesh)
    const position = new THREE.Vector3()
    mesh.getWorldPosition(position)
    onSelectBuilding?.({ uuid: mesh.uuid, name, position })

    if (originalMaterials.current.has(mesh.uuid)) {
      restoreMesh(mesh)
      onHighlight?.('', false)
    } else {
      highlightMesh(mesh)
      onHighlight?.(name, true)
    }
  }

  const handleViewAlone = (event) => {
    event.stopPropagation()
    const mesh = event.object
    if (!mesh) return

    const name = getObjectName(mesh)
    onViewAlone?.(mesh.uuid, name)
  }

  useEffect(() => {
    const setVisibility = (uuid) => {
      gltf.scene.traverse((obj) => {
        if (!obj.isMesh) return
        if (!savedVisibility.current.has(obj.uuid)) {
          savedVisibility.current.set(obj.uuid, obj.visible)
        }
        obj.visible = obj.uuid === uuid
      })
    }

    const restoreVisibility = () => {
      gltf.scene.traverse((obj) => {
        if (!obj.isMesh) return
        if (savedVisibility.current.has(obj.uuid)) {
          obj.visible = savedVisibility.current.get(obj.uuid)
        }
      })
      savedVisibility.current.clear()
    }

    if (aloneUuid) {
      setVisibility(aloneUuid)
    } else {
      restoreVisibility()
    }
  }, [aloneUuid, gltf.scene])

  useEffect(() => {
    const projectToSegment = (point, start, end) => {
      const seg = new THREE.Vector3().subVectors(end, start)
      const pt = new THREE.Vector3().subVectors(point, start)
      const segLengthSq = seg.lengthSq()
      if (segLengthSq === 0) return { t: 0, projection: start.clone() }
      const t = pt.dot(seg) / segLengthSq
      const projection = new THREE.Vector3().copy(seg).multiplyScalar(t).add(start)
      return { t, projection }
    }

    const isRoadMesh = (mesh) => {
      return mesh.name && /^road\d+$/i.test(mesh.name)
    }

    const restoreAllRoads = () => {
      originalRoadMaterials.current.forEach((_, uuid) => {
        const mesh = gltf.scene.getObjectByProperty('uuid', uuid)
        if (mesh && mesh.isMesh) {
          restoreRoad(mesh)
        }
      })
    }

    if (!pathActive || !fromBuilding || !toBuilding) {
      restoreAllRoads()
      return
    }

    const start = fromBuilding.position
    const end = toBuilding.position
    const threshold = 4

    gltf.scene.traverse((obj) => {
      if (!obj.isMesh) return
      if (!isRoadMesh(obj)) return
      const center = new THREE.Vector3()
      obj.getWorldPosition(center)
      const { t, projection } = projectToSegment(center, start, end)
      const dist = center.distanceTo(projection)
      if (t >= 0 && t <= 1 && dist <= threshold) {
        highlightRoad(obj)
      } else {
        restoreRoad(obj)
      }
    })

    return () => {
      restoreAllRoads()
    }
  }, [pathActive, fromBuilding, toBuilding, gltf.scene])

  return (
    <primitive
      object={gltf.scene}
      scale={0.9}
      position={[0, -1.2, 0]}
      rotation={[0, Math.PI, 0]}
      onPointerOver={() => { gl.domElement.style.cursor = 'grab' }}
      onPointerOut={() => { gl.domElement.style.cursor = 'auto' }}
      onPointerDown={() => { gl.domElement.style.cursor = 'grabbing' }}
      onPointerUp={() => { gl.domElement.style.cursor = 'grab' }}
      onClick={handleSelect}
      onDoubleClick={handleViewAlone}
    />
  )
}

function RoadPath({ start, end }) {
  const pathRef = useRef()
  const [position, setPosition] = useState([0, 0, 0])
  const [rotation, setRotation] = useState([0, 0, 0])
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (!start || !end) return
    const delta = new THREE.Vector3().subVectors(end, start)
    const distance = delta.length()
    const yaw = Math.atan2(delta.z, delta.x)
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    mid.y += 0.05
    setPosition([mid.x, mid.y, mid.z])
    setRotation([0, yaw, 0])
    setLength(distance)
  }, [start, end])

  return (
    <mesh ref={pathRef} position={position} rotation={rotation}>
      <boxGeometry args={[length, 0.1, 1]} />
      <meshBasicMaterial color="#2196f3" transparent opacity={0.65} />
    </mesh>
  )
}
