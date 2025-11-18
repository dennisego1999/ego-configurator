import SceneObject from './SceneObject.ts';
import IModelOptions from '../Interfaces/IModelOptions.ts';
import { Scene, Vector3 } from 'three';
import { ModelPrefix } from '../Enums/ModelPrefix.ts';
import { degreesToQuaternion } from '../Helpers';

export default class Vehicle extends SceneObject {
	private constructor(options: IModelOptions) {
		super(options);
	}

	public static async make(scene: Scene): Promise<Vehicle> {
		// Make the instance
		const instance = new Vehicle({
			modelPrefix: ModelPrefix.VEHICLE,
			modelId: 1,
			spawnScale: new Vector3(0.35, 0.35, 0.35),
			spawnRotation: degreesToQuaternion(0, 180, 0)
		});

		// Init the instance
		await instance.init(scene);

		return instance;
	}
}
