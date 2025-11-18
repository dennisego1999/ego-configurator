import { Ref } from 'vue';

export default interface IAudioItem {
	el: Ref<HTMLAudioElement | null>;
	volume: number;
}
