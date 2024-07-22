"use server";

import { backendApi } from "./axios";
import { User } from "@/types";

export async function getSessionUserData(accessToken: String): Promise<User> {
	const data = await backendApi.get("/users/me", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return data.data as User;
}
