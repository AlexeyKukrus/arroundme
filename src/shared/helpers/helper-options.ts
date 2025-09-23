export type NavigationTabsList = {
	href?: string;
	icon: string;
	label: string;
	mobileIcon: string;
};

export const navigationTabsList: NavigationTabsList[] = [
	{
		href: '/events',
		icon: '/icons/home.svg',
		mobileIcon: '/icons/home_black.svg',
		label: 'События'
	},
	{
		href: '/event/create',
		icon: '/icons/plus_circle.svg',
		mobileIcon: '/icons/plus_circle_black.svg',
		label: 'Создать'
	},
	{
		icon: '/icons/chat.svg',
		mobileIcon: '/icons/chat_black.svg',
		label: 'Чат'
	},
	{
		icon: '/icons/notifications.svg',
		mobileIcon: '/icons/notifications_black.svg',
		label: 'Уведомления'
	}
];
