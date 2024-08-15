import { AppNavbar } from "@/components/basicnav/NavBar";
import DoneConfiti from "@/components/DoneConfiti";
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
		<NextIntlClientProvider
			messages={pick(messages, ["common", "tasks", "locale"])}
		>
			<AppNavbar />

			<MaxWidthWrapper className="flex w-full  flex-col min-h-screen">
				<DoneConfiti />
				{children}
			</MaxWidthWrapper>
		</NextIntlClientProvider>
	);
}
