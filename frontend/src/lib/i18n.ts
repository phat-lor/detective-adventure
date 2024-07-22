import { notFound } from "next/navigation";
import { getRequestConfig, getTranslations } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "th"];

export type Dict = { [key: string]: string | Dict };

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale as any)) notFound();

	return {
		messages: (await import(`../dictionaries/${locale}.json`)).default,
	};
});
