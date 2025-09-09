import { PerspectiveCamera, Scene } from 'three';

export default class ConfiguratorCamera extends PerspectiveCamera {
	constructor(scene: Scene, canvas: HTMLCanvasElement) {
		super(65, canvas.offsetWidth / canvas.offsetHeight, 0.1, 2000);

		// Update camera projection matrix
		this.updateProjectionMatrix();

		// Add camera to scene
		scene.add(this);
	}
}
