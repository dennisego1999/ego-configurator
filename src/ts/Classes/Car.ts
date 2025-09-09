import SceneObject from './SceneObject.ts';
import IModelOptions from '../Interfaces/IModelOptions.ts';
import { Scene } from 'three';
import { ModelPrefix } from '../Enums/ModelPrefix.ts';

export default class Car extends SceneObject {
	private constructor(options: IModelOptions) {
		super(options);
	}

	public static async make(scene: Scene): Promise<Car> {
		// Make the instance
		const instance = new Car({
			modelPrefix: ModelPrefix.CAR,
			modelId: 1
		});

		// Init the instance
		await instance.init(scene);

		return instance;
	}
}
