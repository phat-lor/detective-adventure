enum Role {
	USER = "USER",
	ADMIN = "ADMIN",
}

interface RoleMetadata {
	name: string;
	priority: number;
}

const roleMetadata: Record<Role, RoleMetadata> = {
	[Role.USER]: {
		name: "User",
		priority: 1,
	},
	[Role.ADMIN]: {
		name: "ADMIN",
		priority: 5,
	},
};

export { Role, roleMetadata };
