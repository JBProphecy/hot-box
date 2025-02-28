////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import styles from "./Visualizer.module.css"
import useBezierCurve, { BezierCurveProps } from "./useBezierCurve"

import { requestCurrentlyPlayingData } from "@/api/spotify"
import { SpotifyContext, SpotifyContextType } from "@/app/context/SpotifyContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function smoothTransitionUnit(currentFrame: number, totalFrames: number) {
  const t: number = currentFrame / totalFrames

  return (3 * (1 - t) * t ** 2) + (t ** 3)
}

function doubleTransition(currentFrame: number, totalFrames: number) {
  return  (1/2) + (-1/2) * Math.cos((2 * Math.PI) * (currentFrame / totalFrames))
}

function getRandomIntRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CircularRotationAnimationProps = {
  minAngle: number
  maxAngle: number
  startFrame: number
  totalFrames: number
  currentFrame: number
}

function circularRotationAnimationCos(props: CircularRotationAnimationProps) {
  const { minAngle, maxAngle, startFrame, totalFrames, currentFrame } = props
  const center = (minAngle + maxAngle) / 2
  const amplitude = Math.abs(maxAngle - minAngle) / 2
  return center + (amplitude * Math.cos((2 * Math.PI) * ((startFrame + currentFrame) / totalFrames)))
}

function circularRotationAnimationSin(props: CircularRotationAnimationProps) {
  const { minAngle, maxAngle, startFrame, totalFrames, currentFrame } = props
  const center = (minAngle + maxAngle) / 2
  const amplitude = Math.abs(maxAngle - minAngle) / 2
  return center + (amplitude * Math.sin((2 * Math.PI) * ((startFrame + currentFrame) / totalFrames)))
}

function getCircularRotationAnimationSinDerivative(props: CircularRotationAnimationProps) {
  const { minAngle, maxAngle, startFrame, totalFrames, currentFrame } = props
  const amplitude = Math.abs(maxAngle - minAngle) / 2
  return (2 * Math.PI) * amplitude * Math.cos((2 * Math.PI) * ((startFrame + currentFrame) / totalFrames))
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SmoothOscillationZeroCenterProps = {
  start: number
  max: number
  startFrame: number
  totalFrames: number
  currentFrame: number
}

function smoothOscillationZeroCenter(props: SmoothOscillationZeroCenterProps) {
  const { start, max, startFrame, totalFrames, currentFrame } = props
  const amplitude = Math.abs(max - start) / 2
  return (1 * (amplitude * Math.cos((2 * Math.PI) * ((startFrame + currentFrame) / totalFrames))))
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const animationCurveProps: BezierCurveProps = {
  x0: 0, y0: 0,
  x1: 0.2, y1: 0,
  x2: 0.8, y2: 1,
  x3: 1, y3: 1
}

const animationCurve = useBezierCurve(animationCurveProps)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function Visualizer() {
  // Refs
  const pageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameID = useRef<number | null>(null)
  const cubeRef = useRef<THREE.Mesh | null>(null)

  // Effects
  useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])

  // Spotify
  const spotify: SpotifyContextType | undefined = useContext(SpotifyContext)
  if (typeof spotify === "undefined") { throw new Error("Missing Current Account Provider") }
  const [currentlyPlayingData, setCurrentlyPlayingData] = useState<any>(null)
  const [currentCover, setCurrentCover] = useState<string>("")

  const getCurrentlyPlayingData = async () => {
    if (!spotify.accessToken) { setCurrentlyPlayingData(null); return }
    const data = await requestCurrentlyPlayingData(spotify.accessToken)
    setCurrentlyPlayingData(data)
    if (data?.item?.album?.images[0]?.url) { setCurrentCover(data.item.album.images[0]?.url) }
    else { setCurrentCover("") }
  }

  useEffect(() => {
    getCurrentlyPlayingData()
    const interval = setInterval(() => { getCurrentlyPlayingData(); console.log("sent") }, 5000)
    return () => { clearInterval(interval) }
  }, [])

  useEffect(() => {
    if (cubeRef.current && Array.isArray(cubeRef.current.material)) {
      const textureLoader = new THREE.TextureLoader()
      const imageTexture = textureLoader.load(currentCover)
      const imageMaterial = cubeRef.current.material[4]
      if (imageMaterial instanceof THREE.MeshStandardMaterial) {
        imageMaterial.map = imageTexture
        imageMaterial.needsUpdate = true
      }
    }
  }, [currentCover])

  // THREE
  useEffect(() => {
    if (contentRef.current && canvasRef.current) {
      // Initialize Scene
      const width: number = contentRef.current.offsetWidth
      const height: number = contentRef.current.offsetHeight
  
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: canvasRef.current,
        antialias: true
      })
      renderer.setSize(width, height)
      camera.position.z = 3

      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;           // Adds inertia to the movement
      controls.dampingFactor = 0.25;          // Control damping factor for smooth stop after zoom
      controls.screenSpacePanning = false;    // Don't allow panning in screen space
      controls.maxDistance = 10;              // Maximum zoom out
      controls.minDistance = 2;               // Minimum zoom in
      controls.maxPolarAngle = Math.PI / 2;   // Limit the vertical rotation (can't rotate past the horizon)
      controls.minPolarAngle = 0;             // Prevent camera from rotating below the horizon
      controls.rotateSpeed = 0.8;             // Set the rotation speed
      controls.zoomSpeed = 1.2;               // Set the zoom speed
      controls.panSpeed = 0.5;                // Set the pan speed

      contentRef.current.appendChild(renderer.domElement)

      // Update Dimensions on Resize
      const updateDimensions = () => {
        if (contentRef.current) {
          const width: number = contentRef.current.offsetWidth
          const height: number = contentRef.current.offsetHeight
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.setSize(width, height)
        }
      }
      window.addEventListener("resize", updateDimensions)

      // Texture

      const textureLoader = new THREE.TextureLoader()
      const goldTexture = textureLoader.load("/textures/gold-screen.jpg")
      const imageTexture = textureLoader.load("/weed.jpg")

      const geometry = new THREE.BoxGeometry(2, 2, 0.05)

      const sideMaterial = new THREE.MeshStandardMaterial({ map: goldTexture })
      const goldMaterial = new THREE.MeshStandardMaterial({ map: goldTexture, metalness: 1, roughness: 0.5 })
      const imageMaterial = new THREE.MeshStandardMaterial({ map: imageTexture, roughness: 1, metalness: 1 })

      const materials = [
        sideMaterial, 
        sideMaterial, 
        sideMaterial, 
        sideMaterial, 
        imageMaterial, // front
        goldMaterial // back
      ]

      const cube = new THREE.Mesh(geometry, materials)
      cubeRef.current = cube
      scene.add(cube)

      // Lights

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
      scene.add(ambientLight)

      const frontLight = new THREE.PointLight(0xffffff, 500)
      frontLight.position.set(0, 0, 7)
      scene.add(frontLight)

      const backLight = new THREE.PointLight(0xffffff, 300)
      backLight.position.set(0, 0, -7)
      scene.add(backLight)

      const leftLight = new THREE.PointLight(0xffcc00, 500)
      leftLight.position.set(-7, 0, 0)
      scene.add(leftLight)

      const rightLight = new THREE.PointLight(0xffcc00, 500)
      rightLight.position.set(7, 0, 0)
      scene.add(rightLight)

      const topLight = new THREE.PointLight(0xffcc00, 500)
      topLight.position.set(0, 7, 0)
      scene.add(topLight)

      const bottomLight = new THREE.PointLight(0xffcc00, 500)
      bottomLight.position.set(0, -7, 0)
      scene.add(bottomLight)

      // ANIMATION VARIABLES
      let currentFrame: number = 0
    
      let totalFrames: number = 300
      let minimumX: number = -10
      let maximumX: number = 10
      let minimumY: number = -10
      let maximumY: number = 10

      // Spinning Animation Variables
      let isSpinning: boolean = false
      let spinInterval: number = getRandomIntRange(600, 1200) // 10-20s
      let spinFrame: number = 0
      let spinDuration: number = getRandomIntRange(120, 240)
      let spinCount: number = getRandomIntRange(1, 2)
      let spinDirection: number = 0
      const spinMultipliers: number[] = [-1, 1]

      // Front Flip Variables
      let isFlipping: boolean = false
      let flipInterval: number = getRandomIntRange(600, 1200) // 10-20s
      let flipFrame: number = 0
      let flipDuration: number = getRandomIntRange(60, 90)
      let flipCount: number = getRandomIntRange(1, 2)
      let flipDirection: number = getRandomIntRange(0, 1)
      const flipMultipliers: number[] = [-1, 1]

      // Bobbing Animation Variables (constant)
      let totalBobbingFrames: number = 200
      let startBobbingHeight: number = 0
      let maxBobbingHeight: number = 10

      // Animate
      const animate = () => {

        // ANIMATION LOGIC

        // Initialize Animated Values
        let rotationAngleX: number = 0
        let rotationAngleY: number = 0
        let positionY: number = 0
      
        // Rotating Animation (constant)
        rotationAngleX += circularRotationAnimationCos({
          minAngle: minimumX,
          maxAngle: maximumX,
          startFrame: 0,
          totalFrames,
          currentFrame
        })
        rotationAngleY += circularRotationAnimationSin({
          minAngle: minimumY,
          maxAngle: maximumY,
          startFrame: 0,
          totalFrames,
          currentFrame
        })

        // Bobbing Animation (constant)
        positionY += smoothOscillationZeroCenter({
          start: startBobbingHeight,
          max: maxBobbingHeight,
          startFrame: 0,
          totalFrames: totalBobbingFrames,
          currentFrame
        })

        // Front Flip Animation
        if (!isFlipping) {
          flipInterval--
          if (flipInterval == 0) {
            isFlipping = true
          }
        }
        else {
          positionY += doubleTransition(flipFrame, flipDuration) * 100
          rotationAngleX += smoothTransitionUnit(flipFrame, flipDuration) * 360 * flipCount * flipMultipliers[flipDirection]
          flipFrame++
          if (flipFrame == flipDuration) {
            isFlipping = false
            flipInterval = getRandomIntRange(600, 1200)
            flipDuration = getRandomIntRange(60, 90)
            flipCount = getRandomIntRange(1, 2)
            flipDirection = getRandomIntRange(0, 1)
            flipFrame = 0
          }
        }

        // Spin Animation
        if (!isSpinning) {
          spinInterval--
          if (spinInterval == 0) {
            isSpinning = true
            if (getCircularRotationAnimationSinDerivative({
              minAngle: minimumY,
              maxAngle: maximumY,
              startFrame: spinDuration,
              totalFrames,
              currentFrame
            }) < 0) {
              spinDirection = 0
            }
            else { spinDirection = 1 }
          }
        }
        else {
          rotationAngleY += animationCurve.getY(spinFrame / spinDuration) * 360 * spinCount * spinMultipliers[spinDirection]
          spinFrame ++
          if (spinFrame == spinDuration) {
            isSpinning = false
            spinInterval = getRandomIntRange(600, 1200)
            spinDuration = getRandomIntRange(120, 240)
            spinCount = getRandomIntRange(1, 2)
            spinFrame = 0
          }
        }

        // Set Rotation Values
        cube.rotation.x = THREE.MathUtils.degToRad(rotationAngleX)
        cube.rotation.y = THREE.MathUtils.degToRad(rotationAngleY)
        cube.position.y = THREE.MathUtils.degToRad(positionY)

        // RENDER FRAME
        renderer.render(scene, camera)
        animationFrameID.current = window.requestAnimationFrame(animate)
        console.log("yeah")

        // Increment Current Frame
        currentFrame++
      }
      animationFrameID.current = window.requestAnimationFrame(animate)

      // Clean Unmount
      return () => {
        window.removeEventListener("resize", updateDimensions)
        if (animationFrameID.current) { window.cancelAnimationFrame(animationFrameID.current) }
      }
    }
  }, [])

  // Return Content
  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.background}>
        <video autoPlay loop muted>
          <source src="/videos/smoke-saber.mp4" />
        </video>
      </div>
      <div ref={contentRef} className={styles.content}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
