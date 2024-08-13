"use client";

import React, { useEffect } from "react";
import { Button, Switch } from "@nextui-org/react";

import { cn } from "@/lib/utils";
import PlaceListItem from "./place-list-item";
import { Task } from "@/types";
import { fetchTasks } from "@/app/[locale]/server";
import { SearchIcon } from "lucide-react";

export default function PlacesList({ className }: { className?: string }) {
	const [isLoading, setIsLoading] = React.useState(true);
	const [places, setPlaces] = React.useState<Task[]>([]);
	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const res = await fetchTasks();
				console.log(res);
				setPlaces(res);
				setIsLoading(false);
				console.log(places);
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
					Trips
				</h2>
				<p className="text-gray-500">Here are some of the trips</p>
			</div>
			<div
				className={cn(
					"grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3",
					className
				)}
			>
				{places.map((place) => (
					<PlaceListItem key={place.id} {...place} isLoading />
				))}
			</div>
			<div className="flex justify-center items-center">
				<Button startContent={<SearchIcon />}>Explore More</Button>
			</div>
		</div>
	);
}
