export interface Event {
	category: Category;
	address: string;
	coordinates?: string;
	createdAt?: string;
	description: string;
	id?: string;
	name: string;
	scheduledFor?: string;
	updatedAt?: string;
}

export interface Category {
	id: string;
	mediaId: string;
	name: string;
	verbose: string;
}
