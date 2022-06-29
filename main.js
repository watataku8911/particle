import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const domElement = document.querySelector("#myCanvas");

const sizes = {
  width: window.innerWidth,
  height: window.innerWidth,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.set(0, 0, 0);
//scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: domElement,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

const directionalLight = new THREE.DirectionalLight(0x345676);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x345676, 2, 50, 1.0);
pointLight.position.set(1, 1, 1);
scene.add(pointLight);

let material;
let plane = [];
let length = 600;
let plane_scale = 40;
for (let i = 0; i < length; i++) {
  const geometry = new THREE.PlaneGeometry(plane_scale + 10, plane_scale);

  let rect = [];
  for (let ci = 0; ci < length; ci++) {
    const color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
    material = new THREE.MeshBasicMaterial({
      color: Number(color),
      opacity: 0.8,
      transparent: true,
      side: THREE.DoubleSide,
    });
    rect.push(new THREE.Mesh(geometry, material));
  }

  plane[i] = new THREE.Mesh(geometry, material);

  plane[i].position.x = 2000 * (Math.random() - 0.5);
  plane[i].position.y = 2000 * (Math.random() - 0.5);
  plane[i].position.z = 5000 * (Math.random() - 0.5);
  scene.add(plane[i]);
}
// カメラコントローラーを作成
const controls = new OrbitControls(camera, domElement);

// 滑らかにカメラコントローラーを制御する
controls.enableDamping = true;
controls.dampingFactor = 0.2;

let rot = 0;
const animation = () => {
  requestAnimationFrame(animation);
  rot += 0.3;
  const radian = (rot * Math.PI) / 180;

  camera.position.x = 1000 * Math.sin(radian);
  camera.position.z = 1000 * Math.cos(radian);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  for (let i = 0; i < length; i++) {
    plane[i].rotation.y += Math.random() * 0.1;
    plane[i].rotation.x += Math.random() * 0.1;
    plane[i].rotation.z += Math.random() * 0.1;
  }
  controls.update();

  renderer.render(scene, camera);
};

animation();

// -------------------------------------------- リサイズ ------------------------------------------
const onResize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
};

onResize();

window.addEventListener("resize", onResize);
