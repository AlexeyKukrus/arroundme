<script lang="ts">
	// EventsMap

	import { onMount } from 'svelte';
	import { ENV_CONFIG } from '../../../../lib/config/environment';
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';
	import type { Event } from '$lib/types/event';

	export let events: Event[] = [];

	let mapContainer: HTMLDivElement;

	function parseCoordinates(coordString: string): [number, number] | null {
		if (!coordString) return null;

		const coords = coordString.split('|').map(Number);
		if (coords.length !== 2 || coords.some(isNaN)) {
			console.warn('Некорректный формат координат:', coordString);
			return null;
		}

		return [coords[0], coords[1]];
	}

	function initMap() {
		// @ts-ignore - ymaps загружается динамически
		ymaps.ready(() => {
			// @ts-ignore
			const map = new ymaps.Map(mapContainer, {
				center: [55.751244, 37.618423], // Москва
				zoom: 10,
				controls: ['zoomControl']
			});

			events.forEach((item) => {
				if (item.coordinates) {
					const coords = parseCoordinates(item.coordinates);
					if (coords) {
						const placemark = new ymaps.Placemark(
							coords,
							{ balloonContent: item.name },
							{ preset: 'islands#redIcon' }
						);
						map.geoObjects.add(placemark);
					}
				}
			});

			map.events.add('boundschange', () => {
				console.log('Новая область карты:', map.getBounds());
			});
		});
	}

	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://api-maps.yandex.ru/2.1/?apikey=${PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`;
		script.type = 'text/javascript';
		script.onload = initMap;
		document.head.appendChild(script);
	});
</script>

<div bind:this={mapContainer} class="map"></div>
