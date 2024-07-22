import createIntlMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./lib/navigation";
import { NextRequest, NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

const publicPages = ["/signin", "/signup", "/checkpoint/**"];

const intlMiddleware = createIntlMiddleware({
	locales,
	localePrefix,
	defaultLocale: "en",
});

const authMiddleware = withAuth(
	// Note that this callback is only invoked if
	// the `authorized` callback has returned `true`
	// and not for pages listed in `pages`.
	(req) => intlMiddleware(req),
	{
		callbacks: {
			authorized: ({ token }) => token != null,
		},
		pages: {
			signIn: "/signin",
			newUser: "/signup",
			// signOut: "/logout",
		},
	}
);

export default function middleware(req: NextRequest) {
	const publicPathnameRegex = RegExp(
		`^(/(${locales.join("|")}))?(${publicPages
			.flatMap((p) => (p === "/" ? ["", "/"] : p.replace("/**", "(/.*)?")))
			.join("|")})/?$`,
		"i"
	);
	const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

	if (isPublicPage) {
		return intlMiddleware(req);
	} else {
		return (authMiddleware as any)(req);
	}
}

export const config = {
	// Skip all paths that should not be internationalized
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
