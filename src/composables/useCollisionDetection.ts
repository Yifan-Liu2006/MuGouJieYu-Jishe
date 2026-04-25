import * as THREE from 'three'

interface CollisionDetectionOptions {
  scene: THREE.Scene
  radius?: number
  maxDistance?: number
}

export function useCollisionDetection(options: CollisionDetectionOptions) {
  const {
    scene,
    radius = 0.5,
    maxDistance = 10
  } = options

  const raycaster = new THREE.Raycaster()
  let collisionObjects: THREE.Object3D[] = []

  const init = () => {
    // 收集所有可碰撞对象
    collisionObjects = []
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        collisionObjects.push(object)
      }
    })
  }

  const checkCollision = (position: THREE.Vector3, direction: THREE.Vector3): boolean => {
    raycaster.set(position, direction)
    const intersects = raycaster.intersectObjects(collisionObjects, false)
    return intersects.length > 0 && intersects[0].distance < radius
  }

  const checkCollisionInDirection = (
    position: THREE.Vector3,
    direction: THREE.Vector3,
    distance: number = radius
  ): THREE.Intersection | null => {
    raycaster.set(position, direction)
    raycaster.far = distance
    const intersects = raycaster.intersectObjects(collisionObjects, false)
    return intersects.length > 0 ? intersects[0] : null
  }

  const checkCollisions = (position: THREE.Vector3): THREE.Intersection[] => {
    const directions = [
      new THREE.Vector3(1, 0, 0),  // 右
      new THREE.Vector3(-1, 0, 0), // 左
      new THREE.Vector3(0, 1, 0),  // 上
      new THREE.Vector3(0, -1, 0), // 下
      new THREE.Vector3(0, 0, 1),  // 前
      new THREE.Vector3(0, 0, -1)  // 后
    ]

    const collisions: THREE.Intersection[] = []

    directions.forEach((direction) => {
      const collision = checkCollisionInDirection(position, direction)
      if (collision) {
        collisions.push(collision)
      }
    })

    return collisions
  }

  const getNearestObject = (position: THREE.Vector3): THREE.Intersection | null => {
    raycaster.set(position, new THREE.Vector3(0, 0, 1))
    raycaster.far = maxDistance
    const intersects = raycaster.intersectObjects(collisionObjects, false)
    return intersects.length > 0 ? intersects[0] : null
  }

  return {
    init,
    checkCollision,
    checkCollisionInDirection,
    checkCollisions,
    getNearestObject
  }
}