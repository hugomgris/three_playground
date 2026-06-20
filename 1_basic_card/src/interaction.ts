import * as THREE from 'three'

export class CardInteraction {
	isHovered = false
	isFlipped = false
	private raycaster = new THREE.Raycaster()
	private camera: THREE.PerspectiveCamera
	private cardGroup: THREE.Group
	private mouse: { x: number; y: number }

	constructor(
		camera: THREE.PerspectiveCamera,
		cardGroup: THREE.Group,
		mouse: { x: number; y: number }
	) {
		this.camera = camera
		this.cardGroup = cardGroup
		this.mouse = mouse
		window.addEventListener('click', () => this.onClick())
	}

	private onClick() {
		this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.x, this.mouse.y), this.camera)
		const hits = this.raycaster.intersectObjects(this.cardGroup.children)
		if (hits.length > 0) this.isFlipped = !this.isFlipped
	}

	update() {
		this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.x, this.mouse.y), this.camera)
		const hits = this.raycaster.intersectObjects(this.cardGroup.children)
		this.isHovered = hits.length > 0
		document.body.style.cursor = this.isHovered ? 'pointer' : 'default'
	}
}