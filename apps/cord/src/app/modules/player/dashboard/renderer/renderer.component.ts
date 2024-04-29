import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import {
  ActionManager,
  AnimationGroup,
  ArcRotateCamera,
  AssetContainer,
  Color3,
  Color4,
  Engine,
  ExecuteCodeAction,
  HemisphericLight,
  InstantiatedEntries,
  MeshBuilder,
  PBRMaterial,
  Scene,
  SceneLoader,
  SpotLight,
  StandardMaterial,
  TargetCamera,
  Texture,
  TransformNode,
  Vector3,
  Vector4,
  VertexBuffer
} from '@babylonjs/core';
import { BehaviorSubject, first, lastValueFrom } from 'rxjs';
import { RoundedBox } from './rounded-box';
import { createCssObject, createMaskingScreen, setupRenderer } from './css-renderer';
import '@babylonjs/loaders/glTF';
import { ID } from '../../../../api';

import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

@Component({
  selector: 'cord-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RendererComponent {
  private readonly noMusicSrc = '/assets/player.html';
  private readonly djPos = new Vector3(12, 1, -2.5);

  private _meUserId?: ID;
  private currentDJ: ID | null = null;
  private currentDJLastPos: Vector3 | null = null;

  private assets: { [key: string]: AssetContainer } = {};
  private players: { [id: ID]: Player } = {};

  // private shadowGenerator?: ShadowGenerator;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Output() engine!: Engine;
  @Output() scene!: Scene;
  @Output() camera!: TargetCamera;

  get me(): Player {
    return this.players[this._meUserId!];
  }

  get fps() {
    return this.engine?.getFps();
  }

  get amIDJ() {
    return this._meUserId === this.currentDJ;
  }

  // TODO: use Hard Landing animation when users spawn
  constructor(private appRef: ApplicationRef, private ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {
    this.appRef.isStable.pipe(first(x => x)).subscribe(async () => {
      this.engine = new Engine(this.canvas.nativeElement, true, {
        preserveDrawingBuffer: true,
        disableWebGL2Support: false,
        stencil: true
      });
      this.engine.enableOfflineSupport = false;

      // We need tick for showing FPS
      setInterval(() => this.changeDetectorRef.detectChanges(), 1000);

      this.scene = new Scene(this.engine);
      this.scene.clearColor = new Color4(0, 0, 0, 0);

      this.camera = this.createCamera(this.scene);
      this.camera.attachControl(this.canvas.nativeElement, true);

      this.createScene();

      // this.createFurniture('38' as ID, 'chair', 19, 14);
      // this.createFurniture('39' as ID, 'chair', 20, 13);
      // this.createFurniture('40' as ID, 'chair', 19, 12);

      this.ngZone.runOutsideAngular(() => {
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
      });

      window.addEventListener('resize', () => {
        this.engine.resize();
      });

      // this.scene.debugLayer.show({
      //   embedMode: true,
      //   handleResize: false,
      // });
    });

    console.log('Scene initialized successfully');
  }

  setMe(userId: ID) {
    if (this._meUserId) {
      throw new Error('Me ID is already assigned');
    }

    this._meUserId = userId;
  }

  playSong(youtubeId: string | null) {
    const elm = document.getElementById('youtube-video') as any;
    if (youtubeId) {
      elm.src = [
        'https://www.youtube.com/embed/',
        youtubeId,
        '?rel=0&enablejsapi=1&disablekb=1&autoplay=1&controls=0&fs=0&modestbranding=1&disablekb=1&fs=0'
      ].join('');
    } else {
      elm.src = this.noMusicSrc;
    }
  }

  private createCamera(scene: Scene) {
    const camera = new ArcRotateCamera(
      'camera',
      120 / (180 / Math.PI),
      60 / (180 / Math.PI),
      32,
      new Vector3(12, 0, 5),
      scene
    );

    camera.allowUpsideDown = false;
    camera.lowerAlphaLimit = -20 / (180 / Math.PI);
    camera.upperAlphaLimit = 200 / (180 / Math.PI);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI / 2.1;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 32;
    camera.angularSensibilityX = 4000;
    camera.angularSensibilityY = 4000;

    camera.setPosition(new Vector3(-5, 15, 18));

    camera.inputs.removeByType('ArcRotateCameraKeyboardMoveInput');
    // camera.inputs.add(new KeyboardPanningInput(new Matrix(), Vector3.Zero()));

    // camera.keysUp = [87];
    // camera.keysDown = [83];
    // camera.keysLeft = [65];
    // camera.keysRight = [68];
    camera.checkCollisions = true;

    return camera;
  }

  private createScene() {
    this.scene.clearColor = new Color4(0, 0, 0, 0);
    const light = new HemisphericLight('light', new Vector3(0.4, 1, -0.4), this.scene);
    light.intensity = 1;

    this.createYoutubeVideo();
    this.createGround();
    this.createStage();
    this.createGroundTiles(this.placement);
  }

  promoteDJ(userId: ID | null) {
    if (this.currentDJ) {
      const current = this.players[this.currentDJ];
      current.root.position = this.currentDJLastPos!;
      current.playAnimation('idle');
    }

    if (userId) {
      const newDj = this.players[userId];
      this.currentDJLastPos = newDj.root.position.clone();

      newDj.root.position = this.djPos.clone();
      newDj.root.rotation.y = 0;
      newDj.playAnimation('samba');
    }

    this.currentDJ = userId;
  }

  async createPlayer(id: ID, type: string, x: number, y: number) {
    console.log('creating player', id, x, y);
    if (id in this.players) {
      console.error('player already spawned', id);
      return;
    }

    await this.loadModel(type, 0.1);

    const instance = this.assets[type].instantiateModelsToScene(undefined, false, { doNotInstantiate: true });
    const player = instance.rootNodes[0];
    player.position.x = x;
    player.position.y = 0.05;
    player.position.z = y;
    // player.rotation.x = Math.PI;

    this.players[id] = new Player(instance);
    this.players[id].playAnimation('idle');
  }

  createFurniture(id: ID, type: string, x: number, y: number) {
    const furniture = this.scene.getMeshByName('furniture')!;
    const model = this.scene.getMeshByName(type)!;

    const item = model.clone(`furniture_${id}`, furniture)!;
    item.getChildMeshes(false).forEach(x => (x.isVisible = true));
    item.position.x = x;
    item.position.y = 0.05;
    item.position.z = y;
  }

  movePlayer(id: ID, x: number, y: number) {
    this.players[id]?.moveTo(x, null, y);
  }

  deletePlayer(id: ID) {
    const player = this.players[id];
    player.root.dispose();

    for (const animation of Object.values(player.animations)) {
      animation.dispose();
    }

    delete this.players[id];
  }

  private async loadModel(name: string, scale: number = 1) {
    if (name in this.assets) {
      return;
    }

    const asset = await SceneLoader.LoadAssetContainerAsync('/assets/models/', name + '.glb', this.scene);

    asset.meshes[0].scaling.scaleInPlace(scale);
    this.assets[name] = asset;
  }

  private createStage() {
    // DJ spotlight
    const spotLight = new SpotLight(
      'dj_spotlight',
      new Vector3(12, 5, 0),
      new Vector3(0, -1, -0.6),
      Math.PI,
      10,
      this.scene
    );
    spotLight.diffuse = Color3.White();

    // this.shadowGenerator = new ShadowGenerator(1024, spotLight);
    // this.shadowGenerator.useBlurExponentialShadowMap = true;
    // this.shadowGenerator.useKernelBlur = true;
    // this.shadowGenerator.blurKernel = 64;

    // Stage
    const stageMat = new StandardMaterial('tile_material', this.scene);
    stageMat.diffuseColor = Color3.FromHexString('#32383c');

    const stage = MeshBuilder.CreateBox(
      'stage',
      {
        width: 9,
        height: 1,
        depth: 4
      },
      this.scene
    );

    stage.position.x = 12;
    stage.position.y = 0.5;
    stage.position.z = -2.5;
    stage.material = stageMat;
    // stage.receiveShadows = true;

    // DJ Booth
    const booth = MeshBuilder.CreateBox(
      'booth',
      {
        width: 3,
        height: 1,
        depth: 1
      },
      this.scene
    );
    booth.position.x = 12;
    booth.position.y = 1.5;
    booth.position.z = -1.5;
    // booth.receiveShadows = true;

    // Speakers
    const faceUV = new Array(6);
    for (let i = 0; i < 6; i++) {
      faceUV[i] = new Vector4(0, 0, 0, 0);
    }
    faceUV[1] = new Vector4(0, 0, 1, 1);

    const speakerMat = new StandardMaterial('speaker_material', this.scene);
    speakerMat.diffuseTexture = new Texture('/assets/stage/speaker_texture.jpg', this.scene);

    const leftSpeaker = MeshBuilder.CreateBox(
      'left_speaker',
      {
        width: 2,
        depth: 2,
        height: 3,
        faceUV
      },
      this.scene
    );

    leftSpeaker.position.x = 19;
    leftSpeaker.position.y = 1.5;
    leftSpeaker.position.z = -2.5;
    leftSpeaker.rotation.y = 150 / (180 / Math.PI);
    leftSpeaker.material = speakerMat;

    const rightSpeaker = MeshBuilder.CreateBox(
      'right_speaker',
      {
        width: 2,
        depth: 2,
        height: 3,
        faceUV
      },
      this.scene
    );

    rightSpeaker.position.x = 5;
    rightSpeaker.position.y = 1.5;
    rightSpeaker.position.z = -2.5;
    rightSpeaker.rotation.y = 210 / (180 / Math.PI);
    rightSpeaker.material = speakerMat;

    // this.shadowGenerator.addShadowCaster(stage, true);
    // this.shadowGenerator.addShadowCaster(booth, true);
    // this.shadowGenerator.addShadowCaster(leftSpeaker, true);
    // this.shadowGenerator.addShadowCaster(rightSpeaker, true);
  }

  private createGroundTiles(placement: boolean[][]) {
    // const hl = new HighlightLayer('hl1', this.scene, {
    //   blurHorizontalSize: 50,
    //   blurVerticalSize: 50,
    //   mainTextureRatio: 5,
    //   alphaBlendingMode: Engine.ALPHA_ADD,
    //   isStroke: true
    // });

    const tiles = MeshBuilder.CreateBox('tiles', {}, this.scene);
    tiles.isVisible = false;

    const roundedBox = new RoundedBox(3, new Vector3(1, 0.1, 1), 0.05);
    const tile = roundedBox.toMesh('tile', this.scene);
    tile.isVisible = false;
    tile.parent = tiles;
    // tile.thinInstanceEnablePicking = true;

    const tileMat = new PBRMaterial('tile_material', this.scene);
    tileMat.roughness = 0.6;
    tile.material = tileMat;

    let instanceCount = 24 * 18;
    let colorData = new Float32Array(4 * instanceCount);

    for (let index = 0; index < instanceCount; index++) {
      const color = Color3.FromHexString('#16191c').scale(this.random(index * 1000)() * 0.5 + 0.5);
      colorData[index * 4] = color.r;
      colorData[index * 4 + 1] = color.g;
      colorData[index * 4 + 2] = color.b;
      colorData[index * 4 + 3] = 1.0;
    }

    const buffer = new VertexBuffer(this.engine, colorData, VertexBuffer.ColorKind, false, false, 4, true);
    tile.setVerticesBuffer(buffer);

    // 24 x 18
    for (let x = 0; x < 24; x++) {
      for (let z = 0; z < 18; z++) {
        if (!placement[z][x]) {
          continue;
        }

        const tileInstance = tile.createInstance(`tile_${x}_${z}`);
        tileInstance.parent = tiles;
        tileInstance.position.x = x;
        tileInstance.position.z = z;
        tileInstance.actionManager = new ActionManager(this.scene);

        tileInstance.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, ev => {
            if (!this.amIDJ) {
              this.scene.hoverCursor = 'pointer';
              // hl.addMesh(tileInstance, Color3.FromHexString('#0672a5'));
            }
          })
        );

        tileInstance.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, ev => {
            // hl.removeMesh(tile);
          })
        );

        tileInstance.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, ev => {
            if (!this.amIDJ) {
              this.me.moveTo(x, 0.05, z);
            }
          })
        );
      }
    }
  }

  private createGround() {
    const ground = MeshBuilder.CreateGround(
      'ground',
      {
        width: 200,
        height: 200
      },
      this.scene
    );

    const groundMaterial = new PBRMaterial('ground_material', this.scene);
    groundMaterial.roughness = 0.3;
    groundMaterial.albedoColor = Color3.FromHexString('#0A0A0A');

    ground.position.x = 12;
    ground.position.y = -0.05;
    ground.material = groundMaterial;
    // ground.receiveShadows = true;
  }

  private createYoutubeVideo() {
    // The CSS object will follow this mesh
    const plane = MeshBuilder.CreatePlane('youtube', { width: 1, height: 1 }, this.scene);
    plane.rotation = new Vector3(0, Math.PI, 0);
    plane.scaling.x = 6 * 1.5;
    plane.scaling.y = 4 * 1.5;
    plane.position.x = 12;
    plane.position.y = 4;
    plane.position.z = -4.5;

    // Setup the CSS renderer and Youtube object
    let existingRenderer = document.getElementById('css-container');
    if (existingRenderer) existingRenderer.remove();
    let renderer = setupRenderer(this.canvas.nativeElement);

    const obj = createCssObject(plane, this.scene, this.noMusicSrc, renderer);
    createMaskingScreen(this.engine, plane, this.scene);

    // Mouse interaction
    let focused = false;
    const listener = (evt: any) => {
      let pick = this.scene.pick(Math.round(evt.offsetX), Math.round(evt.offsetY));
      if (pick.hit) {
        if (pick.pickedMesh!.name === 'youtube') {
          if (!focused) {
            focused = true;
            console.log('YOUTUBE');
            document.getElementsByTagName('body')[0].style.pointerEvents = 'none';
          }
        }
      }
    };

    window.addEventListener('pointermove', listener);
    window.addEventListener('pointerdown', listener);
    window.addEventListener('pointerup', listener);

    obj.element.addEventListener('mouseout', () => {
      focused = false;
      console.log('CANVAS');
      document.getElementsByTagName('body')[0].style.pointerEvents = 'auto';
    });
  }

  private get placement(): boolean[][] {
    const lines = this._placement.trim().split('\n');
    return lines.map(x =>
      x
        .split(';')
        .map(x => x == '1')
        .reverse()
    );
  }

  private _placement = `
0;0;0;0;1;1;1;1;1;1;1;1;1;1;1;1;1;1;0;0;0;0;0;0
0;0;0;0;0;1;1;1;1;1;1;1;1;1;1;1;1;1;0;0;0;0;0;0
0;0;0;0;0;1;1;1;1;1;1;1;1;1;1;1;1;0;0;0;0;0;0;0
0;0;0;0;0;0;1;1;1;1;1;1;1;1;1;1;0;0;0;0;0;0;0;0
0;0;0;0;0;0;0;1;1;1;1;1;1;1;1;1;1;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;0;1;1;0;1;0;0;1;1;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;0;1;0;0;0;0;0;1;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;0;1;0;0;0;0;0;0;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;1;0;0;0;0;0;0;1;0;0;0;0;0;0;0
0;0;0;0;0;1;0;0;0;0;1;0;0;0;0;0;0;1;1;1;1;0;0;0
0;0;0;1;1;1;1;0;0;0;0;1;0;0;0;0;0;1;1;1;1;1;0;0
0;0;0;1;1;1;0;1;0;1;1;1;1;0;0;0;0;1;1;1;1;0;0;0
0;0;0;1;1;1;0;0;0;1;1;1;1;0;0;0;1;0;0;0;0;0;0;0
0;0;0;0;0;1;0;0;0;1;1;0;0;0;0;0;0;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;1;1;0;0;0;0;0;0;0;0;0;0;0;0;0
0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0
`;

  private random(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}

type AnimationDictionary = { [key: string]: AnimationGroup };

class Player {
  root: TransformNode;
  animations: AnimationDictionary;

  constructor(instance: InstantiatedEntries) {
    this.root = instance.rootNodes[0];
    this.animations = instance.animationGroups.reduce((obj, current) => {
      obj[current.name.replace('Clone of ', '')] = current;
      return obj;
    }, <AnimationDictionary>{});
  }

  playAnimation(name: string, loop = true) {
    for (const anim of Object.values(this.animations)) {
      anim.stop();
    }

    this.animations[name]?.play(loop);
  }

  moveTo(x: number, y: number | null, z: number) {
    if (y === null) {
      y = this.root.position.y;
    }

    this.root.position = new Vector3(x, y, z); // TODO: interpolate movement and play animation
  }
}
