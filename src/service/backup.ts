// /*
//  * @Author: Wjh
//  * @Date: 2022-12-08 20:27:19
//  * @LastEditors: Wjh
//  * @LastEditTime: 2022-12-30 11:50:06
//  * @FilePath: \my-vue3-project\src\service\backup.ts
//  * @Description:
//  *
//  */
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; //rebe加载器
// import { DragControls } from "three/examples/jsm/controls/DragControls";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
// import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import hdr_data from '@/service/assets/hdr/hdr'
// import { useStore } from "@/stores/index";
// import {
//   Message
// } from '@arco-design/web-vue'

// export default class Test {
//   private renderer: THREE.WebGLRenderer;
//   private scene: THREE.Scene;
//   private camera: THREE.PerspectiveCamera;
//   private controls: OrbitControls;
//   private composer: EffectComposer;
//   private fxaaPass: ShaderPass;

//   private text_div = document.createElement('div');

//   constructor() {

//     this.renderer = new THREE.WebGLRenderer({
//       antialias:true,
//       alpha:true,
//     });
//     (document.getElementById("canvas") as HTMLElement).appendChild(
//       this.renderer.domElement
//     );

//     // 开启Hidpi设置
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     this.renderer.setSize(window.innerWidth, window.innerHeight);

//     this.renderer.setClearColor(0x000000);

//     this.scene = new THREE.Scene();
//     const fov = 40; // 视野范围
//     const aspect = 2; // 相机默认值 画布的宽高比
//     const near = 0.1; // 近平面
//     const far = 10000; // 远平面
//     // 透视投影相机
//     this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//     this.camera.position.set(10, 30, 30);
//     this.camera.lookAt(0, 0, 0);
    
//     this.composer = new EffectComposer(this.renderer);
//     const renderPass = new RenderPass(this.scene, this.camera);
//     this.composer.addPass(renderPass);

//     // 添加outline
//     this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
//     this.outlinePass.visibleEdgeColor.set(0xffff00)
//     this.outlinePass.edgeStrength = 3;
//     this.outlinePass.edgeGlow = 0.3;
//     this.outlinePass.edgeThickness = 3;
//     this.composer.addPass(this.outlinePass);

//     // 添加抗锯齿
//     this.fxaaPass = new ShaderPass(FXAAShader);
//     const pixelRatio = this.renderer.getPixelRatio();
//     this.fxaaPass.material.uniforms["resolution"].value.x =
//       1 / (this.renderer.domElement.offsetWidth * pixelRatio);
//     this.fxaaPass.material.uniforms["resolution"].value.y =
//       1 / (this.renderer.domElement.offsetHeight * pixelRatio);
//     this.composer.addPass(this.fxaaPass);

//     // 控制相机
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.update();

//     const axis = new THREE.AxesHelper(100);
//     this.scene.add(axis);

//     Object.assign(window, {
//       scene: this.scene,
//       camera: this.camera,
//       controls: this.controls,
//       THREE,
//       composer: this.composer
//     });

//     this.render();

//     this.initLight();

//     this.initScene();

//     window.addEventListener("resize", this.onWindowResize.bind(this));
    
//   }

//   // 是否抗锯齿
//   toggleFXAA(val: boolean){
//     if(val){
      
//       this.composer.passes.length === 2 && this.composer.addPass(this.fxaaPass);
//     }else{

//       this.composer.removePass(this.composer.passes[2])
//     }
//   }

//   onWindowResize() {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();

//     this.renderer?.setSize(window.innerWidth, window.innerHeight);

//   }

//   private mouse = new THREE.Vector2();
//   private raycaster = new THREE.Raycaster();
//   private outlinePass: OutlinePass;

//   onClick(event: any) {

//     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

//     this.checkIntersection(event.ctrlKey);

//   }
//   checkIntersection(isMultiple: boolean) {

//     this.raycaster.setFromCamera(this.mouse, this.camera);

//     const intersects = this.raycaster.intersectObject(this.scene, true);

//     if (intersects.length > 0) {

//       const selectedObject = intersects[0].object;

//       this.outlinePass.visibleEdgeColor.set(0xffff00);

//       if(isMultiple){

//         let index = this.outlinePass.selectedObjects.indexOf(selectedObject);
//         index > -1 
//           ? this.outlinePass.selectedObjects.splice(index,1)
//           : this.outlinePass.selectedObjects.push(selectedObject);
//       }else{
//         this.outlinePass.selectedObjects = [selectedObject];
//       }


//     } else {

//       this.outlinePass.selectedObjects = [];

//     }
//     if(this.outlinePass.selectedObjects.length){
//       this.text_div.innerHTML = '已选择：' + this.outlinePass.selectedObjects.map(item => (item?.name) || '').join('、')
//     }else{
//       this.text_div.innerHTML = '';
//     }

//   }

//   async initScene() {
//     // let bg = await new THREE.TextureLoader().loadAsync(
//     //   (
//     //     await import("@/service/assets/images/1.jpg")
//     //   ).default
//     // );
//     // bg.mapping = THREE.EquirectangularReflectionMapping;
//     // this.scene.background = bg;

//     let pos: any = {
//       x: 1.2374945831712103,
//       y: 6.31389571203032,
//       z: 43.07207561903153,
//     };
//     this.camera.position.copy(pos);

//     let pos1: any = {
//       x: 3.5529010671835515,
//       y: 2.348368001854737,
//       z: -0.2743600221327399,
//     };
//     this.controls.target.copy(pos1);

//     this.controls.update();

//     const loader = new GLTFLoader();

//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("./draco/");

//     loader.setDRACOLoader(dracoLoader);

//     let gltf = await loader.loadAsync((await import('@/service/assets/models/bdzzcjgd3.gltf')).default)
//     this.scene.add(gltf.scene)

//   }

//   async initLight() {
//     let gui = new GUI();
//     let _this = this;

//     // GUI面板默认值
//     let params = {
//       hasAmbientLight: true, // 是否添加环境光
//       hasDirectionalLight: false, // 是否添加平行光
//       hasDirectionalLightTarget: false, // 是否添加平行光目标，默认是原点
//       hasPointLight: false, // 是否添加点光源
//       hasHemisphereLight: false, // 是否添加半球光
//       hasSpotLight: false, // 是否添加聚光灯
//       hasRectAreaLight: false, // 是否添加平面光
//       rectAreaLightTargetX: 0,
//       rectAreaLightTargetY: 0,
//       rectAreaLightTargetZ: 0,
//       isAddHdr: false,
//       curHdr: "",
//       curHdrSrc: "",
//       isAddFXAA: true,  // 是否添加后期抗锯齿
//       curBg: "",
//       curBgSrc: "",
//       rendererShadowMapEnabled: false,  // 是否开启阴影渲染
//       castDirectionalLightShadow: false,  // 是否投射平行光阴影
//     };
//     // 存储的object3D
//     let objs = {};
//     let configFolder = gui.addFolder("配置文件");
    
//     // 导入模型
//     function import_file(file){
//       console.log(file);
//       let suffix = file.name.substring(file.name.lastIndexOf('.')+1)

//       switch(suffix){

//         case 'gltf':
//           import_model(file);
//           break
//         case 'json':
//           import_data(file);
//           break
//         case 'hdr':
//           import_data(file);
//           break
//       }
      
//     }
//     // 导入配置文件json
//     function import_data(file){
//       //支持chrome IE10
//       if (window.FileReader) {
//         // 选中文件后清空配置
//         init(false);
//         let reader = new FileReader();
//         reader.onload = function (event) {
//           let json = JSON.parse(event.target.result);
//           handleImportData(json);
//         };
//         reader.readAsText(file);
//       }
//     }

//     function import_model(file){
//       //支持chrome IE10
//       if (window.FileReader) {
//         let reader = new FileReader();
//         reader.onload = async (event) => {
//           const loader = new GLTFLoader();

//           const dracoLoader = new DRACOLoader();
//           dracoLoader.setDecoderPath("./draco/");

//           loader.setDRACOLoader(dracoLoader);

//           loader.parse(event.target?.result, "", (gltf) => {
//             _this.scene.add(gltf.scene);
//           });
//         };

//         reader.readAsArrayBuffer(file);
//       }
//     }
//     // 添加拖拽导入
//     document.addEventListener(
//       "dragover",
//       (e) => {
//         e.preventDefault();
//       },
//       false
//     );
//     document.addEventListener(
//       "drop",
//       async (e) => {
//         e.preventDefault();
//         const files = e.dataTransfer.files;
        
//         import_file(files[0]);
//       },
//       false
//     );

//     // 模型
//     let modelFolder = gui.addFolder("模型");

//     {
//       let model_div = document.createElement("div");
//       model_div.style.display = "grid";
//       model_div.style["grid-template-columns"] = "repeat(2, 1fr)";
//       model_div.style["gap"] = "20px";
//       modelFolder.$children.append(model_div);

//       let import_btn = document.createElement("button");
//       import_btn.innerHTML = "导入";
//       model_div.append(import_btn);
//       import_btn.onclick = () => {
//         let inputObj: HTMLInputElement = document.createElement("input");
//         inputObj.setAttribute("type", "file");

//         //选中文件时触发的方法
//         inputObj.onchange = async () => {
//           import_model(inputObj.files[0]);
//         };
//         inputObj.click();
//       };

//       let reset_btn = document.createElement("button");
//       reset_btn.innerHTML = "清空";
//       model_div.append(reset_btn);

//       reset_btn.onclick = () => {
//         this.scene?.traverse((mesh: any) => {
//           if ((mesh?.geometry as THREE.BufferGeometry)?.dispose) {
//             mesh.geometry.dispose();
//           }
//           if (mesh?.material?.dispose) {
//             mesh.material.dispose();
//           }
//           if (mesh?.material?.map?.dispose) {
//             mesh.material.map.dispose();
//           }
//           if (mesh instanceof THREE.Group) {
//             mesh.clear();
//           }
//           if (mesh instanceof THREE.Object3D) {
//             mesh.clear();
//           }
//         });
//         const axis = new THREE.AxesHelper(100);
//         this.scene.add(axis);
//         // 选中文件后清空配置
//         init(true);
//       };
//     }

//     // 工具
//     let utilsFolder = gui.addFolder("工具");

//     {
//       let utils_div = document.createElement("div");
//       utils_div.style.display = "grid";
//       utils_div.style["grid-template-columns"] = "repeat(2, 1fr)";
//       utils_div.style["gap"] = "20px";
//       utilsFolder.$children.append(utils_div);

//       // 拾取一个点坐标
//       {
//         let boxMesh = new THREE.Mesh(
//           new THREE.BoxGeometry(0.5, 0.5, 0.5),
//           new THREE.MeshLambertMaterial({ color: 0x0000ff })
//         );
//         let transformControls = new TransformControls(
//           this.camera,
//           this.renderer.domElement
//         );
//         transformControls.addEventListener("mouseDown", (event) => {
//           if (!event.value) {
//             this.controls.enabled = false;
//           }
//         });
//         transformControls.addEventListener("mouseUp", (event) => {
//           if (!event.value) {
//             this.controls.enabled = true;
//             console.log(boxMesh.position);
//           }
//         });
//         transformControls.attach(boxMesh);

//         const start = () => {
//           boxMesh.position.set(10, 10, 10);
//           this.scene.add(transformControls);
//           this.scene.add(boxMesh);
//         };
//         const end = () => {
//           transformControls.removeFromParent();
//           boxMesh.removeFromParent();
//         };
//         let point_btn = document.createElement("button");
//         point_btn.innerHTML = "显示拾取点";
//         utils_div.append(point_btn);
//         point_btn.onclick = () => {
//           if (point_btn.innerHTML === "显示拾取点") {
//             start();
//             point_btn.innerHTML = "隐藏拾取点";
//           } else {
//             point_btn.innerHTML = "显示拾取点";
//             end();
//           }
//         };
//       }

//       // 拾取路径的点坐标
//       {
//         let meshList: Array<THREE.Mesh> = [];
//         let dragControls: DragControls;
//         let curPosition = new THREE.Vector3(10, 10, 10);
//         let boxColor = new THREE.Color("#0000ff");
//         let addColor = new THREE.Color("#ffff00");
//         let curvePath = new THREE.CurvePath();
//         let line: THREE.Line | null;

//         let dragstart = (event: any) => {
//           this.controls.enabled = false;
//         };

//         let dragend = (event: any) => {
//           this.controls.enabled = true;

//           curPosition.copy(event.object.position);
//           console.log(meshList.map((item) => item.position));

//           // 显示线条的时候更新线条
//           if (line) {
//             const points = curvePath.getPoints(50) as THREE.Vector3[];
//             line.geometry.setFromPoints(points);
//           }
//         };

//         const rightclick = (event: any) => {
//           // 右击新增
//           if (event.button == 2) {
//             meshList[meshList.length - 1].material.color = boxColor;

//             let box = new THREE.Mesh(
//               new THREE.BoxGeometry(0.5, 0.5, 0.5),
//               new THREE.MeshBasicMaterial({ color: addColor })
//             );
//             box?.position.set(
//               curPosition.x + 0.6,
//               curPosition.y,
//               curPosition.z
//             );

//             this.scene.add(box);
//             meshList.push(box);
//           }
//         };

//         const start = () => {
//           curPosition.set(10, 10, 10);
//           let box = new THREE.Mesh(
//             new THREE.BoxGeometry(0.5, 0.5, 0.5),
//             new THREE.MeshLambertMaterial({ color: boxColor })
//           );
//           box?.position.copy(curPosition);

//           this.scene.add(box);
//           meshList = [box];

//           window.addEventListener("mousedown", rightclick);

//           dragControls = new DragControls(
//             meshList,
//             this.camera,
//             this.renderer.domElement
//           );
//           dragControls.addEventListener("dragstart", dragstart);
//           dragControls.addEventListener("dragend", dragend);
//         };
//         const end = () => {
//           meshList.forEach((item) => item.removeFromParent());

//           window.removeEventListener("mousedown", rightclick);

//           dragControls.removeEventListener("dragstart", dragstart);
//           dragControls.removeEventListener("dragend", dragend);
//           dragControls.dispose();
//         };

//         let line_switch_btn = document.createElement("button");
//         line_switch_btn.innerHTML = "显示拾取路径点";
//         utils_div.append(line_switch_btn);
//         line_switch_btn.onclick = () => {
//           if (line_switch_btn.innerHTML == "显示拾取路径点") {
//             line_switch_btn.innerHTML = "隐藏拾取路径点";
//             start();
//           } else {
//             line_switch_btn.innerHTML = "显示拾取路径点";
//             end();
//           }
//         };

//         let line_connect_btn = document.createElement("button");
//         line_connect_btn.innerHTML = "显示连线";
//         utils_div.append(line_connect_btn);
//         line_connect_btn.onclick = () => {
//           if (line_connect_btn.innerHTML === "显示连线") {
//             line_connect_btn.innerHTML = "隐藏连线";

//             curvePath = new THREE.CurvePath();
//             for (let i = 0; i < meshList.length - 1; i++) {
//               let p1 = meshList[i].position,
//                 p2 = meshList[(i + 1) % meshList.length].position;
//               const lineCurve = new THREE.LineCurve3(p1, p2);
//               curvePath.add(lineCurve);
//             }
//             const points = curvePath.getPoints(50) as THREE.Vector3[];
//             line = new THREE.Line(
//               new THREE.BufferGeometry().setFromPoints(points),
//               new THREE.LineBasicMaterial({ color: 0xff0000 })
//             );
//             this.scene.add(line);
//           } else {
//             line_connect_btn.innerHTML = "显示连线";
//             line?.removeFromParent();
//             line = null;
//           }
//         };
//       }

//       // 选择物体
//       let p = {isChoose: false, isTransparent: false};
//       {
//         let event = this.onClick.bind(this);

//         let choose_btn = document.createElement("button");
//         choose_btn.innerHTML = "选择物体";
//         utils_div.append(choose_btn);
//         choose_btn.onclick = () => {
//           if (choose_btn.innerHTML === "选择物体") {
//             this.renderer.domElement.addEventListener("click", event);
//             choose_btn.innerHTML = "取消选择物体";
//           } else {
//             choose_btn.innerHTML = "选择物体";
//             this.renderer.domElement.removeEventListener("click", event);
//             this.outlinePass.selectedObjects = [];
//             this.text_div.innerHTML = '';
//           }
//         };

//       }
//       // 是否隐藏选择物体
//       {
//         let toggle_show_btn = document.createElement("button");
//         toggle_show_btn.innerHTML = "隐藏选中物体";
//         utils_div.append(toggle_show_btn);
//         toggle_show_btn.onclick = () => {
          
//           if(!this.outlinePass.selectedObjects?.length){
//             return;
//           }

//           if (toggle_show_btn.innerHTML === "隐藏选中物体") {
//             this.outlinePass.selectedObjects.forEach(item => {

//               item.visible = false;
//             });
//             toggle_show_btn.innerHTML = "显示选中物体";
//           } else {
//             toggle_show_btn.innerHTML = "隐藏选中物体";
//             this.outlinePass.selectedObjects.forEach(item => {

//               item.visible = true;
//             });
//           }
//         };

//       }

//       this.text_div.setAttribute('style', `font-size: medium;margin: 10px;`)
//       utilsFolder.$children.append(this.text_div);

//       // 是否添加抗锯齿
//       {
//         utilsFolder
//         .add(params, "isAddFXAA")
//         .name("是否添加抗锯齿")
//         .onChange(() => {
//           this.toggleFXAA(params.isAddFXAA);
//         })
//         .listen();
//       }
//       // 是否开启阴影渲染
//       {
//         utilsFolder
//         .add(params, "rendererShadowMapEnabled")
//         .name("是否开启阴影渲染")
//         .onChange(() => {
//           this.renderer.shadowMap.enabled = params.rendererShadowMapEnabled
          
//         })
//         .listen();
//       }
//       // 选中物体是否接收阴影
//       {
//         let p = {receiveShadow: false};
//         utilsFolder
//         .add(p, "receiveShadow")
//         .name("选中物体是否接收阴影")
//         .onChange(() => {
//           this.outlinePass.selectedObjects.forEach(item => {

//             if(!objs[item.name]){
//               objs[item.name] = {}
//             }
//             item.receiveShadow = objs[item.name]['receiveShadow'] = p.receiveShadow;
//           })
          
//         })
//         .listen();
//       }
//       // 选中物体是否投射阴影
//       {
//         let p = {castShadow: false};
//         utilsFolder
//         .add(p, "castShadow")
//         .name("选中物体是否投射阴影")
//         .onChange(() => {
//           this.outlinePass.selectedObjects.forEach(item => {

//             if(!objs[item.name]){
//               objs[item.name] = {}
//             }
//             item.castShadow = objs[item.name]['castShadow'] = p.castShadow;
//           })
          
//         })
//         .listen();
//       }
//     }

//     // 1、环境光
//     let ambientLight = new THREE.AmbientLight();
//     this.scene.add(ambientLight);

//     let ambientLightFolder = gui.addFolder("环境光");
//     ambientLightFolder.close();

//     {
//       ambientLightFolder
//         .add(params, "hasAmbientLight")
//         .name("是否添加")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(ambientLight.name);
//           console.log(params.hasAmbientLight, light);

//           if (params.hasAmbientLight && !light) {
//             this.scene.add(ambientLight);
//           }
//           if (!params.hasAmbientLight && light) {
//             light.removeFromParent();
//           }
//         })
//         .listen();
//       ambientLightFolder
//         .add(ambientLight, "intensity", 0, 5, 0.1)
//         .name("光照强度")
//         .listen();
//       ambientLightFolder.addColor(ambientLight, "color").listen();
//     }

//     // 2、平行光
//     let directionalLight = new THREE.DirectionalLight();

//     let directionalLightFolder = gui.addFolder("平行光");
//     directionalLightFolder.close();

//     {
//       directionalLightFolder
//         .add(params, "hasDirectionalLight")
//         .name("是否添加")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(directionalLight.name);

//           if (params.hasDirectionalLight && !light) {
//             this.scene.add(directionalLight);
//           }
//           if (!params.hasDirectionalLight && light) {
//             light.removeFromParent();
//           }
//         })
//         .listen();

//       directionalLightFolder
//         .add(directionalLight, "intensity", 0, 5, 0.1)
//         .name("光照强度")
//         .listen();
//       directionalLightFolder.addColor(directionalLight, "color").listen();

//       directionalLightFolder
//         .add(directionalLight.position, "x")
//         .name("光源位置的x")
//         .listen();
//       directionalLightFolder
//         .add(directionalLight.position, "y")
//         .name("光源位置的y")
//         .listen();
//       directionalLightFolder
//         .add(directionalLight.position, "z")
//         .name("光源位置的z")
//         .listen();

//       directionalLightFolder
//         .add(params, "castDirectionalLightShadow")
//         .name("是否投射阴影")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(directionalLight.name);

//           if (light && params.hasDirectionalLight) {
//             light.castShadow = params.castDirectionalLightShadow;
//           }else{
//             Message.warning('请先添加 平行光')
//           }
//         })
//         .listen();
//     }

//     // 平行光目标
//     let directionalLightTarget = new THREE.Object3D();
//     {
//       directionalLightFolder
//         .add(params, "hasDirectionalLightTarget")
//         .name("是否添加目标")
//         .onChange(() => {
//           // 先检查有没有平行光
//           let light = this.scene.getObjectByName(directionalLight.name);
//           if (!light) {
//             params.hasDirectionalLightTarget = false;
//             return;
//           }
//           let target = this.scene.getObjectByName(directionalLightTarget.name);
//           if (!target && params.hasDirectionalLightTarget) {
//             directionalLight.target = directionalLightTarget;
//             this.scene.add(directionalLight.target);
//           }
//           if (target && !params.hasDirectionalLightTarget) {
//             directionalLight.target.removeFromParent();
//           }
//         })
//         .listen();
//       directionalLightFolder
//         .add(directionalLightTarget.position, "x")
//         .name("目标的x")
//         .listen();
//       directionalLightFolder
//         .add(directionalLightTarget.position, "y")
//         .name("目标的y")
//         .listen();
//       directionalLightFolder
//         .add(directionalLightTarget.position, "z")
//         .name("目标的z")
//         .listen();
//     }

//     // 3、点光源
//     let pointLight = new THREE.PointLight();
//     let pointLightFolder = gui.addFolder("点光源");
//     pointLightFolder.close();
//     {
//       pointLightFolder
//         .add(params, "hasPointLight")
//         .name("是否添加")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(pointLight.name);

//           if (params.hasPointLight && !light) {
//             this.scene.add(pointLight);
//           }
//           if (!params.hasPointLight && light) {
//             light.removeFromParent();
//           }
//         })
//         .listen();

//       pointLightFolder
//         .add(pointLight, "intensity", 0, 5, 0.1)
//         .name("光照强度")
//         .listen();
//       pointLightFolder.addColor(pointLight, "color").listen();

//       pointLightFolder
//         .add(pointLight.position, "x")
//         .name("光源位置的x")
//         .listen();
//       pointLightFolder
//         .add(pointLight.position, "y")
//         .name("光源位置的y")
//         .listen();
//       pointLightFolder
//         .add(pointLight.position, "z")
//         .name("光源位置的z")
//         .listen();
//     }

//     // 4、半球光
//     let hemisphereLight = new THREE.HemisphereLight();
//     let hemisphereLightFolder = gui.addFolder("半球光");
//     hemisphereLightFolder.close();
//     {
//       hemisphereLightFolder
//         .add(params, "hasHemisphereLight")
//         .name("是否添加")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(hemisphereLight.name);

//           if (params.hasHemisphereLight && !light) {
//             this.scene.add(hemisphereLight);
//           }
//           if (!params.hasHemisphereLight && light) {
//             light.removeFromParent();
//           }
//         })
//         .listen();

//       hemisphereLightFolder
//         .add(hemisphereLight, "intensity", 0, 5, 0.1)
//         .name("光照强度")
//         .listen();
//       hemisphereLightFolder
//         .addColor(hemisphereLight, "color")
//         .name("天空发出的颜色")
//         .listen();
//       hemisphereLightFolder
//         .addColor(hemisphereLight, "groundColor")
//         .name("地面发出的颜色")
//         .listen();

//       // 这三个属性用处不大，不加了
//       // hemisphereLightFolder
//       //   .add(hemisphereLight.position, "x")
//       //   .name("光源位置的x")
//       //   .listen();
//       // hemisphereLightFolder
//       //   .add(hemisphereLight.position, "y", -1000, 1000, 1)
//       //   .name("光源位置的y")
//       //   .listen();
//       // hemisphereLightFolder
//       //   .add(hemisphereLight.position, "z", -1000, 1000, 1)
//       //   .name("光源位置的z")
//       // .listen();
//     }

//     // 5、平面光
//     let rectAreaLight = new THREE.RectAreaLight();
//     let rectAreaLightFolder = gui.addFolder("平面光");
//     rectAreaLightFolder.close();
//     {
//       rectAreaLightFolder
//         .add(params, "hasRectAreaLight")
//         .name("是否添加")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(rectAreaLight.name);

//           if (params.hasRectAreaLight && !light) {
//             this.scene.add(rectAreaLight);
//           }
//           if (!params.hasRectAreaLight && light) {
//             light.removeFromParent();
//           }
//         })
//         .listen();

//       rectAreaLightFolder
//         .add(rectAreaLight, "intensity", 0, 5, 0.1)
//         .name("光照强度")
//         .listen();
//       rectAreaLightFolder.addColor(rectAreaLight, "color").listen();
//       rectAreaLightFolder.add(rectAreaLight, "width").name("宽").listen();
//       rectAreaLightFolder.add(rectAreaLight, "height").name("高").listen();

//       rectAreaLightFolder
//         .add(rectAreaLight.position, "x")
//         .name("光源位置的x")
//         .listen();
//       rectAreaLightFolder
//         .add(rectAreaLight.position, "y")
//         .name("光源位置的y")
//         .listen();
//       rectAreaLightFolder
//         .add(rectAreaLight.position, "z")
//         .name("光源位置的z")
//         .listen();

//       rectAreaLightFolder
//         .add(params, "rectAreaLightTargetX")
//         .name("光源目标位置的x")
//         .onChange((val: any) => {
//           rectAreaLight.lookAt(
//             params.rectAreaLightTargetX,
//             params.rectAreaLightTargetY,
//             params.rectAreaLightTargetZ
//           );
//         })
//         .listen();
//       rectAreaLightFolder
//         .add(params, "rectAreaLightTargetY")
//         .name("光源目标位置的y")
//         .onChange((val: any) => {
//           rectAreaLight.lookAt(
//             params.rectAreaLightTargetX,
//             params.rectAreaLightTargetY,
//             params.rectAreaLightTargetZ
//           );
//         })
//         .listen();
//       rectAreaLightFolder
//         .add(params, "rectAreaLightTargetZ")
//         .name("光源目标位置的z")
//         .onChange((val: any) => {
//           rectAreaLight.lookAt(
//             params.rectAreaLightTargetX,
//             params.rectAreaLightTargetY,
//             params.rectAreaLightTargetZ
//           );
//         })
//         .listen();
//     }

//     // 6、聚光灯
//     let spotLight = new THREE.SpotLight();
//     let spotLightFolder = gui.addFolder("聚光灯");
//     spotLightFolder.close();
//     {
//       spotLightFolder
//         .add(params, "hasSpotLight")
//         .name("是否添加")
//         .onChange(() => {
//           let light = this.scene.getObjectByName(spotLight.name);

//           if (params.hasSpotLight && !light) {
//             this.scene.add(spotLight);
//           }
//           if (!params.hasSpotLight && light) {
//             light.removeFromParent();
//           }
//         })
//         .listen();

//       spotLightFolder
//         .add(spotLight, "intensity", 0, 5, 0.1)
//         .name("光照强度")
//         .listen();
//       spotLightFolder.addColor(spotLight, "color").listen();
//       spotLightFolder.add(spotLight, "distance").name("最大距离").listen();
//       spotLightFolder
//         .add(spotLight, "angle", -Math.PI * 0.5, Math.PI * 0.5)
//         .name("光线散射角度")
//         .listen();
//       spotLightFolder
//         .add(spotLight, "penumbra", 0, 1)
//         .name("聚光锥的半影衰减百分比")
//         .listen();
//       spotLightFolder
//         .add(spotLight, "decay", 0, 1)
//         .name("沿着光照距离的衰减量")
//         .listen();

//       spotLightFolder.add(spotLight.position, "x").name("光源位置的x").listen();
//       spotLightFolder.add(spotLight.position, "y").name("光源位置的y").listen();
//       spotLightFolder.add(spotLight.position, "z").name("光源位置的z").listen();
//     }
//     // 7、hdr贴图
//     let hdrFolder = gui.addFolder("HDR");
//     const rgbeLoader = new RGBELoader();

//     // 添加容器
//     let hdr_div = document.createElement("div");

//     {
//       hdrFolder
//         .add(params, "isAddHdr")
//         .name("是否添加")
//         .onChange(async () => {
//           if (params.isAddHdr) {
//             let texture = await rgbeLoader.loadAsync(params.curHdr);
//             texture.mapping = THREE.EquirectangularReflectionMapping;

//             _this.scene.environment = texture;
//           } else {
//             this.scene.environment = null;
//             params.curHdrSrc = "";
//           }
//         })
//         .listen();

//       hdrFolder.$children.append(hdr_div);
//       hdr_div.style.display = "grid";
//       hdr_div.style["grid-template-columns"] = "repeat(2, 1fr)";
//       hdr_div.style["gap"] = "10px";

//       // 导入hdr
//       let import_hdr_btn = document.createElement("button");
//       import_hdr_btn.innerHTML = "导入";
//       hdr_div.append(import_hdr_btn);
//       import_hdr_btn.onclick = () => {
//         if (!params.isAddHdr) {
//           Message.warning('请先在HDR里选中 是否添加');
//           return;
//         }
//         let inputObj: HTMLInputElement = document.createElement("input");
//         inputObj.setAttribute("type", "file");

//         //选中文件时触发的方法
//         inputObj.onchange = async () => {
//           //支持chrome IE10
//           if (window.FileReader) {
//             let file = inputObj.files[0];
//             let reader = new FileReader();
//             reader.onload = async function (event) {
//               params.curHdr = event.target?.result;

//               console.log(params.curHdr);
              
//               let texture = await rgbeLoader.loadAsync(params.curHdr);

//               texture.mapping = THREE.EquirectangularReflectionMapping;

//               _this.scene.environment = texture;

//               params.curHdrSrc = "";
//             };

//             reader.readAsDataURL(file);
//           }
//         };
//         inputObj.click();
//       };

//       // 加载预设hdr
//       let hdr_files = await import.meta.glob("@/service/assets/hdr/*.jpg");
//       for (let key in hdr_files) {
//         let src = (await hdr_files[key]()).default;
//         let img = new Image();
//         img.src = src;
//         img.style.width = "100px";

//         hdr_div.append(img);

//         img.onclick = async (event) => {

//           if(!params.isAddHdr){
//             Message.warning('请先在HDR里选中 是否添加');
//             return;
//           } 

//           let list = hdr_div.getElementsByTagName('img');
//           for(let item of list){
//             item.style.border = "none";
//           }
//           event.target.style.border = "solid 2px #ffff00";

//           params.curHdrSrc = getCurSrc(event.target.src);
//           params.curHdr = hdr_data[params.curHdrSrc];
//           let texture = await rgbeLoader.loadAsync(params.curHdr);
//           texture.mapping = THREE.EquirectangularReflectionMapping;
//           _this.scene.environment = texture;
          
//           console.log(event.target.src);
          
//         };
//       }
//     }
//     function getCurSrc(src: string){
//       let url = src.substring(src.lastIndexOf('/')+1)
//       return url.substring(0, url.indexOf('.'))
//     }
//     // 8、背景贴图
//     let bgFolder = gui.addFolder("背景");

//     const textureLoader = new THREE.TextureLoader();
//     // 预设背景
//     let img_map = new Map();
//     // 添加容器
//     let bg_div = document.createElement("div");

//     {
//       bgFolder.$children.append(bg_div);
//       bg_div.style.display = "grid";
//       bg_div.style["grid-template-columns"] = "repeat(2, 1fr)";
//       bg_div.style["gap"] = "10px";

//       // 导入图片
//       let import_bg_btn = document.createElement("button");
//       import_bg_btn.innerHTML = "导入";
//       bg_div.append(import_bg_btn);
//       import_bg_btn.onclick = () => {
//         let inputObj: HTMLInputElement = document.createElement("input");
//         inputObj.setAttribute("type", "file");

//         //选中文件时触发的方法
//         inputObj.onchange = async () => {
//           //支持chrome IE10
//           if (window.FileReader) {
//             let file = inputObj.files[0];
//             let reader = new FileReader();
//             reader.onload = async function (event) {
//               params.curBg = event.target?.result;

//               let texture = await textureLoader.loadAsync(params.curBg);

//               texture.mapping = THREE.EquirectangularReflectionMapping;
//               _this.scene.background = texture;

//               params.curBgSrc = "";
//             };

//             reader.readAsDataURL(file);
//           }
//         };
//         inputObj.click();
//       }

//       // 加载预设背景图片
//       let img_files = await import.meta.glob("@/service/assets/sky/*.jpg");
//       for (let key in img_files) {
//         let src = (await img_files[key]()).default;
//         let img = new Image();
//         img.src = src;
//         img.style.width = "100px"; 

//         bg_div.append(img);

//         let img1 = new Image();
//         img1.src = src;
//         img_map.set(getCurSrc(img.src), img1);

//         img.onclick = async (event) => {

//           params.curBgSrc = getCurSrc(event.target.src);
          
//           params.curBg = getBase64Image(img_map.get(params.curBgSrc));
//           let texture = await textureLoader.loadAsync(params.curBg);
//           texture.mapping = THREE.EquirectangularReflectionMapping;
//           _this.scene.background = texture;

//           let list = bg_div.getElementsByTagName('img');
//           for(let item of list){
//             item.style.border = "none";
//           }
//           event.target.style.border = "solid 2px #ffff00";
//         };
//       }
      
//     }
//     function getBase64Image(img: Image) {  
//       let canvas = document.createElement("canvas");  
//       canvas.width = img.width;  
//       canvas.height = img.height;  
//       let ctx = canvas.getContext("2d");  
//       ctx.drawImage(img, 0, 0, img.width, img.height);  
//       let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
//       let dataURL = canvas.toDataURL("image/"+ext);  
//       return dataURL;  
//     }

//     // 配置文件
//     let config_div = document.createElement("div");
//     configFolder.$children.append(config_div);
//     config_div.style.display = "grid";
//     config_div.style["grid-template-columns"] = "repeat(2, 1fr)";
//     config_div.style["gap"] = "20px";

//     // 导出
//     let export_btn = document.createElement("button");
//     export_btn.innerHTML = "导出";
//     config_div.append(export_btn);
//     export_btn.onclick = () => {
//       let data = getExportJson();
//       let blob = new Blob([data]); //  创建 blob 对象
//       let link = document.createElement("a");
//       link.href = URL.createObjectURL(blob); //  创建一个 URL 对象并传给 a 的 href
//       link.download = "data.json"; //  设置下载的默认文件名
//       link.click();
//     };
//     function getExportJson() {
//       let data: any = {};

//       data[ambientLight.name] = ambientLight.toJSON();

//       data[directionalLight.name] = directionalLight.toJSON();

//       data[directionalLightTarget.name] = directionalLightTarget.toJSON();

//       data[pointLight.name] = pointLight.toJSON();

//       data[hemisphereLight.name] = hemisphereLight.toJSON();

//       data[spotLight.name] = spotLight.toJSON();

//       data[rectAreaLight.name] = rectAreaLight.toJSON();

//       return JSON.stringify({ data, params, objs });
//     }

//     // 导入
//     let import_btn = document.createElement("button");
//     import_btn.innerHTML = "导入";
//     config_div.append(import_btn);
//     import_btn.onclick = () => {
//       let inputObj: HTMLInputElement = document.createElement("input");
//       inputObj.setAttribute("type", "file");

//       //选中文件时触发的方法
//       inputObj.onchange = () => {
        
//         import_file(inputObj.files[0]);
//       };
//       inputObj.click();
//     };
//     async function handleImportData(data: any) {
//       Object.assign(params, data.params);

//       let map: any = {
//         AmbientLight: (obj: any) => {
//           ambientLight.copy(obj);
//           if (params.hasAmbientLight) {
//             _this.scene.add(ambientLight);
//             ambientLightFolder.open();
//           } else {
//             ambientLightFolder.close();
//           }
//         },
//         DirectionalLight: (obj: any) => {
//           directionalLight.copy(obj);

//           if (params.hasDirectionalLight) {
//             _this.scene.add(directionalLight);
//             directionalLightFolder.open();
//           } else {
//             directionalLightFolder.close();
//           }
//         },
//         DirectionalLightTarget: (obj: any) => {
//           directionalLightTarget.copy(obj);
//           if (params.hasDirectionalLightTarget) {
//             _this.scene.add(directionalLightTarget);
//             directionalLight.target = directionalLightTarget;
//           }
//         },
//         PointLight: (obj: any) => {
//           pointLight.copy(obj);
//           if (params.hasPointLight) {
//             _this.scene.add(pointLight);
//             pointLightFolder.open();
//           } else {
//             pointLightFolder.close();
//           }
//         },
//         HemisphereLight: (obj: any) => {
//           hemisphereLight.copy(obj);
//           if (params.hasHemisphereLight) {
//             _this.scene.add(hemisphereLight);
//             hemisphereLightFolder.open();
//           } else {
//             hemisphereLightFolder.close();
//           }
//         },
//         SpotLight: (obj: any) => {
//           spotLight.copy(obj);
//           if (params.hasSpotLight) {
//             _this.scene.add(spotLight);
//             spotLightFolder.open();
//           } else {
//             spotLightFolder.close();
//           }
//         },
//         RectAreaLight: (obj: any) => {
//           rectAreaLight.copy(obj);
//           if (params.hasRectAreaLight) {
//             _this.scene.add(rectAreaLight);
//             rectAreaLight.lookAt(
//               params.rectAreaLightTargetX,
//               params.rectAreaLightTargetY,
//               params.rectAreaLightTargetZ
//             );
//             rectAreaLightFolder.open();
//           } else {
//             rectAreaLightFolder.close();
//           }
//         },
//       };

//       let lightObj: any = {};
//       for (let key in data.data) {
//         let objJson = data.data[key];

//         let obj = await new THREE.ObjectLoader().parseAsync(objJson);
//         lightObj[key] = obj;
//       }
//       for (let key in lightObj) {
//         map[key] && map[key](lightObj[key]);
//       }

//       if (params.isAddHdr && params.curHdr) {
//         let texture = await rgbeLoader.loadAsync(params.curHdr);
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         _this.scene.environment = texture;
//       }

//       if (params.curBg) {
//         let texture = await textureLoader.loadAsync(params.curBg);
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         _this.scene.background = texture;

//       }

//       // 选中图片
//       let img = img_map.get(params.curBgSrc)
//       if(img){
//         let list = bg_div.getElementsByTagName('img');
//         for(let item of list){
//           if(getCurSrc(item.src) === params.curBgSrc){
//             item.style.border = "solid 2px #ffff00";
//             break
//           }
//         }
//       }

//       // 选中HDR
//       let hdr = hdr_data[params.curHdrSrc];
//       if(hdr){
//         let list = hdr_div.getElementsByTagName('img');
//         for(let item of list){
          
//           if(getCurSrc(item.src) === params.curHdrSrc){
//             item.style.border = "solid 2px #ffff00";
//             break
//           }
//         }
//       }

//       _this.toggleFXAA(params.isAddFXAA);

//     }

//     // 初始化params和灯光数据
//     function init(hasAmbientLight: boolean) {
//       Object.assign(params, {
//         hasAmbientLight: false, // 是否添加环境光
//         hasDirectionalLight: false, // 是否添加平行光
//         hasDirectionalLightTarget: false, // 是否添加平行光目标，默认是原点
//         hasPointLight: false,
//         hasHemisphereLight: false,
//         hasRectAreaLight: false,
//         rectAreaLightTargetX: 0,
//         rectAreaLightTargetY: 0,
//         rectAreaLightTargetZ: 0,
//         isAddHdr: false,
//         curHdr: "",
//         curHdrSrc: "",
//         isAddFXAA: true,
//         curBg: "",
//         curBgSrc: "",
//         rendererShadowMapEnabled: false,  // 是否开启阴影渲染
//       });
//       ambientLight.copy(new THREE.AmbientLight());
//       ambientLight.name = "AmbientLight";
//       ambientLight.removeFromParent();

//       directionalLight.copy(new THREE.DirectionalLight());
//       directionalLight.name = "DirectionalLight";
//       directionalLight.removeFromParent();

//       directionalLightTarget.copy(new THREE.Object3D());
//       directionalLightTarget.name = "DirectionalLightTarget";
//       directionalLight.removeFromParent();

//       pointLight.copy(new THREE.PointLight());
//       pointLight.name = "PointLight";
//       pointLight.removeFromParent();

//       hemisphereLight.copy(new THREE.HemisphereLight());
//       hemisphereLight.name = "HemisphereLight";
//       hemisphereLight.removeFromParent();

//       spotLight.copy(new THREE.SpotLight());
//       spotLight.name = "SpotLight";
//       spotLight.removeFromParent();

//       rectAreaLight.copy(new THREE.RectAreaLight());
//       rectAreaLight.name = "RectAreaLight";
//       rectAreaLight.removeFromParent();

//       if (hasAmbientLight) {
//         _this.scene.add(ambientLight);
//         params.hasAmbientLight = true;
//         ambientLightFolder.open();
//       }
//       _this.scene.environment = null;
//       _this.scene.background = null;

//       // 清空选中的图片
//       let bg_list = bg_div.getElementsByTagName('img');
//       for(let item of bg_list){
//         item.style.border = "none";
//       }
//       bg_list[0].click();
      
//       // 清空选中的hdr
//       let hdr_list = hdr_div.getElementsByTagName('img');
//       for(let item of hdr_list){
//         item.style.border = "none";
//       }
//     }

//     init(true);

//   }

//   render() {
//     requestAnimationFrame(this.render.bind(this));

//     this.renderer.render(this.scene, this.camera);

//     this.composer.render();
//   }
// }
