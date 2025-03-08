import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Add lights
const ambientLight = new THREE.AmbientLight(0x604040, 0.7);
scene.add(ambientLight);

var spotlight = new THREE.SpotLight(0xafffff,0.8);
spotlight.position.set(0, 3, 0);
spotlight.castShadow = true;
scene.add(spotlight);

const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);

const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
const wallTexture = new THREE.TextureLoader().load('src/textures/wall-texture.jpg');
const floorTexture = new THREE.TextureLoader().load('src/textures/floor-texture.avif');
const sofaPinkTexture = new THREE.TextureLoader().load('src/textures/sofa_pink.jpg');
const sofaDarkTexture = new THREE.TextureLoader().load('src/textures/sofa_dark.jpg');

const roomMaterials = [
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // Right face - red color
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // Left face - green color
    new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide }), // Top face - blue color
    new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.BackSide }), // Bottom face - yellow color
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // Front face - magenta color
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide })  // Back face - cyan color
];
const room = new THREE.Mesh(roomGeometry, roomMaterials);
room.position.set(0, 2.5, 0);
scene.add(room);


const loader = new GLTFLoader();

var lamp = null;
loader.load('src/model/lamp/scene.gltf', function (gltf) {
  lamp = gltf.scene;
  lamp.scale.set(1,1,1);
  lamp.position.set(2, 1, -1);
  scene.add(lamp);
}, undefined, function (error) {
  console.log("Error loading lamp model");
  console.error(error);
}
);

const lampLight = new THREE.PointLight(0xffeecc, 2, 15, 0.1);
lampLight.position.set(2, 1.75, -1);
lampLight.castShadow = true;
scene.add(lampLight);

const lampLightHelper = new THREE.PointLightHelper(lampLight);
scene.add(lampLightHelper);

// Create couch with textured materials
let couchTextures = [
  new THREE.MeshStandardMaterial({ map:sofaDarkTexture }), // brown
  new THREE.MeshStandardMaterial({ map: sofaPinkTexture }), // gray
];

let currentTextureIndex = 0;
const couchGroup = new THREE.Group();

// Couch base
const couchBaseGeometry = new THREE.BoxGeometry(2, 0.5, 0.8);
const couchBase = new THREE.Mesh(
  couchBaseGeometry,
  couchTextures[currentTextureIndex]
);
couchBase.position.set(0, 0.25, 0);
couchBase.castShadow = true;
couchBase.receiveShadow = true;
couchGroup.add(couchBase);

// Couch back
const couchBackGeometry = new THREE.BoxGeometry(2, 0.8, 0.3);
const couchBack = new THREE.Mesh(
  couchBackGeometry,
  couchTextures[currentTextureIndex]
);
couchBack.position.set(0, 0.65, -0.4);
couchBack.castShadow = true;
couchBack.receiveShadow = true;
couchGroup.add(couchBack);

// Couch arms
const couchArmGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.8);

const couchArmLeft = new THREE.Mesh(
  couchArmGeometry,
  couchTextures[currentTextureIndex]
);
couchArmLeft.position.set(-1.15, 0.4, 0);
couchArmLeft.castShadow = true;
couchArmLeft.receiveShadow = true;
couchGroup.add(couchArmLeft);

const couchArmRight = new THREE.Mesh(
  couchArmGeometry,
  couchTextures[currentTextureIndex]
);
couchArmRight.position.set(1.15, 0.4, 0);
couchArmRight.castShadow = true;
couchArmRight.receiveShadow = true;
couchGroup.add(couchArmRight);

couchGroup.position.y = 0;
scene.add(couchGroup);

// Handle window resize
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse interaction - Change couch texture
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", function (event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const couchParts = [couchBase, couchBack, couchArmLeft, couchArmRight];
  const intersects = raycaster.intersectObjects(couchParts);

  if (intersects.length > 0) {
    currentTextureIndex = (currentTextureIndex + 1) % couchTextures.length;
    couchParts.forEach((part) => {
      part.material = couchTextures[currentTextureIndex];
    });
  }
});

// Keyboard camera movement
const keyState = {};
window.addEventListener("keydown", function (event) {
  keyState[event.code] = true;
});
window.addEventListener("keyup", function (event) {
  keyState[event.code] = false;
});

// Animation variables
let time = 0;
const cameraRadius = 3.5;
let cameraAngle = 0;
let cameraAngle2 = 0;

// Animation function
function animate() {
  requestAnimationFrame(animate);

  time += 0.02;

  // Animate lamp light intensity
  lampLight.intensity = 0.7 + 0.5 * Math.sin(time);

  // Handle keyboard camera movement
  if (keyState["ArrowLeft"]) {
    cameraAngle -= 0.02;
  }
  if (keyState["ArrowRight"]) {
    cameraAngle += 0.02;
  }
  if (keyState["ArrowUp"]) {
    cameraAngle2 += 0.02;
  }
  if (keyState["ArrowDown"]) {
    cameraAngle2 -= 0.02;
  }

  // Update camera position in a circle around the couch
  camera.position.x = cameraRadius * Math.sin(cameraAngle);
  camera.position.y = Math.max(cameraRadius * Math.sin(cameraAngle2), 1);
  camera.position.z = cameraRadius * Math.cos(cameraAngle);
  camera.lookAt(couchGroup.position);
  renderer.render(scene, camera);
}

animate();
