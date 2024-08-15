"use client";
import type { NavbarProps } from "@nextui-org/react";

import React from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	Link,
	Button,
	Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/lib/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import DashNavAvatar from "./NavAvatar";
import LangugeSwitcher from "../locale/LangSwitcher";
import { Role } from "@/types";

// const menuItems = [

// ];

export function AppNavbar(props: NavbarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const { data: session } = useSession();
	const t = useTranslations("tasks.navbar");

	return (
		<Navbar
			{...props}
			classNames={{
				base: cn("border-default-100", {
					"bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
				}),
				wrapper: "w-full justify-center",
				item: "hidden md:flex",
			}}
			height="60px"
			isMenuOpen={isMenuOpen}
			maxWidth="xl"
			onMenuOpenChange={setIsMenuOpen}
		>
			{/* Left Content */}
			<NavbarBrand>
				{/* <div className="rounded-full bg-foreground text-background">
					<AcmeIcon size={34} />
				</div> */}
				<span className="font-medium">{t("title")}</span>
			</NavbarBrand>

			{/* Center Content */}
			<NavbarContent justify="center">
				{/* {menuItems.map((item, index) => (
					<NavbarItem key={`${item.title}-${index}`}>
						<Link
							aria-current={pathname === item.href ? "page" : undefined}
							color="foreground"
							href={item.href}
							size="sm"
							target={item.isExternal ? "_blank" : "_self"}
							showAnchorIcon={item.isExternal}
							className={
								pathname === item.href ? "text-foreground" : "text-default-500"
							}
						>
							{t(item.title)}
						</Link>
					</NavbarItem>
				))} */}
			</NavbarContent>

			{/* Right Content */}
			<NavbarContent className="hidden md:flex" justify="end">
				{session && session.user && (
					<>
						<NavbarItem className="ml-2 !flex gap-2">
							<LangugeSwitcher />

							<DashNavAvatar />
						</NavbarItem>
					</>
				)}
			</NavbarContent>

			<NavbarMenuToggle className="text-default-400 md:hidden" />

			<NavbarMenu
				className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
				motionProps={{
					initial: { opacity: 0, y: -20 },
					animate: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: -20 },
					transition: {
						ease: "easeInOut",
						duration: 0.2,
					},
				}}
			>
				{session && session.user ? (
					<>
						<NavbarMenuItem className="mb-4">
							<DashNavAvatar userComponent />
						</NavbarMenuItem>
						<NavbarMenuItem>
							<LangugeSwitcher />
						</NavbarMenuItem>
					</>
				) : (
					<>
						<NavbarMenuItem>
							<Button fullWidth as={Link} href="/signin" variant="faded">
								{t("signin")}
							</Button>
						</NavbarMenuItem>
						<NavbarMenuItem className="mb-4">
							<Button
								fullWidth
								as={Link}
								className="bg-foreground text-background"
								href="/signup"
							>
								{t("signup")}
							</Button>
						</NavbarMenuItem>
					</>
				)}
				{/* {menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item.title}-${index}`}>
						<Link
							className="mb-2 w-full text-default-500"
							href={item.href}
							size="md"
							target={item.isExternal ? "_blank" : "_self"}
						>
							{t(item.title)}
						</Link>
						{index < menuItems.length - 1 && <Divider className="opacity-50" />}
					</NavbarMenuItem>
				))} */}
			</NavbarMenu>
		</Navbar>
	);
}
