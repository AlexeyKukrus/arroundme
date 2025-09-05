<!-- YandexMapModal.svelte -->
<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';
	import '../../../lib/types/yandex-maps.d.ts';

	export let isOpen = false;
	export let onClose: (() => void) | undefined = undefined;
	export let onCoordinatesSelect: ((coords: [number, number]) => void) | undefined = undefined;

	let mapContainer: HTMLDivElement | undefined = undefined;
	let map: any = null;
	let ymaps: any = null;
	let isLoading = false;
	let error: string | null = null;

	let placemark: any = null;
	let selectedCoords: [number, number] | null = null;

	const loadYmaps = () => {
		if (!browser) return Promise.reject(new Error('Not in browser'));

		if (window.ymaps) {
			return Promise.resolve(window.ymaps);
		}

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
					if (window.ymaps) {
						resolve(window.ymaps);
					} else {
						reject(new Error('YMaps not available after script load'));
					}
				}, 100);
			};

			script.onerror = (err) => {
				delete window.ymapsLoading;
				reject(new Error(`Failed to load Yandex Maps script: ${err}`));
			};

			document.head.appendChild(script);
		});
	};

	const initMap = async () => {
		if (!browser) return;

		isLoading = true;
		error = null;

		try {
			ymaps = await loadYmaps();

			if (!ymaps || typeof ymaps.ready !== 'function') {
				throw new Error('YMaps API not properly loaded');
			}

			await ymaps.ready;

			if (!mapContainer) {
				throw new Error('Map container not found');
			}

			map = new ymaps.Map(mapContainer, {
				center: [55.76, 37.64],
				zoom: 10
			});

			function placeUser(coords: [number, number], source: string) {
				console.log(`Моя геопозиция (${source}) [lat, lon]:`, coords);
				try {
					map.setCenter(coords, 12);
					const mePlacemark = new ymaps.Placemark(
						coords,
						{ hintContent: 'Вы здесь' },
						{ preset: 'islands#blueCircleIcon' }
					);
					map.geoObjects.add(mePlacemark);
				} catch (e) {
					console.warn('Не удалось центрировать карту по геопозиции:', e);
				}
			}

			// Геолокация пользователя: high-accuracy + fallback через Yandex
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
						if (ymaps.geolocation && ymaps.geolocation.get) {
							// сначала provider browser, затем yandex
							ymaps.geolocation
								.get({ provider: 'browser', mapStateAutoApply: false })
								.then((res: any) => {
									const coords = res.geoObjects.get(0).geometry.getCoordinates();
									placeUser(coords, 'ym-browser');
								})
								.catch(() => {
									return ymaps.geolocation
										.get({ provider: 'yandex', mapStateAutoApply: false })
										.then((res: any) => {
											const coords = res.geoObjects.get(0).geometry.getCoordinates();
											placeUser(coords, 'ym-yandex');
										});
								});
						}
					},
					{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
				);
			} else if (ymaps.geolocation && ymaps.geolocation.get) {
				ymaps.geolocation
					.get({ provider: 'browser', mapStateAutoApply: false })
					.then((res: any) => {
						const coords = res.geoObjects.get(0).geometry.getCoordinates();
						placeUser(coords, 'ym-browser');
					})
					.catch(() => {
						return ymaps.geolocation
							.get({ provider: 'yandex', mapStateAutoApply: false })
							.then((res: any) => {
								const coords = res.geoObjects.get(0).geometry.getCoordinates();
								placeUser(coords, 'ym-yandex');
							});
						});
			} else {
				console.warn('Геолокация не поддерживается этим браузером.');
			}

			map.events.add('click', handleMapClick);
		} catch (err) {
			console.error('❌ Ошибка инициализации карты:', err);
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			isLoading = false;
		}
	};

	const handleMapClick = (e: any) => {
		if (!ymaps || !map) return;

		try {
			const coords = e.get('coords');
			selectedCoords = coords;

			// Удаляем старую метку
			if (placemark) {
				map.geoObjects.remove(placemark);
			}

			placemark = new ymaps.Placemark(coords, {
				balloonContent: `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
			});

			map.geoObjects.add(placemark);
			placemark.balloon.open();
		} catch (err) {
			console.error('Ошибка при получении координат:', err);
			error = 'Ошибка при получении координат';
		}
	};

	const destroyMap = () => {
		if (map) {
			try {
				map.events.remove('click', handleMapClick);
				map.destroy();
			} catch (err) {
				console.warn('Ошибка при уничтожении карты:', err);
			}
			map = null;
		}
		placemark = null;
		selectedCoords = null;
		error = null;
	};

	const handleClose = () => {
		destroyMap();
		if (onClose) onClose();
	};

	const handleSelect = () => {
		if (onCoordinatesSelect && selectedCoords) {
			onCoordinatesSelect(selectedCoords);
		}
		handleClose();
	};

	const handleRetry = () => {
		error = null;
		initMap();
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && isOpen) {
			handleClose();
		}
	};

	onMount(() => {
		if (!browser) return;

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			destroyMap();
		};
	});

	afterUpdate(() => {
		if (!browser) return;

		if (isOpen && !map && !isLoading && !error) {
			initMap();
		} else if (!isOpen && map) {
			destroyMap();
		}
	});
</script>

{#if isOpen}
	<div class="modal-overlay" on:click|self={handleClose}>
		<div class="modal">
			<button class="close-button" on:click={handleClose} title="Закрыть"> × </button>

			{#if error}
				<div class="info-panel error-panel">
					<div class="info-icon">⚠️</div>
					<h4>Ошибка</h4>
					<p>{error}</p>
					<button class="retry-button" on:click={handleRetry}> Повторить попытку </button>
				</div>
			{:else if isLoading}
				<div class="info-panel loading-panel">
					<div class="spinner"></div>
					<p>Загрузка карты...</p>
				</div>
			{:else if !selectedCoords}
				<div class="info-panel hint-panel">
					<p>🗺 Кликните на карте для выбора точки</p>
				</div>
			{/if}

			<div class="modal-content">
				<div bind:this={mapContainer} class="map"></div>
			</div>

			{#if selectedCoords}
				<div class="select-panel">
					<button class="select-button" on:click={handleSelect}>ВЫБРАТЬ</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 10px;
	}

	.modal {
		background: white;
		border-radius: 12px;
		width: 100%;
		max-width: 1000px;
		height: 90%;
		max-height: fit-content;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		position: relative;
	}

	.close-button {
		position: absolute;
		top: 0px;
		right: 0px;
		background: none;
		border: none;
		font-size: 28px;
		cursor: pointer;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: #666;
		transition: all 0.2s ease;
		z-index: 10;
	}
	.close-button:hover {
		background-color: #f0f0f0;
		color: #333;
		transform: scale(1.1);
	}

	.modal-content {
		flex: 1;
		padding: 0;
	}
	.map {
		width: 900px;
		height: 500px;
	}

	.map-container {
		width: 100%;
		height: 100%;
	}

	.select-panel {
		padding: 12px;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: center;
	}
	.select-button {
		background: #28a745;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		transition: background 0.2s ease;
	}
	.select-button:hover {
		background: #218838;
	}

	.error-panel,
	.loading-panel,
	.hint-panel {
		position: absolute;
		top: 60px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 6px;
		z-index: 5;
		text-align: center;
		padding: 12px 20px;
	}
	.error-panel {
		background: #fff3f3;
		border: 1px solid #ffcccc;
	}
	.loading-panel {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
	}
	.hint-panel {
		background: #fff3cd;
		border: 1px solid #ffeaa7;
	}

	/* Адаптивность для разных экранов */
	@media (max-width: 1200px) {
		.modal {
			max-width: 90vw;
			height: 80vh;
		}

		.map {
			width: 100%;
			height: 450px;
		}
	}

	@media (max-width: 768px) {
		.modal {
			max-width: 95vw;
			height: 85vh;
			border-radius: 8px;
		}

		.map {
			width: 100%;
			height: 350px;
		}

		.modal-content {
			padding: 0;
		}
	}

	@media (max-width: 480px) {
		.modal {
			max-width: 100vw;
			height: 90vh;
			border-radius: 0;
		}

		.map {
			width: 70vw;
			height: 70vh;
		}

		.close-button {
			top: 8px;
			right: 8px;
			width: 32px;
			height: 32px;
			font-size: 24px;
		}
	}

	@media (max-width: 360px) {
		.modal {
			max-width: 100vw;
			height: 95vh;
		}

		.map {
			width: 300px;
			height: 250px;
		}

		.select-button {
			padding: 10px 20px;
			font-size: 14px;
		}
	}
</style>
