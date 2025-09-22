import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface UserProfile {
    id: string;
    name: string;
    createdAt: string;
}

const STORAGE_KEY = 'mock-user';

function readFromStorage(): UserProfile | null {
    if (!browser) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as UserProfile | null;
        return parsed ?? null;
    } catch {
        return null;
    }
}

function writeToStorage(user: UserProfile | null): void {
    if (!browser) return;
    if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
}

function createUserStore() {
    const { subscribe, set, update } = writable<UserProfile | null>(null);

    const api = {
        subscribe,

        load: () => {
            const existing = readFromStorage();
            set(existing);
        },

        initIfEmpty: () => {
            const existing = readFromStorage();
            if (existing) {
                set(existing);
                return existing;
            }
            const mockUser: UserProfile = {
                id: crypto.randomUUID(),
                name: 'Иван Иванов',
                createdAt: new Date().toISOString()
            };
            set(mockUser);
            writeToStorage(mockUser);
            return mockUser;
        },

        updateName: (name: string) => {
            update((u) => {
                if (!u) return u;
                const updated = { ...u, name };
                writeToStorage(updated);
                return updated;
            });
        },

        deleteUser: () => {
            set(null);
            writeToStorage(null);
        }
    };

    return api;
}

export const user = createUserStore();

