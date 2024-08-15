import { User } from "@/types";
import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: User;
		accessToken: string;
		refreshToken: string;
		errSignOut: boolean;
	}
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
		errSignOut: boolean;
	}
}
