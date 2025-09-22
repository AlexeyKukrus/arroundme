<script lang="ts">
	// EventsMap
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Event } from '@app/models/events/types';

	export let events: Event[] = [];

	let mapContainer: HTMLDivElement;
	const dispatch = createEventDispatcher<{
		boundsChange: {
			bounds: [[number, number], [number, number]];
			center: [number, number];
			zoom: number;
		};
	}>();

	let map: any = null;
	let ym: any = null;
	let eventPlacemarks: any[] = [];

	function parseCoordinates(coordString: string): [number, number] | null {
		if (!coordString) return null;
		const coords = coordString.split('|').map(Number);
		if (coords.length !== 2 || coords.some(isNaN)) return null;
		return [coords[0], coords[1]];
	}

	const loadYmaps = () => {
		if (window.ymaps) return Promise.resolve(window.ymaps);
		return new Promise((resolve, reject) => {
			if (window.ymapsLoading) {
				const checkLoading = setInterval(() => {
					if (window.ymaps) {
						clearInterval(checkLoading);
						resolve(window.ymaps);
					}
				}, 100);
				return;
			}
			window.ymapsLoading = true;
			const script = document.createElement('script');
			script.src = `https://api-maps.yandex.ru/2.1/?apikey=${PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`;
			script.onload = () => {
				delete window.ymapsLoading;
				setTimeout(() => {
					if (window.ymaps) resolve(window.ymaps);
					else reject(new Error('YMaps not available after script load'));
				}, 100);
			};
			script.onerror = (err) => {
				delete window.ymapsLoading;
				reject(new Error(`Failed to load Yandex Maps script: ${err}`));
			};
			document.head.appendChild(script);
		});
	};

	function clearEventPlacemarks() {
		if (!map || !eventPlacemarks.length) return;
		eventPlacemarks.forEach((p) => {
			try { map.geoObjects.remove(p); } catch {}
		});
		eventPlacemarks = [];
	}

	function renderEventMarkers(evts: Event[]) {
		if (!map || !ym) return;
		clearEventPlacemarks();
		evts.forEach((item) => {
			if (item.coordinates) {
				const coords = parseCoordinates(item.coordinates);
				if (coords) {
					const placemark = new ym.Placemark(
						coords,
						{ balloonContent: item.name },
						{ preset: 'islands#redIcon' }
					);
					map.geoObjects.add(placemark);
					eventPlacemarks.push(placemark);
				}
			}
		});
	}

	function initMap() {
		if (!window.ymaps) return;
		window.ymaps.ready(() => {
			ym = window.ymaps;
			map = new ym.Map(mapContainer, {
				center: [55.751244, 37.618423],
				zoom: 10,
				controls: ['zoomControl']
			});
			renderEventMarkers(events);
			const emitBounds = () => {
				try {
					const bounds = map.getBounds();
					const center = map.getCenter();
					const zoom = map.getZoom();
					dispatch('boundsChange', { bounds, center, zoom });
				} catch {}
			};
			map.events.add('boundschange', () => emitBounds());
			setTimeout(emitBounds, 0);
		});
	}

	$: if (map) renderEventMarkers(events);

	onMount(async () => {
		try {
			await loadYmaps();
			initMap();
		} catch (e) {
			console.error('Не удалось загрузить Yandex Maps:', e);
		}
	});
</script>

<div bind:this={mapContainer} class="map"></div>


