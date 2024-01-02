import * as THREE from './node_modules/three/build/three.module.js';

export default class ComponentCube {
  faces = {};
  materials = [];

  constructor(x, y, z) {
    this.generateMaterials();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const blackMat = this.materials[this.materials.length - 1];
    const defaultMaterials = [blackMat, blackMat, blackMat, blackMat, blackMat, blackMat];
    this.cube = new THREE.Mesh(geometry, defaultMaterials);
    this.cube.position.y = y;
    this.cube.position.z = z;
    this.cube.position.x = x;

    this.faces.left = this.createTile(-0.15, 0, 0, this.cube);
    this.faces.right = this.createTile(0.15, 0, 0, this.cube);
    this.faces.bottom = this.createTile(0, -0.15, 0, this.cube);
    this.faces.top = this.createTile(0, 0.15, 0, this.cube);
    this.faces.back = this.createTile(0, 0, -0.15, this.cube);
    this.faces.front = this.createTile(0, 0, 0.15, this.cube);

    this.assignColors({
      left: 0,
      right: 1,
      bottom: 2,
      top: 3,
      back: 4,
      front: 5,
    });
  }

  swapFaces(facesToSwap) {
    const firstFaceValue = this.faces[facesToSwap[0]].colorValue;
    for (let i = 0; i < facesToSwap.length; i++) {
      if (i + 1 < facesToSwap.length) {
        this.faces[facesToSwap[i]].colorValue = this.faces[facesToSwap[i + 1]].colorValue;
      } else {
        this.faces[facesToSwap[i]].colorValue = firstFaceValue;
      }
    }
    this.colorFaces();
  }

  rotateX(direction) {
    if (direction === 1) {
      this.swapFaces(['top', 'back', 'bottom', 'front']);
    } else if (direction === -1) {
      this.swapFaces(['top', 'front', 'bottom', 'back']);
    }
  }
  rotateY(direction) {
    if (direction === 1) { 
      this.swapFaces(['front', 'left', 'back', 'right']);
    } else if (direction === -1) {
      this.swapFaces(['front', 'right', 'back', 'left']);
    }
  }
  rotateZ(direction) {
    if (direction === 1) {
      this.swapFaces(['top', 'right', 'bottom', 'left']);
    } else if (direction === -1) {
      this.swapFaces(['top', 'left', 'bottom', 'right']);
    }
  }

  rotate(axis, direction) {
    switch (axis) {
      case 'x':
        this.rotateX(direction);
        break;
      case 'y':
        this.rotateY(direction);
        break;
      case 'z':
        this.rotateZ(direction);
        break;
    }
  }

  generateMaterials() {
    const redMat = new THREE.MeshToonMaterial({ color: 0xfc0f03  });
    const orangeMat = new THREE.MeshToonMaterial({ color: 0xff6200 });
    const greenMat = new THREE.MeshToonMaterial({ color: 0x0ba313 });
    const blueMat = new THREE.MeshToonMaterial({ color: 0x0a0dbf });
    const yellowMat = new THREE.MeshToonMaterial({ color: 0xf8fc03 });
    const whiteMat = new THREE.MeshToonMaterial({ color: 0xeeeeee });
    const blackMat = new THREE.MeshToonMaterial({ color: 0x000000 });
    this.materials.push(...[
      orangeMat,
      redMat,
      blueMat,
      greenMat,
      yellowMat,
      whiteMat,
      blackMat,
    ]);
  }
    

  createTile(x, y, z) {
    const geometry = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const tile = new THREE.Mesh(geometry, this.materials[this.materials.length - 1]);
    tile.position.x = x;
    tile.position.y = y;
    tile.position.z = z;
    return { tile, colorValue: this.materials.length - 1 };
  }

  containsTile(tile, faceName) {
    for (const key in this.faces) {
      if (this.faces[key].tile === tile && key === faceName) {
        return true;
      }
    }
    return false;
  }

  colorFaces() {
    for (const key in this.faces) {
      this.faces[key].tile.material = this.materials[this.faces[key].colorValue];
    }
  }

  getColors() {
    return {
      front: this.faces.front.colorValue,
      back: this.faces.back.colorValue,
      left: this.faces.left.colorValue,
      right: this.faces.right.colorValue,
      top: this.faces.top.colorValue,
      bottom: this.faces.bottom.colorValue,
    }
  }
  assignColors(colors) {
    for (const key in colors) {
      this.faces[key].colorValue = colors[key];
    }
    this.colorFaces();
  }

  showFace(faceName) {
    this.cube.add(this.faces[faceName].tile);
    this.colorFaces();
  }
}
