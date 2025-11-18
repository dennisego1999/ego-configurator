import { Euler, MathUtils, Mesh, Object3D, Quaternion, Scene } from 'three';

/**
 * Linearly interpolates between two numeric values.
 *
 * @param {number} value1 - The starting value.
 * @param {number} value2 - The target value.
 * @param {number} amount - The interpolation factor between 0 and 1.
 * @returns {number} The interpolated value.
 */
export function lerp(value1: number, value2: number, amount: number): number {
	amount = Math.max(0, Math.min(1, amount));
	return value1 + (value2 - value1) * amount;
}

/**
 * Clamps a number between two bounds.
 *
 * @param {number} num - The number to clamp.
 * @param {number} a - The first bound.
 * @param {number} b - The second bound.
 * @returns {number} The clamped number.
 */
export function clampNumber(num: number, a: number, b: number): number {
	return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

/**
 * Returns a promise that resolves after a given number of seconds.
 *
 * @param {number} seconds - The number of seconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export function delay(seconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Recursively flattens all descendants of the given Object3D array.
 *
 * This function traverses the Three.js scene graph hierarchy, returning a flat array
 * that includes both the parent objects and all nested child objects up to the specified depth.
 *
 * @example
 * // Returns all objects in the scene (including nested children)
 * const allObjects = flattenChildren(scene.children, Infinity);
 *
 * @param {Array<Object3D>} array - The array of Object3D instances to traverse.
 * @param {number} [depth=Infinity] - The maximum recursion depth. Use `Infinity` to flatten all levels.
 * @returns {Array<Object3D>} A flattened array containing all Object3D instances from the input hierarchy.
 */
export function flattenChildren(array: Array<Object3D>, depth: number = Infinity): Array<Object3D> {
	return array.reduce<Array<Object3D>>((acc, obj) => {
		acc.push(obj);
		if (depth > 0 && obj.children.length > 0) {
			acc.push(...flattenChildren(obj.children as Array<Object3D>, depth - 1));
		}
		return acc;
	}, []);
}

/**
 * Filters a list of Meshes to only include those whose names match any in a provided list.
 *
 * @param {Array<Mesh>} meshes - The list of Mesh objects.
 * @param {Array<string>} names - The list of names to match.
 * @returns {Array<Mesh>} The filtered Mesh objects.
 */
export function getMeshes(meshes: Array<Mesh>, names: Array<string>): Array<Mesh> {
	return meshes.filter((mesh) => names.includes(mesh.name));
}

/**
 * Retrieves all child objects of a Scene that match any of the provided keys.
 *
 * @param {Scene} scene - The Three.js Scene instance.
 * @param {Array<string>} keys - The list of object names to match against.
 * @param {string} matching - The type of name matching ('exact' | 'partial').
 * @returns {Array<Object3D>} The matching Object3D instances.
 */
export const getChildren = (scene: Scene, keys: Array<string>, matching: string): Array<Object3D> => {
	return flattenChildren(scene.children, Infinity).filter((child: Object3D) => {
		return keys.find((key) => {
			return isMatching(child, {
				name: key,
				matching
			});
		});
	});
};

/**
 * Checks if an Object3D's name (or its parent's name if in a group)
 * matches a given binding, either exactly or partially.
 *
 * @param {Object3D} item - The object to check.
 * @param {{ name: string; matching: string }} binding - The matching configuration.
 * @param {string} binding.name - The target name to match.
 * @param {'exact'|'partial'} binding.matching - The matching mode.
 * @returns {boolean} Whether the object matches the given criteria.
 */
export function isMatching(item: Object3D, binding: { name: string; matching: string }): string | boolean | undefined {
	const parentName = item.parent?.type === 'Group' ? item.parent.name : undefined;

	switch (binding.matching) {
		case 'partial':
			return item.name.indexOf(binding.name) > -1 || (parentName && parentName.indexOf(binding.name) > -1);

		case 'exact':
		default:
			return item.name === binding.name || (parentName && parentName === binding.name);
	}
}

/**
 * Converts Euler angles in degrees to a Quaternion.
 *
 * @param {number} x - The rotation around the X-axis in degrees.
 * @param {number} y - The rotation around the Y-axis in degrees.
 * @param {number} z - The rotation around the Z-axis in degrees.
 * @returns {Quaternion} The resulting quaternion rotation.
 */
export function degreesToQuaternion(x: number, y: number, z: number): Quaternion {
	const euler = new Euler(MathUtils.degToRad(x), MathUtils.degToRad(y), MathUtils.degToRad(z), 'XYZ');
	return new Quaternion().setFromEuler(euler);
}

/**
 * Type guard to check if an Object3D is a Mesh.
 *
 * @param {Object3D | undefined} obj - The object to check.
 * @returns {boolean} True if the object is a Mesh, false otherwise.
 */
export function isMesh(obj: Object3D | undefined): obj is Mesh {
	return obj !== undefined && (obj as any).isMesh;
}
