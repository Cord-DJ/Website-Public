import { ArcRotateCameraKeyboardMoveInput, Matrix, Vector3 } from '@babylonjs/core';

export class KeyboardPanningInput extends ArcRotateCameraKeyboardMoveInput {
  constructor(matrix: Matrix, vector: Vector3) {
    super();

    const self: any = this;
    self.matrix = matrix;
    self.displacement = vector;
  }

  override checkInputs() {
    const self: any = this;
    if (self._onKeyboardObserver) {
      const camera = self.camera;
      const m = self.matrix;

      this.camera.absoluteRotation.toRotationMatrix(m);

      for (let index = 0; index < self._keys.length; index++) {
        const keyCode = self._keys[index];

        if (this.keysReset.indexOf(keyCode) !== -1) {
          if (camera.useInputToRestoreState) {
            camera.restoreState();
            continue;
          }
        }
        //Matrix magic see https://www.3dgep.com/understanding-the-view-matrix/ and
        //   https://forum.babylonjs.com/t/arc-rotate-camera-panning-on-button-click/15428/6
        else if (this.keysLeft.indexOf(keyCode) !== -1) {
          self.displacement.set(-m.m[0], -m.m[1], -m.m[2]);
        } else if (this.keysUp.indexOf(keyCode) !== -1) {
          self.displacement.set(m.m[8], 0, m.m[10]);
        } else if (this.keysRight.indexOf(keyCode) !== -1) {
          self.displacement.set(m.m[0], m.m[1], m.m[2]);
        } else if (this.keysDown.indexOf(keyCode) !== -1) {
          self.displacement.set(-m.m[8], 0, -m.m[10]);
        }

        this.camera.target.addInPlace(self.displacement);
        this.camera.position.addInPlace(self.displacement);
        self.displacement.setAll(0);
      }
    }
  }
}
