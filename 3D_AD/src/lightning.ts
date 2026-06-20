import * as THREE from 'three'

export function createLights(scene: THREE.Scene): void {
    // very dim ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambient)

    // warm key light
    const key = new THREE.DirectionalLight(0xfff4e0, 3.5)
    key.position.set(3, 4, 3)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 20
    scene.add(key)

    // cool fill light
    const fill = new THREE.PointLight(0x4466ff, 1.5, 10)
    fill.position.set(-3, 1, 2)
    scene.add(fill)
}