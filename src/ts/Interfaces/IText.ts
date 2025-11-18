import { Alignment } from '../Enums/Alignment.ts';

export default interface IText {
	align?: Alignment;
	size?: 1 | 2 | 3 | 4;
	tag?: keyof HTMLElementTagNameMap;
	noWrap?: boolean;
}
