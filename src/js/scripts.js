import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as CANNON from "cannon-es";
import mapJson from "../asset/map.json" with { "type": "json"};

const meshs = [];
const bodys = [];

const mapPhysics = () => {
  const mapData = mapJson.obstacles;

  mapData.forEach((data) => {
    const { width, height, depth } = data;
    const { x, y, z } = data;

    console.log("whd: ", width, height, depth);
    console.log("xyz: ", x, y, z);

    // Geometry(기하) : 도형에 대한 너비, 높이, 깊이
    const boxGeo = new THREE.BoxGeometry(width, height, depth);
    // Material: 물질에 대한 특성
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    // Mesh : 실제 도형을 생성해준다.
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    scene.add(boxMesh);
    meshs.push(boxMesh);

    // ------------------------------------------------------------------------

    // 박스 생성
    const boxPhysMat = new CANNON.Material();
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
      position: new CANNON.Vec3(x + width / 2, y + height / 2, z + depth / 2),
      material: boxPhysMat,
      type: CANNON.Body.STATIC,
    });
    world.addBody(boxBody);
    bodys.push(boxBody);
  });
};

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

/**
 * -----------------------------------------------------------------------------------------------------
 * cannon 부분
 */

// 월드 설정
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, 0, 0),
});

// const groundBoxContactMat = new CANNON.ContactMaterial(
//   groundPhysMat,
//   boxPhysMat,
//   { friction: 0.04 }
// );

// world.addContactMaterial(groundBoxContactMat);

mapPhysics();

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);

  for (let i = 0; i < meshs.length; i++) {
    meshs[i].position.copy(bodys[i].position);
    meshs[i].quaternion.copy(bodys[i].quaternion);
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
