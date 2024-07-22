import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
		NEXT_PUBLIC_IMAGE_SERVER_ENDPOINT:
			process.env.NEXT_PUBLIC_IMAGE_SERVER_ENDPOINT,
	},
};

export default withNextIntl(nextConfig);
