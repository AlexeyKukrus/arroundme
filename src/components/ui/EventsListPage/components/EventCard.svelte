<script lang='ts'>
    import type { Event } from "$lib/types/event";
    export let item: Event = {}
</script>

 <div class='event-card'>
      <!-- <img src={item.imageUrl} alt={item.name} class="event-image" /> -->
      <div class="event-card-content">
        <h3>{item.name}</h3>
      </div>
    </div>


