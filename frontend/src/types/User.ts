import { Role } from "./role";

interface User {
	id: string;
	phoneNumber: string;
	username: string;
	role: Role;
	createdAt: string;
}

export type { User };
