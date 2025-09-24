// Simple mock API server for arroundme
// Usage: node server.js (optionally set PORT)

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helpers
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (data) => ({ success: true, ...data });
const err = (status, message, details) => ({
	success: false,
	error_backend_alias: {
		http_status_code: status,
		http_body: JSON.stringify({ message, details })
	}
});

// Mock DB (in-memory)
let categories = [
	{ id: '1', mediaId: 'm1', name: 'Концерты', verbose: 'concerts' },
	{ id: '2', mediaId: 'm2', name: 'Кино', verbose: 'cinema' },
	{ id: '3', mediaId: 'm3', name: 'ИТ', verbose: 'it_internet' }
];

let events = [
	{
		id: 'e1',
		name: 'JS Meetup',
		description: 'Встреча JS сообщества',
		address: 'Москва, Тверская 1',
		coordinates: '55.757|37.615',
		scheduledFor: new Date().toISOString(),
		category: categories[2],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'e2',
		name: 'Ночной показ фильма',
		description: 'Специальный показ',
		address: 'Москва, Арбат 10',
		coordinates: '55.752|37.600',
		scheduledFor: new Date(Date.now() + 86400000).toISOString(),
		category: categories[1],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
];

// Geocode mock
function mockGeoObjectCollection(query) {
	return {
		featureMember: [
			{
				GeoObject: {
					name: 'Mock address name',
					description: 'Mock address description',
					Point: { pos: '37.620 55.753' }
				}
			}
		]
	};
}

// Routes
app.get('/api/events', async (req, res) => {
	await delay(200);
	return res.json(ok({ events }));
});

app.post('/api/events', async (req, res) => {
	await delay(300);
	const body = req.body || {};
	if (!body.name || !body.address || !body.categoryId || !body.coordinates) {
		return res.status(422).json(
			err(422, 'Validation error', [
				{ name: 'name', message: 'Название обязательно' },
				{ name: 'address', message: 'Адрес обязателен' },
				{ name: 'categoryId', message: 'Категория обязательна' },
				{ name: 'coordinates', message: 'Координаты обязательны' }
			])
		);
	}
	const category = categories.find((c) => c.id === String(body.categoryId)) || categories[0];
	const ev = {
		id: `e${Math.random().toString(36).slice(2, 8)}`,
		name: String(body.name),
		description: String(body.description || ''),
		address: String(body.address),
		coordinates: String(body.coordinates),
		scheduledFor: body.scheduledFor || new Date().toISOString(),
		category,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	events.unshift(ev);
	return res.json(ok({ data: ev, message: 'created' }));
});

app.get('/api/events/categories', async (req, res) => {
	await delay(150);
	return res.json(ok({ event_categories: categories }));
});

app.put('/api/events/:id', async (req, res) => {
	await delay(250);
	const id = req.params.id;
	const idx = events.findIndex((e) => e.id === id);
	if (idx === -1) return res.status(404).json(err(404, 'not found'));
	const body = req.body || {};
	const category = body.categoryId
		? categories.find((c) => c.id === String(body.categoryId)) || events[idx].category
		: events[idx].category;
	events[idx] = {
		...events[idx],
		...body,
		category,
		updatedAt: new Date().toISOString()
	};
	return res.json(ok({ data: events[idx], message: 'updated' }));
});

app.delete('/api/events/:id', async (req, res) => {
	await delay(200);
	const id = req.params.id;
	const before = events.length;
	events = events.filter((e) => e.id !== id);
	if (events.length === before) return res.status(404).json(err(404, 'not found'));
	return res.json(ok({ message: 'deleted' }));
});

app.get('/api/events/:id', async (req, res) => {
	await delay(180);
	const it = events.find((e) => e.id === req.params.id);
	if (!it) return res.status(404).json(err(404, 'not found'));
	return res.json(ok({ event: it }));
});

// NOTE: Geocode routes intentionally NOT mocked to keep using Yandex via SvelteKit proxy

app.listen(PORT, () => {
	console.log(`Mock API server listening on http://localhost:${PORT}`);
});
