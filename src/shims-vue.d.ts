/*
 * @Author: Zunk Yang
 * @Date: 2022-10-13 14:48:49
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-29 14:40:03
 * @Description: file content
 * @FilePath: \my-vue3-project\src\shims-vue.d.ts
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg'
{
  const content:string;
  export default content;
}


declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.hdr'
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";
declare module "*.gltf";
declare module "*.glb";