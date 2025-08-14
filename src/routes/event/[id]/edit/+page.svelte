<script>
	import EventFormPage from '../../../../components/ui/EventFormPage/EventFormPage.svelte';
	import { updateEventByIdMethod } from '../../../api/events/[id]/methods.js';
	import { goto } from '$app/navigation';

	const updateEvent = (event) => {
		const data = event.detail;

		updateEventByIdMethod(data).then(() => {
			goto('/events');
		});
	};
</script>

<EventFormPage mode="edit" on:submitForm={updateEvent} />
