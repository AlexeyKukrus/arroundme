import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface NotificationStore {
	notifications: Notification[];
}

function createNotificationStore() {
	const { subscribe, update, set } = writable<NotificationStore>({
		notifications: []
	});

	const store = {
		subscribe,

		add: (notification: Omit<Notification, 'id'>) => {
			const id = crypto.randomUUID();
			const newNotification: Notification = {
				...notification,
				id,
				duration: notification.duration ?? 5000
			};

			update((state) => ({
				...state,
				notifications: [...state.notifications, newNotification]
			}));

			if (newNotification.duration) {
				setTimeout(() => {
					store.remove(id);
				}, newNotification.duration);
			}

			return id;
		},

		remove: (id: string) => {
			update((state) => ({
				...state,
				notifications: state.notifications.filter((n) => n.id !== id)
			}));
		},

		clear: () => {
			update((state) => ({
				...state,
				notifications: []
			}));
		},

		success: (title: string, message: string, duration?: number) => {
			return store.add({ type: 'success', title, message, duration });
		},

		error: (title: string, message: string, duration?: number) => {
			return store.add({ type: 'error', title, message, duration });
		},

		warning: (title: string, message: string, duration?: number) => {
			return store.add({ type: 'warning', title, message, duration });
		},

		info: (title: string, message: string, duration?: number) => {
			return store.add({ type: 'info', title, message, duration });
		}
	};

	return store;
}

export const notifications = createNotificationStore();
