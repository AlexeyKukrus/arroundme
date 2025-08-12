<script lang="ts">
	// EventsMap
	
	import { onMount } from 'svelte';
	import type { Event } from '$lib/types/event'

	export let events: Event[] = [];

	let mapContainer: HTMLDivElement;
	function parseCoordinates(coordString: string) {
		return coordString.split('|').map(Number);
	}

	function initMap() {
		let placemark: Number[] = [];
		// @ts-ignore
		ymaps.ready(() => {
			// @ts-ignore
			const map = new ymaps.Map(mapContainer, {
				center: [55.751244, 37.618423], // Москва
				zoom: 10,
				controls: ['zoomControl']
			});

			events.map((item) => {
				placemark = new ymaps.Placemark(
					parseCoordinates(item.coordinates),
					{ balloonContent: 'Привет, это Москва!' },
					{ preset: 'islands#redIcon' }
				);
				map.geoObjects.add(placemark);
			});

			// Пример: событие при изменении границ карты
			map.events.add('boundschange', () => {
				console.log('Новая область карты:', map.getBounds());
			});
		});
	}

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
		script.type = 'text/javascript';
		script.onload = initMap;
		document.head.appendChild(script);
	});
</script>

<div bind:this={mapContainer} class="map"></div>
