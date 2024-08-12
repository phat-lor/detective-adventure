// app/Providers.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import HandleSignout from "./HandleSignout";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SessionProvider>
				<HandleSignout />

				<Toaster richColors position="top-center" />
				<NextUIProvider>
					<NextThemesProvider attribute="class" defaultTheme="light">
						{children}
					</NextThemesProvider>
				</NextUIProvider>
			</SessionProvider>
		</>
	);
}
