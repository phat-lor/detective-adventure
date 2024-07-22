import type { ClassValue } from "clsx";

import clsx from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const COMMON_UNITS = ["small", "medium", "large"];

/**
 * We need to extend the tailwind merge to include NextUI's custom classes.
 *
 * So we can use classes like `text-small` or `text-default-500` and override them.
 */
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			opacity: ["disabled"],
			spacing: ["divider"],
			borderWidth: COMMON_UNITS,
			borderRadius: COMMON_UNITS,
		},
		classGroups: {
			shadow: [{ shadow: COMMON_UNITS }],
			"font-size": [{ text: ["tiny", ...COMMON_UNITS] }],
			"bg-image": ["bg-stripe-gradient"],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type Currencies = "USD" | "EUR" | "GBP" | "BDT";

export function formatPrice(
	price: number | string,
	options: {
		currency?: Currencies;
		notation?: Intl.NumberFormatOptions["notation"];
	} = {}
) {
	const { currency = "USD", notation = "compact" } = options;

	const numericPrice = typeof price === "string" ? parseFloat(price) : price;

	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			notation,
			maximumFractionDigits: 2,
		}).format(numericPrice);
	} catch (e) {
		return "N/A (Invalid Price)";
	}
}

export const validatePhoneNumber = (phoneNumber: string) =>
	// ^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$
	phoneNumber.match("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$");
