import * as THREE from 'three';

export class RippleRenderer {
	private _scene: THREE.Scene
	private _target: THREE.WebGLRenderTarget
	private _camera: THREE.OrthographicCamera
	private _meshs: THREE.Mesh[] = []
	/** maximum # of ripples drawn */
	private _max = 100
	/**  How much the mouse should move in one frame before drawing  */
	private _frequency = 3
	/** mouse coordinates */
	private _mouse = new THREE.Vector2(0, 0)
	/** mouse coordinates in previous frame */
	private _prevMouse = new THREE.Vector2(0, 0)
	/** index of ripples drawn on the current frame */
	private _currentWave = 3

	/**
	 * コンストラクタ
	 * @param _texture 波紋のテクスチャー
	 */
	constructor(private _texture: THREE.Texture) {
		this._scene = new THREE.Scene()
		this._target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
		// camera
		const { width, height, near, far } = this._cameraProps()
		this._camera = new THREE.OrthographicCamera(-width, width, height, -height, near, far)
		this._camera.position.set(0, 0, 0)
		// mesh
		this._createMesh()
		// events
		window.addEventListener('mousemove', this._handleMouseMove)
		window.addEventListener('resize', this._handleResize)
	}

	private _cameraProps = () => {
		const frustumSize = window.innerHeight
		const aspect = window.innerWidth / window.innerHeight
		const [w, h] = [(frustumSize * aspect) / 2, frustumSize / 2]
		return { width: w, height: h, near: -1000, far: 1000 }
	}

	private _createMesh = () => {
		const size = 64
		const geometry = new THREE.PlaneGeometry(size, size)
		const material = new THREE.MeshBasicMaterial({
			map: this._texture,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false
		})
		for (let i = 0; i < this._max; i++) {
			const mesh = new THREE.Mesh(geometry.clone(), material.clone())
			mesh.rotateZ(2 * Math.PI * Math.random())
			mesh.visible = false
			this._scene.add(mesh)
			this._meshs.push(mesh)
		}
	}

	private _handleMouseMove = (e: MouseEvent) => {
		this._mouse.x = e.clientX - window.innerWidth / 2
		this._mouse.y = window.innerHeight / 2 - e.clientY
	}

	private _handleResize = () => {
		const { width, height } = this._cameraProps()
		this._camera.left = -width
		this._camera.right = width
		this._camera.top = height
		this._camera.bottom = -height
		this._camera.updateProjectionMatrix()
		this._target.setSize(window.innerWidth, window.innerHeight)
	}

	private _setNewWave = () => {
		const mesh = this._meshs[this._currentWave]
		mesh.visible = true
		mesh.position.set(this._mouse.x, this._mouse.y, 0)
		mesh.scale.x = mesh.scale.y = 0.2
		;(mesh.material as THREE.MeshBasicMaterial).opacity = 0.4
	}

	private _trackMousePos = () => {
		// 今のマウス座標と前回のフレームのマウス座標の距離
		const distance = this._mouse.distanceTo(this._prevMouse)
		if (this._frequency < distance) {
			this._setNewWave()
			this._currentWave = (this._currentWave + 2) % this._max
			// console.log(this._currentWave)
		}
		this._prevMouse.x = this._mouse.x
		this._prevMouse.y = this._mouse.y
	}

	/**
	 * 描画を更新する
	 * @param gl メインレンダラー
	 * @param uTexture 波紋の描画結果を格納するuniform
	 */
	update = (gl: THREE.WebGLRenderer, uTexture: THREE.IUniform<any>) => {
		this._trackMousePos()

		gl.setRenderTarget(this._target)
		gl.render(this._scene, this._camera)
		uTexture.value = this._target.texture
		gl.setRenderTarget(null)
		gl.clear()

		this._meshs.forEach(mesh => {
			if (mesh.visible) {
				const material = mesh.material as THREE.MeshBasicMaterial
				mesh.rotation.z += 0.12
				material.opacity *= 0.97
				mesh.scale.x = 0.98 * mesh.scale.x + 0.20
				mesh.scale.y = mesh.scale.x
				if (material.opacity < 0.002) mesh.visible = false
			}
		})
	}

	/**
	 * destroy the instance
	 */
	dispose = () => {
		window.removeEventListener('mousemove', this._handleMouseMove)
		window.removeEventListener('resize', this._handleResize)
	}
}
