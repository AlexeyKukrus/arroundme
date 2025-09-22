<script>
    import { updateEventByIdMethod } from '@api/events/[id]/methods';
    import { goto } from '$app/navigation';
		import EventForm from '@modules/events/components/EventForm.svelte';

    const updateEvent = (event: CustomEvent<any>) => {
        const data = event.detail;

        updateEventByIdMethod(data).then(() => {
            goto('/events');
        });
    };
</script>

<EventForm mode="edit" on:submitForm={updateEvent} />
