"use client";

import React, { useEffect } from "react";
import { Button, Switch } from "@nextui-org/react";

import { cn } from "@/lib/utils";
import PlaceListItem from "./place-list-item";
import { Task } from "@/types";
import { fetchTasks } from "@/app/[locale]/server";
import { SearchIcon } from "lucide-react";
import { usePathname as useRawPathname } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

export default function PlacesList({ className }: { className?: string }) {
	const [isLoading, setIsLoading] = React.useState(true);
	const [places, setPlaces] = React.useState<Task[]>([]);
	const rawPathname = useRawPathname();

	const t = useTranslations("landing");
	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const locale = rawPathname.split("/")[1];
				if (!locale)
					return toast.error("Locale not found", {
						description: "Locale not found",
					});
				const res = await fetchTasks(locale);
				console.log(res);
				setPlaces(res);
				setIsLoading(false);
			} catch (err) {
				console.error(err);
			}
		};
		fetchPlaces();
	}, []);

	return (
		<div className="my-auto flex h-full w-full max-w-7xl flex-col gap-2 p-4">
			<div className="py-4 flex justify-center flex-col items-center">
				<h2 className="text-2xl font-light tracking-tighter sm:text-3xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty">
					{t("places.title")}
				</h2>
				<p className="text-gray-500">{t("places.subtitle")}</p>
			</div>
			<div
				className={cn(
					"grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3",
					className
				)}
			>
				{places.map((place) => (
					<PlaceListItem key={place.id} {...place} isLoading={isLoading} />
				))}
			</div>
			<div className="flex justify-center items-center">
				{/* <Button startContent={<SearchIcon />}>{t("places.explore")}</Button> */}
				<Link href={`/app`} className="underline flex flex-row items-center">
					<SearchIcon className="mr-1" size={20} />
					{t("places.explore")}
				</Link>
			</div>
		</div>
	);
}
