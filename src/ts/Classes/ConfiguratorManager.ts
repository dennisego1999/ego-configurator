import { AmbientLight, Clock, Color, DirectionalLight, Mesh, MeshStandardMaterial, Object3D, Scene } from 'three';
import ConfiguratorRenderer from './ConfiguratorRenderer.ts';
import ConfiguratorCamera from './ConfiguratorCamera.ts';
import { EventService } from '../Services/EventService.ts';
import { CustomEventKey } from '../Enums/CustomEventKey.ts';
import ModelManager from './ModelManager.ts';
import { ModelPrefix } from '../Enums/ModelPrefix.ts';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Environment from './Environment.ts';
import Vehicle from './Vehicle.ts';
import { getChildren, isMesh } from '../Helpers';
import { FlameType } from '../Enums/FlameType.ts';

export default class ConfiguratorManager {
	private static _instance: ConfiguratorManager;

	private _clock: Clock = new Clock();
	private _scene: Scene = new Scene();
	private _vehicle: Vehicle | null = null;
	private _environment: Environment | null = null;
	private _controls: OrbitControls | null = null;
	private _renderer: ConfiguratorRenderer | null = null;
	private _camera: ConfiguratorCamera | null = null;
	private _canvas: HTMLCanvasElement | null = null;
	private _animateFrameId: number | null = null;
	private _innerFlames: Mesh | null = null;
	private _outerFlames: Mesh | null = null;

	public elapsedTime: number = 0;

	private constructor() {}

	public static get instance(): ConfiguratorManager {
		if (!ConfiguratorManager._instance) {
			ConfiguratorManager._instance = new ConfiguratorManager();
		}

		return ConfiguratorManager._instance;
	}

	public async init(canvas: HTMLCanvasElement): Promise<void> {
		if (this._canvas) {
			// Prevent re-initialization
			throw new Error('ConfiguratorManager is already initialized');
		}

		// Init canvas, renderer, and camera
		this._canvas = canvas;
		this._renderer = new ConfiguratorRenderer(this._canvas);
		this._camera = new ConfiguratorCamera(this._scene, this._canvas);
		this._controls = new OrbitControls(this._camera, this._canvas);

		// Preload custom materials and scene objects
		await this.preloadMaterialsAndObjects();

		// Update camera and renderer size
		this.updateSceneCameraAndRenderSize();

		// Setup the lighting
		this.setupLighting();

		// Populate the scene
		await this.populateScene();

		// Add resize listener
		window.addEventListener('resize', () => this.resize());

		// Start animation loop
		this.animate();

		// Dispatch ready event
		EventService.dispatch(CustomEventKey.READY);
	}

	public resize(): void {
		this.updateSceneCameraAndRenderSize();
	}

	public destroy(): void {
		if (this._animateFrameId) {
			cancelAnimationFrame(this._animateFrameId);
		}

		// Remove resize listener
		window.removeEventListener('resize', () => this.resize());

		if (this._renderer) {
			this._renderer.dispose();
		}
	}

	private setupLighting(): void {
		// Add ambient light
		const ambientLight = new AmbientLight(0xffffff, 4.5);
		this._scene.add(ambientLight);

		const directionalLight = new DirectionalLight(0xffffff, 1);
		directionalLight.castShadow = true;
		this._scene.add(directionalLight);
	}

	private async preloadMaterialsAndObjects() {
		// Preload possible objects and materials here
		await ModelManager.instance.get({ modelPrefix: ModelPrefix.VEHICLE, modelId: 1 });
		await ModelManager.instance.get({ modelPrefix: ModelPrefix.ENVIRONMENT, modelId: 1 });
	}

	private updateSceneCameraAndRenderSize() {
		if (!this._canvas || !this._camera || !this._renderer) {
			return;
		}

		const parentElement = this._canvas.parentNode as HTMLElement;
		const boundingClientRect = parentElement.getBoundingClientRect();

		this._camera.aspect = boundingClientRect.width / boundingClientRect.height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(boundingClientRect.width, boundingClientRect.height);
	}

	private async populateScene(): Promise<void> {
		// Make the vehicle model
		this._vehicle = await Vehicle.make(this._scene);

		// Make the environment model
		this._environment = await Environment.make(this._scene);

		const models: Object3D[] = getChildren(
			this._scene,
			[
				'Circle001_12', // Inner flames material
				'Torus000_13' // Outer flames material
			],
			'exact'
		);

		// Set variables
		this._innerFlames = isMesh(models[0]?.children[0]) ? (models[0].children[0] as Mesh) : null;
		this._outerFlames = isMesh(models[1]?.children[0]) ? (models[1].children[0] as Mesh) : null;
	}

	public setFlameColor(color: Color, type: FlameType = FlameType.INNER) {
		const flame = type === FlameType.INNER ? this._innerFlames : this._outerFlames;

		if (flame && flame.material instanceof MeshStandardMaterial) {
			flame.material.emissive = color;
		}
	}

	private animate(): void {
		const delta = this._clock.getDelta();
		this.elapsedTime = this._clock.getElapsedTime();

		this.render(delta);

		this._animateFrameId = requestAnimationFrame(this.animate.bind(this));
	}

	private render(delta: number): void {
		if (!this._renderer || !this._camera || !this._vehicle || !this._controls || !this._environment) return;

		// Update the VEHICLE
		this._vehicle.update(delta);

		// Update the environment
		this._environment.update(delta);

		// Update controls
		this._controls.update();

		// Render
		this._renderer.render(this._scene, this._camera);
	}
}
