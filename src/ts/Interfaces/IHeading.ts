import { Alignment } from '../Enums/Alignment.ts';

export default interface IHeading {
	size?: 1 | 2 | 3 | 4 | 5 | 6;
	align?: Alignment;
	tag?: keyof HTMLElementTagNameMap;
}
