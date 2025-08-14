<script>
	import EventFormPage from '../../../components/ui/EventFormPage/EventFormPage.svelte';
	import { createEventMethod } from '../../api/events/methods.js';
	import { goto } from '$app/navigation';

	const createEvent = (event) => {
		const data = event.detail;

		createEventMethod(data).then(() => {
			goto('/events');
		})
	};
</script>

<EventFormPage mode="create" on:submitForm={createEvent} />
