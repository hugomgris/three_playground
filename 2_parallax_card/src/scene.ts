import * as THREE from 'three'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import {
	CAMERA_FOV,
	CAMERA_FAR,
	CAMERA_NEAR,
	CAMERA_Z,
	TONE_MAPPING_EXPOSURE,
	FOG_DENSITY
} from './constants'

export interface SceneContext {
	scene: THREE.Scene
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	labelRenderer: CSS2DRenderer
}

export function createScene(): SceneContext {
	// Scene pre-setup
	const scene = new THREE.Scene()
	scene.background = new THREE.Color(0x08080f)
	scene.fog = new THREE.FogExp2(0x08080f, FOG_DENSITY)

	// Camera
	const camera = new THREE.PerspectiveCamera(
		CAMERA_FOV,
		window.innerWidth / window.innerHeight,
		CAMERA_NEAR,
		CAMERA_FAR
	)
	camera.position.z = CAMERA_Z

	// standard WebGL renderer
	const renderer = new THREE.WebGLRenderer( { antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE

	// CSS2D Renderer
	const labelRenderer = new CSS2DRenderer()
	labelRenderer.setSize(window.innerWidth, window.innerHeight)
	labelRenderer.domElement.style.position = 'absolute'
	labelRenderer.domElement.style.top = '0px'
	labelRenderer.domElement.style.pointerEvents = 'none' // this is what allows mose events to pass through to the WebGL/Raycaster

	// environment generation
	const pmremGenerator = new THREE.PMREMGenerator(renderer)
	pmremGenerator.compileEquirectangularShader()

	const sceneData = new THREE.Scene()
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
	sceneData.add(hemiLight)

	const renderTarget = pmremGenerator.fromScene(sceneData)
	scene.environment = renderTarget.texture

	// cleanup memory
	pmremGenerator.dispose()
	sceneData.clear()

	return { scene, camera, renderer, labelRenderer }
}

export function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, labelRenderer: CSS2DRenderer) {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	labelRenderer.setSize(window.innerWidth, window.innerHeight)
}