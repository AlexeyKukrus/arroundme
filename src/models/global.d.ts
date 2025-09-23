export {};

declare global {
	interface Window {
		/** Yandex Maps API */
		ymaps?: any;
		/** Flag while YMaps script is loading */
		ymapsLoading?: boolean;
	}
}
