import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const messages = useMessages();

	return (
		<NextIntlClientProvider messages={pick(messages, ["signin", "signup"])}>
			<main className="flex w-full min-h-screen">
				<MaxWidthWrapper className="flex flex-col h-screen justify-center items-center">
					{children}
				</MaxWidthWrapper>
			</main>
		</NextIntlClientProvider>
	);
}
