<script>
    import EventForm from '@app/modules/events/components/EventForm.svelte';
    import { createEventMethod } from '@api/events/methods';
    import { goto } from '$app/navigation';

    const createEvent = (event: CustomEvent<any>) => {
        const data = event.detail;

        createEventMethod(data).then(() => {
            goto('/events');
        });
    };
</script>

<EventForm mode="create" on:submitForm={createEvent} />
