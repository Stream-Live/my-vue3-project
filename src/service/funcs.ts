
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; //rebe加载器
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { 
  CreateFloor, 
  CreatePath, 
  CreateRain,
  CreateSnow, 
  CreateAnimationPath,
  CreateFire,
  ToggleVirtualByEdgesGeometry,
  ToggleVirtualByWireframe,
  CreateFence,
  computeLabelPosition,
  CreateFlywire,
  getGradientColors,
  CreateWaterSpout,
  MeasureDistance
} from 'my-threejs-utils'
import gsap from 'gsap'

export default class Floor {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias:true,
      alpha:true,
    });
    (document.getElementById("canvas3") as HTMLElement).appendChild(
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

    
    this.renderer.setClearColor(0x1f527b);
    let pos: any = {
      "x": 10.316800775711574,
      "y": 165.8424152749338,
      "z": 77.34038655849398
    };
    this.camera.position.copy(pos);

    this.controls.update();

    let light = new THREE.AmbientLight()
    this.scene.add(light)
    Object.assign(window, {
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      THREE,
    });

    this.addFloor();
    this.addPath();

    this.addRain();

    this.addSnow();

    this.addAnimationPath();

    this.addFire();

    this.addVirtual();

    this.addFence();

    this.addLabelMove();

    this.addFlywire();

    this.addGradientColors();

    this.addWaterspout();

    this.addMeasureDistance();
  }

  // 添加测距
  addMeasureDistance(){

    let obj = MeasureDistance({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      controls: this.controls
    })
    Object.assign(window, obj);
  }

  // 添加水柱
  addWaterspout(){

    let obj = CreateWaterSpout({
      length: 10
    });
    this.scene.add(obj.group);
    obj.group.position.set(50, 10, 10);
    obj.start();
  }

  // 颜色的线性插值
  addGradientColors(){

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(5,5,5),
      new THREE.MeshBasicMaterial({color: new THREE.Color("#A4958E")})
    );
    box.position.set(0,10,40)
    this.scene.add(box)
    console.log(box);
    
    
    let c1 = "#A4958E";
    let c2 = "#111D3E";
    let array = getGradientColors(c1, c2, 100, 1);

    let param = {
      delta: 0,
    };
    gsap.to(param, {
      delta: 99,
      duration: 3,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        let i = Math.floor(param.delta);

        let color = array[i];

        box.material.color = new THREE.Color(color);
      },
    });
  }

  // 添加飞线
  addFlywire(){

    let start = new THREE.Vector3(0,0,20),
      end = new THREE.Vector3(50,0,20),
      pointY = 0,
      height = start.distanceTo(end) / 5;
  
    let points = [
      {x: start.x, y: pointY, z: start.z},
      // 三等分点
      {x: (end.x + 2 * start.x) / 3, y: pointY + height, z: (end.z + 2 * start.z) / 3},
      {x: (2 * end.x + start.x) / 3, y: pointY + height, z: (2 * end.z + start.z) / 3},
      // 二等分点
      // {x: (start.x + end.x) / 2, y: pointY + height, z: (start.z + end.z) / 2},
      {x: end.x, y: pointY, z: end.z},
    ];

    
    let obj = CreateFlywire({
      points,
      pointSize: 5,
    })
    this.scene.add(obj.points);
    obj.start();
  }

  // 标签撞墙自动移位
  async addLabelMove(){

    let labelList: Array<THREE.Mesh> = [];
    let arr: Array<{
      x: number;
      z: number;
  }> = [
      {
          "x": -17.62045742362567,
          "y": 1.075973251016518,
          "z": 10.70480163622573
      },
      {
          "x": -3.648432147527245,
          "y": 1.5276634655257375,
          "z": 11.827813436911196
      },
      {
          "x": -3.99908322880953,
          "y": -0.008040309520126243,
          "z": 21.72847551769293
      },
      {
          "x": -19.19449551647139,
          "y": 1.1732584189665811,
          "z": 20.63120768584246
      },
      {
          "x": -30.085969706099075,
          "y": 1.0481385691830123,
          "z": 15.115426629775229
      }
  ]
    {
      const addLabel = async (position: {x: number, y: number, z: number}) => {
        let baseWidth = 1;
  
        // 添加一个标签
        let texture = await new THREE.TextureLoader().loadAsync(
          "/fanControllerLabel.png"
        );
        let accept = texture.image.height / texture.image.width;
        let labelPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(baseWidth, baseWidth * accept),
          new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
          })
        );
        this.scene.add(labelPlane);
        labelPlane.position.set(position.x, position.y, position.z);
        
        labelList.push(labelPlane);
      }
      await addLabel({
        "x": -3.9,
        "y": 1.075973251016518,
        "z": 15.00480163622573
      });
      await addLabel({
        "x": -25,
        "y": 1.075973251016518,
        "z": 17.500480163622573
      });
      let shape = new THREE.Shape(arr.map(item => new THREE.Vector2(item.x, item.z)));
      let plane = new THREE.Mesh(
        new THREE.ShapeGeometry(shape),
        new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
      );
      plane.position.y = 0.5;
      plane.rotateX(Math.PI * 0.5);
      this.scene.add(plane);

    }
    
    computeLabelPosition([arr], labelList, 0);
  }

  // 添加电子围栏
  addFence(){

    {
      const box = new THREE.BoxGeometry(1, 1, 1);
      const boxMesh = new THREE.Mesh(box, new THREE.MeshLambertMaterial({ color: 0x0000ff }));
      this.scene.add(boxMesh);
  
      boxMesh.position.set(-10, 5,6);
      boxMesh.name = 'boxMesh'
  
      gsap.to(boxMesh.position, {
        z: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        onUpdate: () => {},
      });
    }

    let obj = CreateFence({
      points: [
        {
            "x": -19.255762559593016,
            "y": 0.44044665523113835,
            "z": -2.939368220871339
        },
        {
            "x": -9.328158500789783,
            "y": 1.7590965619982952,
            "z": -0.6006828974815637
        },
        {
            "x": -3.396329635531087,
            "y": 1.6971823003816575,
            "z": 7.707832948075074
        }
    ],
      height: 10,
      meshNameList: ['boxMesh'],
      scene: this.scene,
      warnCallback: (mesh: THREE.Object3D) => {
        console.log(mesh.name, '穿墙了');
      }
    });
    this.scene.add(obj.mesh)
    obj.start();
  }

  // 添加虚化
  async addVirtual(){
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");

    loader.setDRACOLoader(dracoLoader);

    // 添加保安室
    {
      let gltf = await loader.loadAsync(
        (
          await import("@/service/assets/models/shaxi-main.glb")
        ).default
      );
      let obj = gltf.scene.getObjectByName('保安室') as THREE.Object3D;
      obj.position.set(10, 10, 10)
      this.scene.add(obj);
    }
    
    // edge虚化  用于非树
    ToggleVirtualByEdgesGeometry('保安室', this.scene)
    
    // 添加树
    {
      let tree_gltf = await loader.loadAsync(
        (
          await import("@/service/assets/models/shaxi-tree.glb")
        ).default
      );
      let tree = new THREE.Group();
      let tree_obj = tree_gltf.scene.getObjectByName('树')?.children[0] as THREE.Object3D
      tree_obj.position.set(30, 10, 0)
      tree.name = 'shu';
      tree.add(tree_obj)
      this.scene.add(tree);

    }

    // wireframe虚化  用于树
    ToggleVirtualByWireframe('shu', this.scene)

    Object.assign(window, {ToggleVirtualByEdgesGeometry, ToggleVirtualByWireframe})
  }

  // 添加火
  addFire(){
    let obj = CreateFire({camera: this.camera, });
    this.scene.add(obj.points)
    obj.start();
  }

  // 添加贴图道路
  addPath(){
    let points = [
      {
        x: 7.602154318249855,
        y: 7.921453849076141,
        z: 6.721410476616342,
      },
      {
        x: 10.148048025924078,
        y: 9.80519616030863,
        z: -3.687171295945351,
      },
      {
        x: 17.196987884977865,
        y: 10.367155161070908,
        z: -1.7331112243968336,
      },
      {
        x: 21.676960221577954,
        y: 6.7777302427081665,
        z: 2.761755486019113,
      },
      {
        x: 17.576459920642765,
        y: 8.061689769635127,
        z: 8.265982854571803,
      },
    ];

    let obj = CreatePath({
      points, 
      imgUrl:"/021-箭头.png",
      radius: 0.5,
      divisions: 200,
      isClosed: false,
      speed: 1
    });
    this.scene.add(obj.path);
    obj.start();
  }

  // 添加地板
  addFloor(){

    // 第一层(网格)
    let obj1 = CreateFloor({
      imgUrl: '/images/1.png',
    });
    
    this.scene.add(obj1.mesh);
    obj1.start();

    // 第二层
    let obj2 = CreateFloor({
      imgUrl: '/images/2.png',
      imgHighColor: '#00ffff',
      initOpacity: 0.2,
      moreLight: 3,
    });
    obj2.mesh.position.y -= 0.5;
    this.scene.add(obj2.mesh);
    obj2.start();

    // 第三层
    let obj3 = CreateFloor({
      imgUrl: '/images/3.png',
      imgHighColor: '#ffffff',
      initOpacity: 0,
      moreLight: 3,
    });
    obj3.mesh.position.y -= 1;
    this.scene.add(obj3.mesh);
    obj3.start();
  }

  // 添加下雨
  addRain(){

    let obj = CreateRain({
      width: 100,
      height: 100,
      depth: 100,
      maxSpeed: 0.3,
      minSpeed: 0.05,
      opacity: 0.5
    })
    this.scene.add(obj.group);
    obj.start();

    obj.group.position.set(-100, 100, 0);
  }
  // 添加下雪
  addSnow(){

    let obj = CreateSnow()
    this.scene.add(obj.points);
    obj.start();

    obj.points.position.set(100, 100, 0);
  }

  // 添加运动路径
  addAnimationPath(){
    const box = new THREE.BoxGeometry(1, 1, 1);
    const boxMesh = new THREE.Mesh(box, [
      new THREE.MeshLambertMaterial({ color: 0x0000ff }),
      new THREE.MeshLambertMaterial({ color: 0xff00ff }),
      new THREE.MeshLambertMaterial({ color: 0xddffff }),
      new THREE.MeshLambertMaterial({ color: 0xddeeff }),
      new THREE.MeshLambertMaterial({ color: 0x00fdff }),
      new THREE.MeshLambertMaterial({ color: 0xcc00ff }),
    ]);
    this.scene.add(boxMesh);

    let points = [
      {
        x: 7.602154318249855,
        y: 7.921453849076141,
        z: 6.721410476616342,
      },
      {
        x: 10.148048025924078,
        y: 9.80519616030863,
        z: -3.687171295945351,
      },
      {
        x: 17.196987884977865,
        y: 10.367155161070908,
        z: -1.7331112243968336,
      },
      {
        x: 21.676960221577954,
        y: 6.7777302427081665,
        z: 2.761755486019113,
      },
      {
        x: 17.576459920642765,
        y: 8.061689769635127,
        z: 8.265982854571803,
      },
    ];
    points.forEach(item => item.y += 0.5)
    let animation = CreateAnimationPath({
      points,
      mesh: boxMesh,
      isClosed: true,
      isRepeat: true,
      speed: 0.3,
    })
    animation.start();

    this.scene.add(animation.line);
  }



  render() {
    requestAnimationFrame(this.render.bind(this));

    this.renderer.render(this.scene, this.camera);

    this.controls.update();
  }

}