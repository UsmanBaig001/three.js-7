import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
// import { RectAreaLightHelper } from "three/examples/jsm/heplers/RectAreaLightHelper.js";

const textureLoader = new THREE.TextureLoader();

// Debug
const gui = new dat.GUI();

// const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
// const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
// const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
// const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
// const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

const directionalLight = new THREE.DirectionalLight(0x0fffc, 0.5);
directionalLight.position.set(2, 3, 4);
scene.add(directionalLight);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.01);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);
gui.add(hemisphereLight, "intensity").min(0).max(1).step(0.01);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 1, 0);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);
gui.add(pointLight, "intensity").min(0).max(1).step(0.01);
gui.add(pointLight.position, "x").min(-5).max(5).step(0.001);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 2);
rectAreaLight.position.set(-1.5, 0, -1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.2);
scene.add(rectAreaLightHelper);
scene.add(hemisphereLightHelper);
scene.add(directionalLightHelper);
scene.add(spotLightHelper);
scene.add(pointLightHelper);

// const light = new THREE.PointLight(0xffffff, 0.5);
// light.position.x = 2;
// light.position.y = 3;
// light.position.z = 4;
// scene.add(light);

/**
 * Objects
 */

const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.7;
material.roughness = 0.4;

material.side = THREE.DoubleSide;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
const parentSphere = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0x000ff0, wireframe: true })
);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere.position.x = -1.5;
const box = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
box.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(box.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(7, 7, 100, 100), material);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

plane.position.y = -1;
plane.position.z = 0;
plane.rotation.x = Math.PI * 0.5;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.x = 1.5;
scene.add(sphere, plane, torus, box, parentSphere);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 4;
camera.lookAt(box);
scene.add(sphere);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  box.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  box.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
