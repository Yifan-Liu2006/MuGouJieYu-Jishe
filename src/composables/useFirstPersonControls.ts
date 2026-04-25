import { ref } from 'vue'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

interface FirstPersonControlsOptions {
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  acceleration?: number
  maxSpeed?: number
  jumpHeight?: number
  gravity?: number
}

export function useFirstPersonControls(options: FirstPersonControlsOptions) {
  const {
    camera,
    renderer,
    acceleration = 0.1,
    maxSpeed = 10,
    jumpHeight = 1,
    gravity = 0.2
  } = options

  const controls = ref<PointerLockControls | null>(null)
  const moveForward = ref(false)
  const moveBackward = ref(false)
  const moveLeft = ref(false)
  const moveRight = ref(false)
  const canJump = ref(false)
  const velocity = ref(new THREE.Vector3())
  const direction = ref(new THREE.Vector3())
  const position = ref(new THREE.Vector3())
  const isLocked = ref(false)

  const init = () => {
    controls.value = new PointerLockControls(camera, renderer.domElement)
    
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.value = true
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.value = true
          break
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.value = true
          break
        case 'ArrowRight':
        case 'KeyD':
          moveRight.value = true
          break
        case 'Space':
          if (canJump.value) velocity.value.y += jumpHeight
          canJump.value = false
          break
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.value = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.value = false
          break
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.value = false
          break
        case 'ArrowRight':
        case 'KeyD':
          moveRight.value = false
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    controls.value.addEventListener('lock', () => {
      isLocked.value = true
    })

    controls.value.addEventListener('unlock', () => {
      isLocked.value = false
    })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }

  const update = () => {
    if (!controls.value) return

    velocity.value.y -= gravity
    velocity.value.clampLength(0, maxSpeed)

    direction.value.set(
      Number(moveRight.value) - Number(moveLeft.value),
      0,
      Number(moveForward.value) - Number(moveBackward.value)
    )

    direction.value.normalize()

    const moveDirection = new THREE.Vector3()
    moveDirection.copy(direction.value)
    moveDirection.applyQuaternion(camera.quaternion)
    moveDirection.y = 0
    moveDirection.normalize()
    moveDirection.multiplyScalar(acceleration)

    velocity.value.add(moveDirection)

    controls.value.moveForward(velocity.value.z)
    controls.value.moveRight(velocity.value.x)
    controls.value.object.position.y += velocity.value.y

    if (controls.value.object.position.y < 0) {
      velocity.value.y = 0
      controls.value.object.position.y = 0
      canJump.value = true
    }

    position.value.copy(controls.value.object.position)
  }

  const lock = () => {
    controls.value?.lock()
  }

  const unlock = () => {
    controls.value?.unlock()
  }

  const getPosition = () => {
    return position.value
  }

  const setPosition = (x: number, y: number, z: number) => {
    if (controls.value) {
      controls.value.object.position.set(x, y, z)
      position.value.set(x, y, z)
    }
  }

  return {
    controls: () => controls.value,
    isLocked,
    init,
    update,
    lock,
    unlock,
    getPosition,
    setPosition
  }
}