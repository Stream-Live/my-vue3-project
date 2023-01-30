/*
 * @Author: Wjh
 * @Date: 2022-12-08 20:27:12
 * @LastEditors: Wjh
 * @LastEditTime: 2023-01-10 16:51:50
 * @FilePath: \my-vue3-project\src\service\threeutils.ts
 * @Description: 
 * 
 */
import * as THREE from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; //rebe加载器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入json文件
export const import_data = async (_json: any, _scene: THREE.Scene, _controls: OrbitControls) => {

  
  Object.assign(_controls, _json.controls);

  let loader = new THREE.ObjectLoader();
  let params = _json.params;
  let lightObj: any = {};
  const rgbeLoader = new RGBELoader();
  const textureLoader = new THREE.TextureLoader();

  let map: any = {
    AmbientLight: (obj: any) => {
      if (params.hasAmbientLight) {
        _scene.add(obj);
      } 
    },
    DirectionalLight: (obj: any) => {

      if (params.hasDirectionalLight) {
        _scene.add(obj);
      } 
    },
    DirectionalLightTarget: (obj: any) => {
      if (params.hasDirectionalLightTarget) {
        _scene.add(obj);
        lightObj['DirectionalLight'].target = obj;
      }
    },
    PointLight: (obj: any) => {
      if (params.hasPointLight) {
        _scene.add(obj);
      }
    },
    HemisphereLight: (obj: any) => {
      if (params.hasHemisphereLight) {
        _scene.add(obj);
      }
    },
    SpotLight: (obj: any) => {
      if (params.hasSpotLight) {
        _scene.add(obj);
      }
    },
    RectAreaLight: (obj: any) => {
      if (params.hasRectAreaLight) {
        obj.lookAt(
          params.rectAreaLightTargetX,
          params.rectAreaLightTargetY,
          params.rectAreaLightTargetZ
        );
        _scene.add(obj);
      } 
    },
  };

  for (let key in _json.data) {
    let objJson = _json.data[key];

    let obj = await loader.parseAsync(objJson);
    lightObj[key] = obj;
  }
  for (let key in lightObj) {
    map[key] && map[key](lightObj[key]);
  }

  if (params.isAddHdr && params.curHdr) {
    let texture = await rgbeLoader.loadAsync(params.curHdr);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    _scene.environment = texture;
  }

  if (params.curBg) {
    let texture = await textureLoader.loadAsync(params.curBg);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    _scene.background = texture;

  }

}

