import { backendApi } from "@/lib/axios";
import { getSessionUserData } from "@/lib/backend";
import { AxiosError } from "axios";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshToken(token: JWT): Promise<JWT> {
	try {
		const res = await backendApi.post(
			`auth/refresh`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token.refreshToken}`,
				},
			}
		);

		if (res.status === 200) {
			console.log("Token refreshed");
			return {
				accessToken: res.data.accessToken,
				refreshToken: res.data.refreshToken || token.refreshToken, // use new refreshToken if provided
				expiresIn: res.data.expiresIn, // update expiresIn to absolute timestamp
				errSignOut: false,
			};
		}
	} catch (error) {
		if (
			error instanceof AxiosError &&
			(error.response?.status === 403 || error.response?.status === 401)
		) {
			console.error("Invalid refresh token, signing out", error.message);
			return {
				...token,
				expiresIn: 0,
				errSignOut: true,
			};
		}
	}

	return {
		...token,
		expiresIn: 0,
		errSignOut: true,
	};
}

async function getSessionData(session: Session, token: JWT) {
	try {
		const accountInfo = await getSessionUserData(token.accessToken);
		session.accessToken = token.accessToken;
		session.refreshToken = token.refreshToken;
		session.user = accountInfo;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 401) {
			const refreshedToken = await refreshToken(token);
			if (refreshedToken.errSignOut) {
				session.errSignOut = true;
				return;
			}
			return await getSessionData(session, refreshedToken); // Use the refreshed token
		} else if (error instanceof Error) {
			console.error(error.message);
		}
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				phoneNumber: { label: "Phone Number", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.phoneNumber || !credentials?.password) return null;

				const { phoneNumber, password } = credentials;

				try {
					const res = await backendApi.post(`auth/signin`, {
						phoneNumber,
						password,
					});

					if (res.status === 200) {
						console.log("User signed in");
						return res.data;
					}
				} catch (error) {
					if (error instanceof AxiosError) {
						throw new Error(error.response?.data?.message || "Unknown error");
					}
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) return { ...token, ...user };

			if (Date.now() < token.expiresIn) {
				return token;
			}
			const refreshedToken = await refreshToken(token);
			return refreshedToken;
		},
		async session({ session, token }) {
			console.log("Session callback");
			await getSessionData(session, token);
			return session;
		},
	},
	pages: {
		signIn: "/signin",
		newUser: "/signup",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
