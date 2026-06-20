import * as THREE from 'three'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import cardFrontImage from './assets/textures/card_front.png'

export interface CardContext {
	group: THREE.Group
	frontMaterial: THREE.MeshStandardMaterial
	backMaterial: THREE.MeshStandardMaterial
	ctaObject: CSS2DObject
}

export function createCard(scene: THREE.Scene): CardContext {
	const geometry = new THREE.PlaneGeometry(1.8, 2.5)

	const frontMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		roughness: 0.3,
		metalness: 0.6,
		emissive: new THREE.Color(0xffffff),
		emissiveIntensity: 0.0,
		side: THREE.FrontSide,
	})
	const front = new THREE.Mesh(geometry, frontMaterial)

	const backMaterial = new THREE.MeshStandardMaterial({
		color: 0x111122,
		roughness: 0.5,
		metalness: 0.4,
		emissive: new THREE.Color(0x2233ff),
		emissiveIntensity: 0.05,
		side: THREE.BackSide
	})
	const back = new THREE.Mesh(geometry, backMaterial)
	back.rotation.y = Math.PI
	back.position.z = -0.001

	const group = new THREE.Group()
	group.add(front, back)

	// dedicated shadow caster (double sided)
	const shadowMaterial = new THREE.ShadowMaterial({
		side: THREE.DoubleSide
	})
	const shadowCaster = new THREE.Mesh(geometry, shadowMaterial)
	shadowCaster.castShadow = true

	front.castShadow = false
	back.castShadow = false
	group.add(shadowCaster)

	// HTML CTA button
	const button = document.createElement('button')
	button.textContent = 'PLAY NOW'

	// inline styling
	button.style.padding = '12px 24px'
	button.style.backgroundColor = '#ff3366'
	button.style.color = '#ffffff'
	button.style.border = 'none'
	button.style.borderRadius = '20px'
	button.style.fontWeight = 'bold'
	button.style.cursor = 'pointer'
	button.style.pointerEvents = 'auto' // Re-enabling pointer events just for the button click
	button.style.boxShadow = '0 0 15px rgba(255, 51, 102, 0.6)'

	const ctaObject = new CSS2DObject(button)
	ctaObject.position.set(0, -0.4, -0.01)

	back.add(ctaObject)

	scene.add(group)

	return { group, frontMaterial, backMaterial, ctaObject }
}

export function createGroundPlane(scene: THREE.Scene): void {
	const geometry = new THREE.PlaneGeometry(20, 20)
	const material = new THREE.MeshStandardMaterial({
		color: 0x050508,
		roughness: 0.9,
		metalness: 0.1,
	})
	const ground = new THREE.Mesh(geometry, material)
	ground.rotation.x = -Math.PI / 2
	ground.position.y = -2
	ground.receiveShadow = true
	scene.add(ground)
}

export function loadCardTexture(material: THREE.MeshStandardMaterial, onComplete?: () => void): void {
	const manager = new THREE.LoadingManager()
	manager.onLoad = () => {
		if (onComplete) onComplete()
	}
	
	const loader = new THREE.TextureLoader(manager)
	loader.load(cardFrontImage, (texture) => {
		material.map = texture
		material.needsUpdate = true
	})
}