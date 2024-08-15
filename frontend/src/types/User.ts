import { Role } from ".";

interface User {
	id: string;
	phoneNumber: string;
	username: string;
	role: Role;
	createdAt: string;
}

export type { User };
