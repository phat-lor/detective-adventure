"use server";

import { backendApi } from "@/lib/axios";
import { AxiosError } from "axios";

interface SignUpParams {
	// username: string;
	phoneNumber: string;
}

async function signUp(params: SignUpParams) {
	const { phoneNumber } = params;

	try {
		const response = await backendApi.post("/auth/signup", {
			username: phoneNumber,
			phoneNumber,
			// password,
			// Best auth ever created
			password: phoneNumber,
		});

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			return {
				ok: false,
				error: error.response?.data?.message || "Unknown error",
			};
		}
		return { ok: false, error: "Unknown error" };
	}
}

export { signUp };
