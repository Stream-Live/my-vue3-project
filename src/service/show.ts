/*
 * @Author: Wjh
 * @Date: 2022-12-29 13:37:04
 * @LastEditors: Wjh
 * @LastEditTime: 2023-01-10 16:54:11
 * @FilePath: \my-vue3-project\src\service\show.ts
 * @Description: 
 * 
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; //rebe加载器
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import _json from '@/service/assets/data11.json'
import {import_data} from '@/service/threeutils'


export default class Show {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias:true,
      alpha:true,
    });
    (document.getElementById("canvas2") as HTMLElement).appendChild(
      this.renderer.domElement
    );

    // 开启Hidpi设置
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setClearColor(0x000000);

    this.scene = new THREE.Scene();
    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(10, 30, 30);
    this.camera.lookAt(0, 0, 0);

    
    // 控制相机
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    const axis = new THREE.AxesHelper(100);
    this.scene.add(axis);

    Object.assign(window, {
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      THREE,
    });
    this.initScene();

    this.render();
  }
  async initScene() {

    let pos: any = {
      x: 1.2374945831712103,
      y: 6.31389571203032,
      z: 43.07207561903153,
    };
    this.camera.position.copy(pos);

    let pos1: any = {
      x: 3.5529010671835515,
      y: 2.348368001854737,
      z: -0.2743600221327399,
    };
    this.controls.target.copy(pos1);

    this.controls.update();

    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");

    loader.setDRACOLoader(dracoLoader);

    let gltf = await loader.loadAsync((await import('@/service/assets/models/bdzzcjgd3.gltf')).default)
    this.scene.add(gltf.scene)

    import_data(_json, this.scene, this.controls);

  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    this.renderer.render(this.scene, this.camera);

    this.controls.update();
  }

}