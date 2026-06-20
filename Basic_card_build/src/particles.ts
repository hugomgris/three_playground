import * as THREE from 'three'

export function createParticleBackground(scene: THREE.Scene): THREE.Points {
    const particleCount = 800

    const positions = new Float32Array(particleCount * 3)

    // Populate position array
    for (let i = 0; i < particleCount * 3; ++i) {
        positions[i] = (Math.random() - 0.5) * 16
    }

    // geometry and position attribute set
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // material
    const material = new THREE.PointsMaterial({
        color: 0xf7d092,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    return particles
}