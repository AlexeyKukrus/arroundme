<script lang="ts">
	// EventsMap

	import { onMount } from 'svelte';
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';
	import type { Event } from '$lib/types/event';
	import '../../../../lib/types/yandex-maps.d.ts';

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
		if (!window.ymaps) return;
		window.ymaps.ready(() => {
			const ym = window.ymaps;
			const map = new ym.Map(mapContainer, {
				center: [55.751244, 37.618423], // Москва
				zoom: 10,
				controls: ['zoomControl']
			});

			events.forEach((item) => {
				if (item.coordinates) {
					const coords = parseCoordinates(item.coordinates);
					if (coords) {
						const placemark = new ym.Placemark(
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

			function placeUser(coords: [number, number], source: string) {
				console.log(`Моя геопозиция (${source}) [lat, lon]:`, coords);
				try {
					map.setCenter(coords, 12);
					const mePlacemark = new ym.Placemark(
						coords,
						{ hintContent: 'Вы здесь' },
						{ preset: 'islands#blueCircleIcon' }
					);
					map.geoObjects.add(mePlacemark);
				} catch (e) {
					console.warn('Не удалось центрировать карту по геопозиции:', e);
				}
			}

			// Геолокация пользователя: сначала через браузер с высокой точностью, затем fallback через Yandex
			if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const userCoords: [number, number] = [
							position.coords.latitude,
							position.coords.longitude
						];
						console.log('Точность браузера (метры):', position.coords.accuracy);
						placeUser(userCoords, 'browser');
					},
					(error) => {
						console.warn('Не удалось получить геопозицию через браузер:', error);
						// fallback на Yandex geolocation
						if (ym.geolocation && ym.geolocation.get) {
							// сначала пытаемся через провайдера browser, затем yandex
							ym.geolocation
								.get({ provider: 'browser', mapStateAutoApply: false })
								.then((res: any) => {
									const coords = res.geoObjects.get(0).geometry.getCoordinates();
									placeUser(coords, 'ym-browser');
								})
								.catch(() => {
									return ym.geolocation.get({ provider: 'yandex', mapStateAutoApply: false }).then((res: any) => {
										const coords = res.geoObjects.get(0).geometry.getCoordinates();
										placeUser(coords, 'ym-yandex');
									});
								});
						}
					},
					{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
				);
			} else if (ym.geolocation && ym.geolocation.get) {
				// Если браузерная геолокация недоступна
				ym.geolocation
					.get({ provider: 'browser', mapStateAutoApply: false })
					.then((res: any) => {
						const coords = res.geoObjects.get(0).geometry.getCoordinates();
						placeUser(coords, 'ym-browser');
					})
					.catch(() => {
						return ym.geolocation.get({ provider: 'yandex', mapStateAutoApply: false }).then((res: any) => {
							const coords = res.geoObjects.get(0).geometry.getCoordinates();
							placeUser(coords, 'ym-yandex');
						});
					});
			} else {
				console.warn('Геолокация не поддерживается этим браузером.');
			}
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
