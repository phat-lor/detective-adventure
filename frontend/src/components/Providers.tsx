// app/Providers.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SessionProvider>
				<Toaster richColors position="bottom-right" />
				<NextUIProvider>
					<NextThemesProvider attribute="class" forcedTheme="light">
						{children}
					</NextThemesProvider>
				</NextUIProvider>
			</SessionProvider>
		</>
	);
}
