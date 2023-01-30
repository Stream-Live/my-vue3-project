/*
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2023-01-03 09:53:25
 * @FilePath: \my-vue3-project\vite.config.ts
 * @Description:
 *
 */
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import FileLoader from "file-loader";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.gltf"],
  preview: {
    port: 8082,
  },
  server: {
    port: 8082,
  },
});
