"use client";
import { Link } from "@/lib/navigation";
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	NavbarMenuItem,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Switch,
	User,
} from "@nextui-org/react";
import {
	ArrowUp01Icon,
	LogOut,
	MoonIcon,
	Settings,
	ShieldCheckIcon,
	SunIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { getLocale } from "next-intl/server";
import { useTheme } from "next-themes";
import { usePathname as nativePath } from "next/navigation";
import { useState } from "react";
import LangugeSwitcher from "../locale/LangSwitcher";
import { Role } from "@/types";

function DashNavAvatar({ userComponent = false }: { userComponent?: boolean }) {
	const { data: session } = useSession({ required: true });
	const { theme, setTheme } = useTheme();
	const [curLocale, setCurLocale] = useState();

	return (
		<Popover>
			<PopoverTrigger>
				{/* <Avatar size="md" name={session?.user.username} /> */}
				{userComponent ? (
					<User
						name={session?.user.username}
						// description={session?.user.email}
						description={session?.user.role}
					/>
				) : (
					<Avatar size="md" name={session?.user.username} />
				)}
			</PopoverTrigger>
			<PopoverContent>
				<Card className="min-w-[200px]">
					<CardHeader>
						<User name={session?.user.username} />
					</CardHeader>
					<Divider />
					<p className="flex m-1 p-2 hover:bg-default-200 rounded-md gap-2 transition">
						<ArrowUp01Icon size={20} />
						Role: {session?.user.role}
					</p>
					<Divider />
					{session?.user.role === Role.ADMIN && (
						<Link
							href="/admin"
							className="flex m-1 p-2 hover:bg-default-200 rounded-md gap-2 transition"
						>
							<ShieldCheckIcon size={20} />
							Admin
						</Link>
					)}
					<Divider />
					{/* <Link
						href="/dashboard/settings"
						className="flex m-1 p-2 hover:bg-default-200 rounded-md gap-2 transition"
					>
						<Settings size={20} />
						Settings
					</Link> */}
					{/* Lang */}
					<Switch
						isSelected={theme === "dark"}
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						size="sm"
						className="mx-3 py-3"
						startContent={<SunIcon />}
						endContent={<MoonIcon />}
					>
						Dark mode
					</Switch>

					<CardBody>
						<div>
							<Button
								onClick={() => signOut()}
								fullWidth
								variant="flat"
								color="danger"
								startContent={<LogOut size={20} />}
							>
								Sign out
							</Button>
						</div>
					</CardBody>
				</Card>
			</PopoverContent>
		</Popover>
	);
}

export default DashNavAvatar;
