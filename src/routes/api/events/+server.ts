import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		const response = await fetch('https://aroundme.space/api/v1/events');
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();
		return json(data);
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 500 });
		}

		return json({ error: 'Unknown error occurred' }, { status: 500 });
	}
}
