import { Inter, Onest, Prompt } from "next/font/google";
import "./globals.css";
import { Providers } from "../../components/Providers";
import AntiDebugger from "@/components/AntiDebugger";

const prompt = Onest({ subsets: ["latin"] });

export default function LocaleLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	return (
		<html
			lang={locale}
			className={`text-foreground bg-background ${prompt.className}`}
		>
			<head>
				<AntiDebugger />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
