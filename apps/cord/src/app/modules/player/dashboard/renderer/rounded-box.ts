import { Mesh, Scene, Vector3, VertexData } from '@babylonjs/core';

export class RoundedBox {
  private m_nEdge: any;
  private m_index_to_verts: any;
  private m_radius: any;

  vertices!: any[];
  indices!: any[];

  constructor(N: number, dimension: Vector3, radius: number) {
    this.vertices = []; // std::vector<Vector3d>
    // this.normals = []; // std::vector<Vector3d>
    this.indices = []; // std::vector<Vector3i>

    let b = dimension.divide(new Vector3(2, 2, 2)).add(new Vector3(-radius, -radius, -radius));

    let nEdge = 2 * (N + 1);
    this.m_nEdge = nEdge;
    this.m_index_to_verts = Array(nEdge * nEdge * nEdge).fill(-1);
    this.m_radius = radius;
    let dx = radius / N;

    let sign = [-1.0, 1.0];
    let ks = [0, N * 2 + 1];

    // xy-planes
    for (let kidx = 0; kidx < 2; ++kidx) {
      let k = ks[kidx];
      let origin = new Vector3(-b.x - radius, -b.y - radius, (b.z + radius) * sign[kidx]);
      for (let j = 0; j <= N; ++j) {
        for (let i = 0; i <= N; ++i) {
          let pos = origin.add(new Vector3(dx * i, dx * j, 0.0));
          this.addVertex(i, j, k, pos, new Vector3(-b.x, -b.y, b.z * sign[kidx]));

          pos = origin.add(new Vector3(dx * i + 2.0 * b.x + radius, dx * j, 0.0));
          this.addVertex(i + N + 1, j, k, pos, new Vector3(b.x, -b.y, b.z * sign[kidx]));

          pos = origin.add(new Vector3(dx * i + 2.0 * b.x + radius, dx * j + 2.0 * b.y + radius, 0.0));
          this.addVertex(i + N + 1, j + N + 1, k, pos, new Vector3(b.x, b.y, b.z * sign[kidx]));

          pos = origin.add(new Vector3(dx * i, dx * j + 2.0 * b.y + radius, 0.0));
          this.addVertex(i, j + N + 1, k, pos, new Vector3(-b.x, b.y, b.z * sign[kidx]));
        }
      }
      // corners
      for (let j = 0; j < N; ++j) {
        for (let i = 0; i < N; ++i) {
          this.addFace(
            this.translateIndices(i, j, k),
            this.translateIndices(i + 1, j + 1, k),
            this.translateIndices(i, j + 1, k),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(i, j, k),
            this.translateIndices(i + 1, j, k),
            this.translateIndices(i + 1, j + 1, k),
            kidx === 0
          );

          this.addFace(
            this.translateIndices(i, j + N + 1, k),
            this.translateIndices(i + 1, j + N + 2, k),
            this.translateIndices(i, j + N + 2, k),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(i, j + N + 1, k),
            this.translateIndices(i + 1, j + N + 1, k),
            this.translateIndices(i + 1, j + N + 2, k),
            kidx === 0
          );

          this.addFace(
            this.translateIndices(i + N + 1, j + N + 1, k),
            this.translateIndices(i + N + 2, j + N + 2, k),
            this.translateIndices(i + N + 1, j + N + 2, k),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(i + N + 1, j + N + 1, k),
            this.translateIndices(i + N + 2, j + N + 1, k),
            this.translateIndices(i + N + 2, j + N + 2, k),
            kidx === 0
          );

          this.addFace(
            this.translateIndices(i + N + 1, j, k),
            this.translateIndices(i + N + 2, j + 1, k),
            this.translateIndices(i + N + 1, j + 1, k),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(i + N + 1, j, k),
            this.translateIndices(i + N + 2, j, k),
            this.translateIndices(i + N + 2, j + 1, k),
            kidx === 0
          );
        }
      }
      // sides
      for (let i = 0; i < N; ++i) {
        this.addFace(
          this.translateIndices(i, N, k),
          this.translateIndices(i + 1, N + 1, k),
          this.translateIndices(i, N + 1, k),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(i, N, k),
          this.translateIndices(i + 1, N, k),
          this.translateIndices(i + 1, N + 1, k),
          kidx === 0
        );

        this.addFace(
          this.translateIndices(N, i, k),
          this.translateIndices(N + 1, i + 1, k),
          this.translateIndices(N, i + 1, k),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(N, i, k),
          this.translateIndices(N + 1, i, k),
          this.translateIndices(N + 1, i + 1, k),
          kidx === 0
        );

        this.addFace(
          this.translateIndices(i + N + 1, N, k),
          this.translateIndices(i + N + 2, N + 1, k),
          this.translateIndices(i + N + 1, N + 1, k),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(i + N + 1, N, k),
          this.translateIndices(i + N + 2, N, k),
          this.translateIndices(i + N + 2, N + 1, k),
          kidx === 0
        );

        this.addFace(
          this.translateIndices(N, i + N + 1, k),
          this.translateIndices(N + 1, i + N + 2, k),
          this.translateIndices(N, i + N + 2, k),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(N, i + N + 1, k),
          this.translateIndices(N + 1, i + N + 1, k),
          this.translateIndices(N + 1, i + N + 2, k),
          kidx === 0
        );
      }
      // central
      this.addFace(
        this.translateIndices(N, N, k),
        this.translateIndices(N + 1, N + 1, k),
        this.translateIndices(N, N + 1, k),
        kidx === 0
      );
      this.addFace(
        this.translateIndices(N, N, k),
        this.translateIndices(N + 1, N, k),
        this.translateIndices(N + 1, N + 1, k),
        kidx === 0
      );
    }

    // xz-planes
    for (let kidx = 0; kidx < 2; ++kidx) {
      let k = ks[kidx];
      let origin = new Vector3(-b.x - radius, (b.y + radius) * sign[kidx], -b.z - radius);
      for (let j = 0; j <= N; ++j) {
        for (let i = 0; i <= N; ++i) {
          let pos = origin.add(new Vector3(dx * i, 0.0, dx * j));
          this.addVertex(i, k, j, pos, new Vector3(-b.x, b.y * sign[kidx], -b.z));

          pos = origin.add(new Vector3(dx * i + 2.0 * b.x + radius, 0.0, dx * j));
          this.addVertex(i + N + 1, k, j, pos, new Vector3(b.x, b.y * sign[kidx], -b.z));

          pos = origin.add(new Vector3(dx * i + 2.0 * b.x + radius, 0.0, dx * j + 2.0 * b.z + radius));
          this.addVertex(i + N + 1, k, j + N + 1, pos, new Vector3(b.x, b.y * sign[kidx], b.z));

          pos = origin.add(new Vector3(dx * i, 0.0, dx * j + 2.0 * b.z + radius));
          this.addVertex(i, k, j + N + 1, pos, new Vector3(-b.x, b.y * sign[kidx], b.z));
        }
      }
      // corners
      for (let j = 0; j < N; ++j) {
        for (let i = 0; i < N; ++i) {
          this.addFace(
            this.translateIndices(i, k, j),
            this.translateIndices(i + 1, k, j + 1),
            this.translateIndices(i, k, j + 1),
            kidx === 1
          );
          this.addFace(
            this.translateIndices(i, k, j),
            this.translateIndices(i + 1, k, j),
            this.translateIndices(i + 1, k, j + 1),
            kidx === 1
          );

          this.addFace(
            this.translateIndices(i, k, j + N + 1),
            this.translateIndices(i + 1, k, j + N + 2),
            this.translateIndices(i, k, j + N + 2),
            kidx === 1
          );
          this.addFace(
            this.translateIndices(i, k, j + N + 1),
            this.translateIndices(i + 1, k, j + N + 1),
            this.translateIndices(i + 1, k, j + N + 2),
            kidx === 1
          );

          this.addFace(
            this.translateIndices(i + N + 1, k, j + N + 1),
            this.translateIndices(i + N + 2, k, j + N + 2),
            this.translateIndices(i + N + 1, k, j + N + 2),
            kidx === 1
          );
          this.addFace(
            this.translateIndices(i + N + 1, k, j + N + 1),
            this.translateIndices(i + N + 2, k, j + N + 1),
            this.translateIndices(i + N + 2, k, j + N + 2),
            kidx === 1
          );

          this.addFace(
            this.translateIndices(i + N + 1, k, j),
            this.translateIndices(i + N + 2, k, j + 1),
            this.translateIndices(i + N + 1, k, j + 1),
            kidx === 1
          );
          this.addFace(
            this.translateIndices(i + N + 1, k, j),
            this.translateIndices(i + N + 2, k, j),
            this.translateIndices(i + N + 2, k, j + 1),
            kidx === 1
          );
        }
      }
      // sides
      for (let i = 0; i < N; ++i) {
        this.addFace(
          this.translateIndices(i, k, N),
          this.translateIndices(i + 1, k, N + 1),
          this.translateIndices(i, k, N + 1),
          kidx === 1
        );
        this.addFace(
          this.translateIndices(i, k, N),
          this.translateIndices(i + 1, k, N),
          this.translateIndices(i + 1, k, N + 1),
          kidx === 1
        );

        this.addFace(
          this.translateIndices(N, k, i),
          this.translateIndices(N + 1, k, i + 1),
          this.translateIndices(N, k, i + 1),
          kidx === 1
        );
        this.addFace(
          this.translateIndices(N, k, i),
          this.translateIndices(N + 1, k, i),
          this.translateIndices(N + 1, k, i + 1),
          kidx === 1
        );

        this.addFace(
          this.translateIndices(i + N + 1, k, N),
          this.translateIndices(i + N + 2, k, N + 1),
          this.translateIndices(i + N + 1, k, N + 1),
          kidx === 1
        );
        this.addFace(
          this.translateIndices(i + N + 1, k, N),
          this.translateIndices(i + N + 2, k, N),
          this.translateIndices(i + N + 2, k, N + 1),
          kidx === 1
        );

        this.addFace(
          this.translateIndices(N, k, i + N + 1),
          this.translateIndices(N + 1, k, i + N + 2),
          this.translateIndices(N, k, i + N + 2),
          kidx === 1
        );
        this.addFace(
          this.translateIndices(N, k, i + N + 1),
          this.translateIndices(N + 1, k, i + N + 1),
          this.translateIndices(N + 1, k, i + N + 2),
          kidx === 1
        );
      }
      // central
      this.addFace(
        this.translateIndices(N, k, N),
        this.translateIndices(N + 1, k, N + 1),
        this.translateIndices(N, k, N + 1),
        kidx === 1
      );
      this.addFace(
        this.translateIndices(N, k, N),
        this.translateIndices(N + 1, k, N),
        this.translateIndices(N + 1, k, N + 1),
        kidx === 1
      );
    }

    // yz-planes
    for (let kidx = 0; kidx < 2; ++kidx) {
      let k = ks[kidx];
      let origin = new Vector3((b.x + radius) * sign[kidx], -b.y - radius, -b.z - radius);
      for (let j = 0; j <= N; ++j) {
        for (let i = 0; i <= N; ++i) {
          let pos = origin.add(new Vector3(0.0, dx * i, dx * j));
          this.addVertex(k, i, j, pos, new Vector3(b.x * sign[kidx], -b.y, -b.z));

          pos = origin.add(new Vector3(0.0, dx * i + 2.0 * b.y + radius, dx * j));
          this.addVertex(k, i + N + 1, j, pos, new Vector3(b.x * sign[kidx], b.y, -b.z));

          pos = origin.add(new Vector3(0.0, dx * i + 2.0 * b.y + radius, dx * j + 2.0 * b.z + radius));
          this.addVertex(k, i + N + 1, j + N + 1, pos, new Vector3(b.x * sign[kidx], b.y, b.z));

          pos = origin.add(new Vector3(0.0, dx * i, dx * j + 2.0 * b.z + radius));
          this.addVertex(k, i, j + N + 1, pos, new Vector3(b.x * sign[kidx], -b.y, b.z));
        }
      }
      // corners
      for (let j = 0; j < N; ++j) {
        for (let i = 0; i < N; ++i) {
          this.addFace(
            this.translateIndices(k, i, j),
            this.translateIndices(k, i + 1, j + 1),
            this.translateIndices(k, i, j + 1),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(k, i, j),
            this.translateIndices(k, i + 1, j),
            this.translateIndices(k, i + 1, j + 1),
            kidx === 0
          );

          this.addFace(
            this.translateIndices(k, i, j + N + 1),
            this.translateIndices(k, i + 1, j + N + 2),
            this.translateIndices(k, i, j + N + 2),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(k, i, j + N + 1),
            this.translateIndices(k, i + 1, j + N + 1),
            this.translateIndices(k, i + 1, j + N + 2),
            kidx === 0
          );

          this.addFace(
            this.translateIndices(k, i + N + 1, j + N + 1),
            this.translateIndices(k, i + N + 2, j + N + 2),
            this.translateIndices(k, i + N + 1, j + N + 2),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(k, i + N + 1, j + N + 1),
            this.translateIndices(k, i + N + 2, j + N + 1),
            this.translateIndices(k, i + N + 2, j + N + 2),
            kidx === 0
          );

          this.addFace(
            this.translateIndices(k, i + N + 1, j),
            this.translateIndices(k, i + N + 2, j + 1),
            this.translateIndices(k, i + N + 1, j + 1),
            kidx === 0
          );
          this.addFace(
            this.translateIndices(k, i + N + 1, j),
            this.translateIndices(k, i + N + 2, j),
            this.translateIndices(k, i + N + 2, j + 1),
            kidx === 0
          );
        }
      }
      // sides
      for (let i = 0; i < N; ++i) {
        this.addFace(
          this.translateIndices(k, i, N),
          this.translateIndices(k, i + 1, N + 1),
          this.translateIndices(k, i, N + 1),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(k, i, N),
          this.translateIndices(k, i + 1, N),
          this.translateIndices(k, i + 1, N + 1),
          kidx === 0
        );

        this.addFace(
          this.translateIndices(k, N, i),
          this.translateIndices(k, N + 1, i + 1),
          this.translateIndices(k, N, i + 1),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(k, N, i),
          this.translateIndices(k, N + 1, i),
          this.translateIndices(k, N + 1, i + 1),
          kidx === 0
        );

        this.addFace(
          this.translateIndices(k, i + N + 1, N),
          this.translateIndices(k, i + N + 2, N + 1),
          this.translateIndices(k, i + N + 1, N + 1),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(k, i + N + 1, N),
          this.translateIndices(k, i + N + 2, N),
          this.translateIndices(k, i + N + 2, N + 1),
          kidx === 0
        );

        this.addFace(
          this.translateIndices(k, N, i + N + 1),
          this.translateIndices(k, N + 1, i + N + 2),
          this.translateIndices(k, N, i + N + 2),
          kidx === 0
        );
        this.addFace(
          this.translateIndices(k, N, i + N + 1),
          this.translateIndices(k, N + 1, i + N + 1),
          this.translateIndices(k, N + 1, i + N + 2),
          kidx === 0
        );
      }
      // central
      this.addFace(
        this.translateIndices(k, N, N),
        this.translateIndices(k, N + 1, N + 1),
        this.translateIndices(k, N, N + 1),
        kidx === 0
      );
      this.addFace(
        this.translateIndices(k, N, N),
        this.translateIndices(k, N + 1, N),
        this.translateIndices(k, N + 1, N + 1),
        kidx === 0
      );
    }
  }

  addVertex(i: number, j: number, k: number, pos: any, basePos: any) {
    let pidx = k * this.m_nEdge * this.m_nEdge + j * this.m_nEdge + i;
    if (this.m_index_to_verts[pidx] < 0) {
      this.m_index_to_verts[pidx] = this.vertices.length;

      let dir = pos.subtract(basePos);
      if (dir.length() > 0.0) {
        dir.normalize();
        this.vertices.push(basePos.add(dir.multiplyByFloats(this.m_radius, this.m_radius, this.m_radius)));
        // this.normals.push(dir);
      } else this.vertices.push(pos);
      // this.normals.push(pos.normalized());
    }
  }

  translateIndices(i: number, j: number, k: number) {
    let pidx = k * this.m_nEdge * this.m_nEdge + j * this.m_nEdge + i;
    return this.m_index_to_verts[pidx];
  }

  addFace(i: number, j: number, k: number, inversed: boolean) {
    if (inversed) this.indices.push(new Vector3(i, k, j));
    else this.indices.push(new Vector3(i, j, k));
  }

  toMesh(name: string, scene: Scene) {
    let mesh = new Mesh(name, scene);
    let vertexData: any = new VertexData();

    vertexData.positions = [];
    this.vertices.forEach(vertex => {
      vertexData.positions.push(vertex.x, vertex.y, vertex.z);
    });
    vertexData.indices = [];
    this.indices.forEach(indice => {
      vertexData.indices.push(indice.x, indice.z, indice.y);
    });

    // box.normals.forEach((normal) => {
    //   vertexData.normals.push(normal.x, normal.z, normal.y);
    // });

    vertexData.applyToMesh(mesh);
    mesh.createNormals(false);
    return mesh;
  }
}
