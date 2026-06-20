import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

import { FLIP_SPEED } from './constants'
import { createScene, handleResize } from './scene'
import { createLights } from './lightning'
import { createCard, createGroundPlane, loadCardTexture } from './card'
import { CardInteraction } from './interaction'
import { createParticleBackground } from './particles'

// loading screen UI
const loaderElement = document.createElement('div')
loaderElement.id = 'loader'
loaderElement.style.position = 'fixed'
loaderElement.style.top = '0'
loaderElement.style.left = '0'
loaderElement.style.width = '100%'
loaderElement.style.height = '100%'
loaderElement.style.backgroundColor = '#08080f'
loaderElement.style.display = 'flex'
loaderElement.style.justifyContent = 'center'
loaderElement.style.alignItems = 'center'
loaderElement.style.color = '#ffffff'
loaderElement.style.fontFamily = 'sans-serif'
loaderElement.style.fontSize = '24px'
loaderElement.style.zIndex = '9999'
loaderElement.textContent = 'LOADING AD...'
document.body.appendChild(loaderElement)

const { scene, camera, renderer, labelRenderer } = createScene()
createLights(scene)
document.body.appendChild(renderer.domElement)
document.body.appendChild(labelRenderer.domElement)

// setup for mouse paralax
const mouse = { x: 0, y: 0}
window.addEventListener('mousemove', (e) => {
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
})

// body reset to fill window with no scrollbar
document.body.style.margin = '0'
document.body.style.overflow = 'hidden'

//const timer = new THREE.Timer()

const { group: cardGroup, frontMaterial, backMaterial, ctaObject } = createCard(scene)
createGroundPlane(scene)
loadCardTexture(frontMaterial, () => {
	// Smoothly fade out the loading screen
	loaderElement.style.transition = 'opacity 0.5s ease'
	loaderElement.style.opacity = '0'
	setTimeout(() => loaderElement.remove(), 500)
})

const particles = createParticleBackground(scene)
const interaction = new CardInteraction(camera, cardGroup, mouse)

/* const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.target.set( 0, 0.7, 0 );
controls.update(); */

const composer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	0.6,	// strength
	0.4,	// radius
	0.15	// threshold
)
composer.addPass(bloomPass)

function animate() {
	//controls.update()
	requestAnimationFrame(animate)
	//const _delta = timer.getDelta()

	interaction.update()

	// hover emissive
	const targetEmissive = interaction.isHovered ? 0.25 : 0.0
	frontMaterial.emissiveIntensity += (targetEmissive - frontMaterial.emissiveIntensity) * 0.1

	// Card flip
	const targetRotation = interaction.isFlipped ? Math.PI : 0
	cardGroup.rotation.y += (targetRotation - cardGroup.rotation.y) * FLIP_SPEED

	// show correct face based on rotation progress
	const halfway = Math.abs(cardGroup.rotation.y % (Math.PI * 2)) > Math.PI / 2
	frontMaterial.side = halfway ? THREE.BackSide : THREE.FrontSide
	backMaterial.side = halfway ? THREE.FrontSide : THREE.BackSide

	// CTA visibility
	ctaObject.element.style.opacity = interaction.isFlipped ? '1' : '0'
	ctaObject.element.style.transition = 'opacity 0.2s ease'

	// Camera parallax
	camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.05
	camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.05
	camera.lookAt(0, 0, 0)

	// particles
	particles.rotation.y += 0.0003
	particles.rotation.x += 0.0001

	composer.render()
	labelRenderer.render(scene, camera)
}

window.addEventListener('resize', () => {
	handleResize(camera, renderer, labelRenderer)
	composer.setSize(window.innerWidth, window.innerHeight)
})

animate()