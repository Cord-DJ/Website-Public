import { Camera, Engine, Matrix, Mesh, Scene, StandardMaterial } from '@babylonjs/core';

export class CSS3DObject extends Mesh {
  element: HTMLElement;

  constructor(name: string, element: HTMLElement, scene: Scene) {
    super(name, scene);
    this.element = element;
    this.element.style.position = 'absolute';
    this.element.style.pointerEvents = 'auto';
  }
}

export class CSS3DRenderer {
  private width!: any;
  private height!: any;
  private widthHalf!: any;
  private heightHalf!: any;
  private cache!: any;
  domElement!: any;
  private readonly cameraElement!: any;
  private readonly isIE!: any;

  constructor() {
    this.cache = {
      camera: { fov: 0, style: '' },
      objects: new WeakMap()
    };

    const domElement = document.createElement('div');
    domElement.style.overflow = 'hidden';

    this.domElement = domElement;
    this.cameraElement = document.createElement('div');
    this.isIE =
      !!(document as any)['documentMode'] || /Edge/.test(navigator.userAgent) || /Edg/.test(navigator.userAgent);

    if (!this.isIE) {
      this.cameraElement.style.webkitTransformStyle = 'preserve-3d';
      this.cameraElement.style.transformStyle = 'preserve-3d';
    }
    this.cameraElement.style.pointerEvents = 'none';

    domElement.appendChild(this.cameraElement);
  }

  getSize() {
    return {
      width: this.width,
      height: this.height
    };
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.widthHalf = this.width / 2;
    this.heightHalf = this.height / 2;

    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';

    this.cameraElement.style.width = width + 'px';
    this.cameraElement.style.height = height + 'px';
  }

  epsilon(value: number) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  getCameraCSSMatrix(matrix: Matrix) {
    const elements = matrix.m;

    return (
      'matrix3d(' +
      this.epsilon(elements[0]) +
      ',' +
      this.epsilon(-elements[1]) +
      ',' +
      this.epsilon(elements[2]) +
      ',' +
      this.epsilon(elements[3]) +
      ',' +
      this.epsilon(elements[4]) +
      ',' +
      this.epsilon(-elements[5]) +
      ',' +
      this.epsilon(elements[6]) +
      ',' +
      this.epsilon(elements[7]) +
      ',' +
      this.epsilon(elements[8]) +
      ',' +
      this.epsilon(-elements[9]) +
      ',' +
      this.epsilon(elements[10]) +
      ',' +
      this.epsilon(elements[11]) +
      ',' +
      this.epsilon(elements[12]) +
      ',' +
      this.epsilon(-elements[13]) +
      ',' +
      this.epsilon(elements[14]) +
      ',' +
      this.epsilon(elements[15]) +
      ')'
    );
  }

  getObjectCSSMatrix(matrix: Matrix, cameraCSSMatrix: any) {
    const elements = matrix.m;
    const matrix3d =
      'matrix3d(' +
      this.epsilon(elements[0]) +
      ',' +
      this.epsilon(elements[1]) +
      ',' +
      this.epsilon(elements[2]) +
      ',' +
      this.epsilon(elements[3]) +
      ',' +
      this.epsilon(-elements[4]) +
      ',' +
      this.epsilon(-elements[5]) +
      ',' +
      this.epsilon(-elements[6]) +
      ',' +
      this.epsilon(-elements[7]) +
      ',' +
      this.epsilon(elements[8]) +
      ',' +
      this.epsilon(elements[9]) +
      ',' +
      this.epsilon(elements[10]) +
      ',' +
      this.epsilon(elements[11]) +
      ',' +
      this.epsilon(elements[12]) +
      ',' +
      this.epsilon(elements[13]) +
      ',' +
      this.epsilon(elements[14]) +
      ',' +
      this.epsilon(elements[15]) +
      ')';

    if (this.isIE) {
      return (
        'translate(-50%,-50%)' +
        'translate(' +
        this.widthHalf +
        'px,' +
        this.heightHalf +
        'px)' +
        cameraCSSMatrix +
        matrix3d
      );
    }
    return 'translate(-50%,-50%)' + matrix3d;
  }

  renderObject(obj: any, scene: Scene, camera: any, cameraCSSMatrix: string) {
    if (obj instanceof CSS3DObject) {
      let objectMatrixWorld = obj.getWorldMatrix().clone();
      const camMatrix = camera.getWorldMatrix();
      const innerMatrix = objectMatrixWorld.m as any;

      // Set scaling
      const youtubeVideoWidth = 4.8;
      const youtubeVideoHeight = 3.6;

      innerMatrix[0] *= 0.01 / youtubeVideoWidth;
      innerMatrix[2] *= 0.01 / youtubeVideoWidth;
      innerMatrix[5] *= 0.01 / youtubeVideoHeight;
      innerMatrix[1] *= 0.01 / youtubeVideoWidth;
      innerMatrix[6] *= 0.01 / youtubeVideoHeight;
      innerMatrix[4] *= 0.01 / youtubeVideoHeight;

      // Set position from camera
      innerMatrix[12] = -camMatrix.m[12] + obj.position.x;
      innerMatrix[13] = -camMatrix.m[13] + obj.position.y;
      innerMatrix[14] = camMatrix.m[14] - obj.position.z;
      innerMatrix[15] = camMatrix.m[15] * 0.00001;

      objectMatrixWorld = Matrix.FromArray(innerMatrix);
      objectMatrixWorld = objectMatrixWorld.scale(100);
      const style = this.getObjectCSSMatrix(objectMatrixWorld, cameraCSSMatrix);
      const element = obj.element;
      const cachedObject = this.cache.objects.get(obj);

      if (cachedObject === undefined || cachedObject.style !== style) {
        element.style.webkitTransform = style;
        element.style.transform = style;

        const objectData = { style: style };
        this.cache.objects.set(obj, objectData);
      }

      if (element.parentNode !== this.cameraElement) {
        this.cameraElement.appendChild(element);
      }
    } else if (obj instanceof Scene) {
      for (let i = 0, l = obj.meshes.length; i < l; i++) {
        this.renderObject(obj.meshes[i], scene, camera, cameraCSSMatrix);
      }
    }
  }

  render(scene: Scene, camera: any) {
    const projectionMatrix = camera.getProjectionMatrix();
    const fov = projectionMatrix.m[5] * this.heightHalf;

    if (this.cache.camera.fov !== fov) {
      if (camera.mode == Camera.PERSPECTIVE_CAMERA) {
        this.domElement.style.webkitPerspective = fov + 'px';
        this.domElement.style.perspective = fov + 'px';
      } else {
        this.domElement.style.webkitPerspective = '';
        this.domElement.style.perspective = '';
      }
      this.cache.camera.fov = fov;
    }

    if (camera.parent === null) camera.computeWorldMatrix();

    let matrixWorld = camera.getWorldMatrix().clone();
    const rotation = matrixWorld.clone().getRotationMatrix().transpose();
    const innerMatrix = matrixWorld.m as any;

    innerMatrix[1] = rotation.m[1];
    innerMatrix[2] = -rotation.m[2];
    innerMatrix[4] = -rotation.m[4];
    innerMatrix[6] = -rotation.m[6];
    innerMatrix[8] = -rotation.m[8];
    innerMatrix[9] = -rotation.m[9];

    matrixWorld = Matrix.FromArray(innerMatrix);

    const cameraCSSMatrix = 'translateZ(' + fov + 'px)' + this.getCameraCSSMatrix(matrixWorld);
    const style = cameraCSSMatrix + 'translate(' + this.widthHalf + 'px,' + this.heightHalf + 'px)';

    if (this.cache.camera.style !== style && !this.isIE) {
      this.cameraElement.style.webkitTransform = style;
      this.cameraElement.style.transform = style;
      this.cache.camera.style = style;
    }

    this.renderObject(scene, scene, camera, cameraCSSMatrix);
  }
}

export function setupRenderer(canvas: HTMLElement) {
  const container = document.createElement('div');
  container.id = 'css-container';
  container.style.position = 'absolute';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '-1';

  const canvasParent = canvas.parentElement!;
  canvasParent.insertBefore(container, canvasParent.firstChild);

  let renderer = new CSS3DRenderer();
  container.appendChild(renderer.domElement);
  renderer.setSize(canvasParent.offsetWidth, canvasParent.offsetHeight);

  window.addEventListener('resize', e => {
    renderer.setSize(canvasParent.offsetWidth, canvasParent.offsetHeight);
  });

  return renderer;
}

export function createCssObject(plane: Mesh, scene: Scene, src: string, renderer: CSS3DRenderer): CSS3DObject {
  let width = 480;
  let height = 360;

  scene.onBeforeRenderObservable.add(() => {
    renderer.render(scene, scene.activeCamera);
  });

  const div = document.createElement('div');
  div.style.width = width + 'px';
  div.style.height = height + 'px';
  div.style.backgroundColor = '#00';
  div.style.zIndex = '1';

  const obj = new CSS3DObject('youtube_video', div, scene);
  refreshPosition(obj, plane);

  const iframe = document.createElement('iframe');
  iframe.id = 'youtube-video';
  iframe.style.width = width + 'px';
  iframe.style.height = height + 'px';
  iframe.style.border = '0px';
  iframe.allow = 'autoplay';
  iframe.src = src;

  div.appendChild(iframe);
  return obj;
}

function refreshPosition(obj: CSS3DObject, plane: Mesh) {
  obj.position.copyFrom(plane.getAbsolutePosition());
  obj.scaling.copyFrom(plane.scaling);

  refreshRotation(obj, plane);
}

function refreshRotation(obj: CSS3DObject, plane: Mesh) {
  obj.rotation.y = -plane.rotation.y;
  obj.rotation.x = -plane.rotation.x;
  obj.rotation.z = plane.rotation.z;
}

export function createMaskingScreen(engine: Engine, maskMesh: Mesh, scene: Scene) {
  let depthMask = new StandardMaterial('matDepthMask', scene);
  depthMask.backFaceCulling = false;

  maskMesh.material = depthMask;
  maskMesh.onBeforeRenderObservable.add(() => engine.setColorWrite(false));
  maskMesh.onAfterRenderObservable.add(() => engine.setColorWrite(true));

  // swap meshes to put mask first
  const mask_index = scene.meshes.indexOf(maskMesh);
  scene.meshes[mask_index] = scene.meshes[0];
  scene.meshes[0] = maskMesh;
}
