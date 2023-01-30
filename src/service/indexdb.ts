/*
 * @Author: Wjh
 * @Date: 2022-12-22 13:33:34
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-22 14:59:18
 * @FilePath: \my-vue3-project\src\service\indexdb.ts
 * @Description:
 *
 */

export default class IndexDB {
  private static instance: IndexDB;

  private DATABASE = "ThreejsDatabase";

  public static getInstaance() {
    if (!IndexDB.instance) {
      IndexDB.instance = new IndexDB();
    }
    return IndexDB.instance;
  }

  constructor() {
    let indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    if (!indexedDB) {
      console.log("浏览器不支持indexedDB");
    }
    // 打开我们的数据库,使用open方法
    let request = indexedDB.open(this.DATABASE);
    // 错误处理，onerror函数
    request.onerror = function (event) {
      console.log("error", event);
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      // 为该数据库创建一个对象仓库，创建一个名为“userInfo”的仓库，并指定id作为键路径(keyPath)
      var objectStore = db.createObjectStore("threejs", { keyPath: "id" });
      // 不使用 unique 索引
      objectStore.createIndex("model", "model", { unique: false });
      // 建立一个索引，我们向确保name不会重复，所以我们使用 unique 索引
      objectStore.createIndex("name", "name", { unique: true });
    };
  }

  addModel(id: number, name: string, model: any) {
    let indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    // 打开我们的数据库,使用open方法
    let request = indexedDB.open(this.DATABASE);

    request.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction(["threejs"], "readwrite");
      let objectStore = transaction.objectStore("threejs");
      objectStore.add({
        id,
        name,
        model,
      });
      console.log("添加成功", {
        id,
        name,
        model,
      });
    };
  }

  getModel(_name: string) {
    return new Promise((resolve) => {
      let indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
      // 打开我们的数据库,使用open方法
      let request = indexedDB.open(this.DATABASE);
      request.onsuccess = function (event) {
        let db = event.target.result;
        var transaction = db.transaction(["threejs"]);
        var objectStore = transaction.objectStore("threejs");
        let men1 = objectStore.index("name");
        // 查找_name的模型
        men1.get(_name).onsuccess = function (e) {
          var data = e.target.result;
          resolve(data);
        };
      };
    });
  }
}
