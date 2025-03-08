import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xaaaaaa, 1, 50);
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const concreteTexture = new THREE.TextureLoader().load(
  "src/textures/concrete.jpg",
  () => {
    concreteTexture.wrapS = THREE.RepeatWrapping;
    concreteTexture.wrapT = THREE.RepeatWrapping;
    concreteTexture.repeat.set(16, 1); // Repeat 4 times in both directions
  }
);
const wallTexture = new THREE.TextureLoader().load(
  "src/textures/wall-texture.jpg"
);
const wallTexture2 = new THREE.TextureLoader().load(
  "src/textures/wall-texture2.jpg"
);
const roofTexture = new THREE.TextureLoader().load("src/textures/roof.jpg");
const grassTexture = new THREE.TextureLoader().load(
  "src/textures/grass.jpg",
  () => {
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(16, 16); // Repeat 4 times in both directions
  }
);

const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture,
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Define the wall geometry: 100 units wide, 10 units high
const wallGeometry = new THREE.PlaneGeometry(50, 5);

// Define the wall material: gray color, roughness 0.8, double-sided
const wallMaterial = new THREE.MeshStandardMaterial({
  map: concreteTexture,
  side: THREE.DoubleSide, // Visible from both sides
});

// Wall at x = 50 (right edge)
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(25, 0, 0); // x = 50, y = 5 (center of height), z = 0
wall1.rotation.y = -Math.PI / 2; // Rotate -90° around y-axis (normal faces -x)
wall1.castShadow = true; // Cast shadows
wall1.receiveShadow = true; // Receive shadows
scene.add(wall1);

// Wall at x = -50 (left edge)
const wall2 = wall1.clone();
wall2.position.set(-25, 0, 0); // x = -50, y = 5, z = 0
wall2.rotation.y = Math.PI / 2; // Rotate 90° around y-axis (normal faces +x)
wall2.castShadow = true;
wall2.receiveShadow = true;
scene.add(wall2);

// Wall at z = 50 (far edge)
const wall3 = wall1.clone();
wall3.position.set(0, 0, 25); // x = 0, y = 5, z = 50
wall3.rotation.y = Math.PI; // Rotate 180° around y-axis (normal faces -z)
wall3.castShadow = true;
wall3.receiveShadow = true;
scene.add(wall3);

// Wall at z = -50 (near edge)
const wall4 = wall1.clone();
wall4.position.set(0, 0, -25); // x = 0, y = 5, z = -50
wall4.rotation.y = 0; // No rotation (normal faces +z)
wall4.castShadow = true;
wall4.receiveShadow = true;
scene.add(wall4);

// Building
let buildingTextures = [
  new THREE.MeshStandardMaterial({ map: wallTexture }), // brown
  new THREE.MeshStandardMaterial({ map: wallTexture2 }), // gray
];

const building = new THREE.Group();
const buildingGeometry = new THREE.BoxGeometry(5, 6, 5);
let currentTextureIndex = 0;
const buildingWall = new THREE.Mesh(
  buildingGeometry,
  buildingTextures[currentTextureIndex]
);
buildingWall.position.set(2, 1, -1);
buildingWall.castShadow = true;
buildingWall.receiveShadow = true;
building.add(buildingWall);

// Roof
const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ map: roofTexture });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(2, 5, -1);
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
building.add(roof);

scene.add(building);

const loader = new GLTFLoader();

var swing = null;
loader.load(
  "src/model/swing/scene.gltf",
  function (gltf) {
    swing = gltf.scene;
    swing.scale.set(0.01, 0.01, 0.01);
    swing.position.set(14, 0, -1);
    swing.castShadow = true;
    scene.add(swing);
  },
  undefined,
  function (error) {
    console.log("Error loading swing model");
    console.error(error);
  }
);

var slide = null;
loader.load(
  "src/model/slide/scene.gltf",
  function (gltf) {
    slide = gltf.scene;
    slide.scale.set(1.2, 1.2, 1.2);
    slide.position.set(-14, 0, 1);
    slide.castShadow = true;
    scene.add(slide);
  },
  undefined,
  function (error) {
    console.log("Error loading slide model");
    console.error(error);
  }
);

var merry = null;
loader.load(
  "src/model/merry/scene.gltf",
  function (gltf) {
    merry = gltf.scene;
    merry.scale.set(2, 2, 2);
    merry.position.set(0, 0, -14);
    merry.castShadow = true;
    scene.add(merry);
  },
  undefined,
  function (error) {
    console.log("Error loading merry model");
    console.error(error);
  }
);

var seesaws = null;
loader.load(
  "src/model/seesaws/scene.gltf",
  function (gltf) {
    seesaws = gltf.scene;
    seesaws.scale.set(0.01, 0.01, 0.01);
    seesaws.position.set(0, 0, 14);
    seesaws.castShadow = true;
    scene.add(seesaws);
  },
  undefined,
  function (error) {
    console.log("Error loading seesaws model");
    console.error(error);
  }
);

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

  const buildingParts = [buildingWall, roof];
  const intersects = raycaster.intersectObjects(buildingParts);

  if (intersects.length > 0) {
    currentTextureIndex = (currentTextureIndex + 1) % buildingTextures.length;
    buildingWall.material = buildingTextures[currentTextureIndex];
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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const cameraRadius = 20;
let cameraAngle = 0;
let cameraAngle2 = 0;
let angle = 0;

function animate() {
  requestAnimationFrame(animate);

  angle += 0.01;
  directionalLight.position.x = 20 * Math.sin(angle);
  directionalLight.position.z = 20 * Math.cos(angle);

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

  camera.position.x = cameraRadius * Math.sin(cameraAngle);
  camera.position.y = Math.max(cameraRadius * Math.sin(cameraAngle2), 2);
  camera.position.z = cameraRadius * Math.cos(cameraAngle);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

animate();
