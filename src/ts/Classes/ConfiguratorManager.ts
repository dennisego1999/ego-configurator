import { Clock, Scene } from 'three';
import ConfiguratorRenderer from './ConfiguratorRenderer.ts';
import ConfiguratorCamera from './ConfiguratorCamera.ts';
import { EventService } from '../Services/EventService.ts';
import { CustomEventKey } from '../Enums/CustomEventKey.ts';

export default class ConfiguratorManager {
	private static _instance: ConfiguratorManager;

	private _clock: Clock = new Clock();
	private _scene: Scene = new Scene();
	private _renderer: ConfiguratorRenderer | null = null;
	private _camera: ConfiguratorCamera | null = null;
	private _canvas: HTMLCanvasElement | null = null;
	private _animateFrameId: number | null = null;

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

		// Preload custom materials and scene objects
		await this.preloadMaterialsAndObjects();

		// Update camera and renderer size
		this.updateSceneCameraAndRenderSize();

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

	private async preloadMaterialsAndObjects() {
		// Preload possible objects and materials here
	}

	private updateSceneCameraAndRenderSize() {
		if (this._camera) {
			this._camera.aspect = window.innerWidth / window.innerHeight;
			this._camera.updateProjectionMatrix();
		}

		if (this._renderer) {
			this._renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}

	private animate(): void {
		const delta = this._clock.getDelta();
		this.elapsedTime = this._clock.getElapsedTime();

		this.render(delta);

		this._animateFrameId = requestAnimationFrame(this.animate.bind(this));
	}

	private render(delta: number): void {
		if (!this._renderer || !this._camera) return;

		// Custom render logic can go here
		console.log('rendering ', delta);

		this._renderer.render(this._scene, this._camera);
	}
}
