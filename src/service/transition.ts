/*
 * @Author: Wjh
 * @Date: 2022-12-22 12:48:18
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-22 15:36:00
 * @FilePath: \my-vue3-project\src\service\transition.ts
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
import { AmbientLight } from "three";
import IndexDB from "./indexdb";
import axios from "axios";
import { useStore } from "@/stores/index";

export default class Transition {
  private static instance: Transition;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private sceneMap: Map<string, THREE.Group> = new Map();
  private curScene: THREE.Group;

  private indexDB: IndexDB;

  constructor() {
    this.indexDB = IndexDB.getInstaance();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿

      alpha: true,
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
    this.camera.position.set(77, 166, 0);
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
    });

    this.render();

    this.initModel();

    this.initLight();
  }

  public static getInstance() {
    if (!Transition.instance) {
      Transition.instance = new Transition();
    }
    return Transition.instance;
  }
  async initModel() {
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    // const tashan = (
    //   await loader.loadAsync(
    //     (
    //       await import("@/service/assets/models/tashan.glb")
    //     ).default // 换模型
    //   )
    // ).scene;
    // tashan.name = "tashan";
    // this.sceneMap.set("tashan", tashan);
    let tashan = await axios.get(
      (
        await import("@/service/assets/models/tashan.glb")
      ).default,
      {
        responseType: "blob",
      }
    );
    this.indexDB.addModel(0, "tashan", new Blob([tashan.data]));

    // 沙溪
    // const shaxi = (
    //   await loader.loadAsync(
    //     (
    //       await import("@/service/assets/models/shaxi-main.glb")
    //     ).default // 换模型
    //   )
    // ).scene;
    // shaxi.name = "shaxi";
    // this.sceneMap.set("shaxi", shaxi);
    let shaxi = await axios.get(
      (
        await import("@/service/assets/models/shaxi-main.glb")
      ).default,
      {
        responseType: "blob",
      }
    );
    this.indexDB.addModel(1, "shaxi", new Blob([shaxi.data]));

    // 镜岭
    // const jingling = (
    //   await loader.loadAsync(
    //     (
    //       await import("@/service/assets/models/jingling-main.glb")
    //     ).default // 换模型
    //   )
    // ).scene;
    // jingling.name = "jingling";
    // this.sceneMap.set("jingling", jingling);
    let jingling = await axios.get(
      (
        await import("@/service/assets/models/jingling-main.glb")
      ).default,
      {
        responseType: "blob",
      }
    );
    this.indexDB.addModel(2, "jingling", new Blob([jingling.data]));

    // this.curScene = this.sceneMap.get("tashan");
    // this.scene.add(this.curScene);
  }
  initLight() {
    this.scene.add(new AmbientLight(0xffffff, 1.3));
  }

  async changeScene(name: string) {
    const store = useStore();
    store.isLoading = true;
    console.log("转到下一个：", name);
    let data = await this.indexDB.getModel(name);
    console.log(data);

    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let url = URL.createObjectURL(new Blob([data.model]));

    this.curScene?.removeFromParent();
    this.curScene?.traverse((mesh) => {
      if ((mesh?.geometry as THREE.BufferGeometry)?.dispose) {
        mesh.geometry.dispose();
      }
      if (mesh?.material?.dispose) {
        mesh.material.dispose();
      }
      if (mesh?.material?.map?.dispose) {
        mesh.material.map.dispose();
      }
      if (mesh instanceof THREE.Group) {
        mesh.clear();
      }
      if (mesh instanceof THREE.Object3D) {
        mesh.clear();
      }
    });

    this.curScene = (await loader.loadAsync(url)).scene;
    this.scene.add(this.curScene);

    store.isLoading = false;
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    this.renderer.render(this.scene, this.camera);
  }
}
