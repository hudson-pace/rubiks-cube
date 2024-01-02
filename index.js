import * as THREE from './node_modules/three/build/three.module.js';
import Cube from './cube.js';

const canvas = document.querySelector('canvas');
const rect = canvas.getBoundingClientRect();
const renderer = new THREE.WebGLRenderer({ canvas });

const fov = 60;
const aspect = 2;
const near = 1;
const far = 20;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 15;
const light = new THREE.DirectionalLight(0xffffff, 1);
camera.add(light);

const scene = new THREE.Scene();
scene.background = new THREE.Color('cornflowerblue');

const cameraPole = new THREE.Object3D;
scene.add(cameraPole);
cameraPole.add(camera);



canvas.addEventListener('mousemove', (event) => {
  if (event.buttons === 2) {
    cameraPole.rotateX(event.movementY * -.003)
    cameraPole.rotateY(event.movementX * -.003);
  }
});
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (event.deltaY < 0) {
    camera.zoom *= 1.1;
    camera.updateProjectionMatrix();
  } else {
    camera.zoom /= 1.1;
    camera.updateProjectionMatrix();
  }
});

requestAnimationFrame(render);
function render(time) {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

const selectCubeSize = document.querySelector('#select-cube-size');
for (let i = 2; i < 7; i++) {
  const option = document.createElement('option');
  option.innerHTML = i;
  selectCubeSize.appendChild(option);
}

let cube;

selectCubeSize.addEventListener('change', () => {
  scene.remove(cube.cubeGroup);
  cube = new Cube(selectCubeSize.value);
  scene.add(cube.cubeGroup);
});

selectCubeSize.value = 3;

cube = new Cube(selectCubeSize.value);
scene.add(cube.cubeGroup);

document.querySelector('#scramble-button').addEventListener('click', () => cube.scramble());
document.querySelector('#solve-button').addEventListener('click', () => cube.undoToPreviousSolve());


canvas.addEventListener('mousedown', (event) => {
  if (event.buttons === 1) {
    cube.onLeftMouseDown(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * -2 + 1,
      camera,
    );
  }
});

canvas.addEventListener('mouseup', (event) => {
  cube.onMouseUp();
});

canvas.addEventListener('mousemove', (event) => {
  cube.onMouseMove(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    ((event.clientY - rect.top) / rect.height) * -2 + 1,
    camera,
  );
});
