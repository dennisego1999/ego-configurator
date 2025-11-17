import SceneObject from './SceneObject.ts';
import IModelOptions from '../Interfaces/IModelOptions.ts';
import { Scene } from 'three';
import { ModelPrefix } from '../Enums/ModelPrefix.ts';

export default class Environment extends SceneObject {
	private constructor(options: IModelOptions) {
		super(options);
	}

	public static async make(scene: Scene): Promise<Environment> {
		// Make the instance
		const instance = new Environment({
			modelPrefix: ModelPrefix.ENVIRONMENT,
			modelId: 1
		});

		// Init the instance
		await instance.init(scene);

		return instance;
	}
}
