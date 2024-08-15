import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { pick } from "lodash";
import { NextIntlClientProvider, useMessages } from "next-intl";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const messages = useMessages();

	return (
		<NextIntlClientProvider messages={pick(messages, ["common", "landing"])}>
			<MaxWidthWrapper className="flex w-full  flex-col min-h-screen lg:justify-center mt-3">
				{children}
			</MaxWidthWrapper>
		</NextIntlClientProvider>
	);
}
