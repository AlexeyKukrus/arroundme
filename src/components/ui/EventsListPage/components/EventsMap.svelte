<script lang="ts">
  import { onMount } from 'svelte';

  let mapContainer: HTMLDivElement;

  onMount(() => {
    // Загружаем скрипт Яндекс.Карт
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.type = 'text/javascript';
    script.onload = initMap;
    document.head.appendChild(script);
  });

  function initMap() {
    // @ts-ignore
    ymaps.ready(() => {
      // @ts-ignore
      const map = new ymaps.Map(mapContainer, {
        center: [55.751244, 37.618423], // Москва
        zoom: 10,
        controls: ['zoomControl']
      });

      // Пример метки
      // @ts-ignore
      const placemark = new ymaps.Placemark(
        [55.751244, 37.618423],
        { balloonContent: 'Привет, это Москва!' },
        { preset: 'islands#redIcon' }
      );

      map.geoObjects.add(placemark);

      // Пример: событие при изменении границ карты
      map.events.add('boundschange', () => {
        console.log('Новая область карты:', map.getBounds());
      });
    });
  }
</script>

<style>
  .map {
    width: 100%;
    height: 400px;
  }
</style>

<div bind:this={mapContainer} class="map"></div>
