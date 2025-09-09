import { ModelPrefix } from '../Enums/ModelPrefix.ts';
import { Object3D, Quaternion, Vector3 } from 'three';
import { IModelCacheEntry } from '../Interfaces/IModelCacheEntry.ts';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import { ThreeLoaders } from './ThreeLoaders.ts';

export default class ModelManager {
	private static _instance: ModelManager;
	private _modelCache: Map<string, IModelCacheEntry> = new Map();

	private constructor() {}

	public static get instance(): ModelManager {
		if (!this._instance) {
			this._instance = new ModelManager();
		}

		return this._instance;
	}

	/**
	 * Retrieves a model by prefix and ID.
	 * - If the model is cached, a cloned copy is returned (ensuring each caller
	 *   receives a unique Object3D instance while reusing the same geometry/materials).
	 * - If the model is not cached, it is loaded from disk, cached, and then returned.
	 *
	 * @param modelPrefix - The folder name/prefix for the model (e.g. "player", "enemy").
	 * @param modelId - Numeric identifier for the model within the prefix folder.
	 * @param spawnPosition - Position to place the model (default: `new Vector3()`).
	 * @param spawnRotation - Rotation to apply to the model (default: identity `Quaternion`).
	 * @param spawnScale - Scale to apply to the model (default: `Vector3(1,1,1)`).
	 *
	 * @returns Promise that resolves with a cached or newly loaded model entry,
	 * containing a Three.js `Object3D` and its associated animations.
	 *
	 * @example
	 * ```ts
	 * const { model, animations } = await ModelManager.instance.get("enemy", 1);
	 * ```
	 */
	public get(
		modelPrefix: ModelPrefix,
		modelId: number,
		spawnPosition: Vector3 = new Vector3(),
		spawnRotation: Quaternion = new Quaternion(),
		spawnScale: Vector3 = new Vector3(1, 1, 1)
	): Promise<IModelCacheEntry> {
		return new Promise(async (resolve, reject) => {
			if (this._modelCache.has(`${modelPrefix}-${modelId}`)) {
				// Reuse existing model
				const cachedGltf = this._modelCache.get(`${modelPrefix}-${modelId}`)!;

				// Set spawn position and rotation
				cachedGltf.model.position.copy(spawnPosition);
				cachedGltf.model.quaternion.copy(spawnRotation);

				const clonedModel: Object3D = clone(cachedGltf.model);
				clonedModel.position.copy(spawnPosition);
				clonedModel.quaternion.copy(spawnRotation);
				clonedModel.scale.copy(spawnScale);

				// Ensure matrix world is updated
				clonedModel.updateMatrixWorld(true);

				// Resolve
				resolve({ model: clonedModel, animations: cachedGltf.animations });

				return;
			}

			try {
				// Load model for first time
				const gltf = await ThreeLoaders.loadGLTF(`/assets/models/${modelPrefix}/${modelId}/scene.gltf`);
				const model: Object3D = gltf.scene;

				// Do adjustments
				model.position.copy(spawnPosition);
				model.quaternion.copy(spawnRotation);
				model.scale.copy(spawnScale);
				model.castShadow = true;
				model.receiveShadow = true;

				// Store in cache
				this._modelCache.set(`${modelPrefix}-${modelId}`, {
					model: model,
					animations: gltf.animations
				});

				// Resolve
				resolve({ model: model, animations: gltf.animations });
			} catch (error) {
				console.error(error);
				reject(new Error('Error loading player model'));
			}
		});
	}
}
