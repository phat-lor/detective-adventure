"use client";

import React from "react";
import { Button, Image, Skeleton } from "@nextui-org/react";

import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { MapPinnedIcon } from "lucide-react";
import { Link } from "@/lib/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
export type PlaceListItemColor = {
	name: string;
	hex: string;
};

export type PlaceListItemProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"id"
> & {
	isPopular?: boolean;
	isLoading?: boolean;
	removeWrapper?: boolean;
} & Task;

const PlaceListItem = React.forwardRef<HTMLDivElement, PlaceListItemProps>(
	(
		{
			id,
			title,
			locations,
			isLoading,
			description,
			thumbnails,
			removeWrapper,
			className,
			...props
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					"relative flex w-full flex-none flex-col gap-3",
					{
						"rounded-none bg-background shadow-none": removeWrapper,
					},
					className
				)}
				{...props}
			>
				<Link href={`/app/?locationId=${id}`}>
					<Image
						isBlurred
						isZoomed
						alt={title}
						className="aspect-square w-full hover:scale-110"
						isLoading={isLoading}
						src={thumbnails?.[0] ?? "https://placehold.co/600x400"}
						width={600}
						height={400}
					/>
				</Link>

				<div className="mt-1 flex flex-col gap-2 px-1">
					{isLoading ? (
						<div className="my-1 flex flex-col gap-3">
							<Skeleton className="w-3/5 rounded-lg">
								<div className="h-3 w-3/5 rounded-lg bg-default-200" />
							</Skeleton>
							<Skeleton className="mt-3 w-4/5 rounded-lg">
								<div className="h-3 w-4/5 rounded-lg bg-default-200" />
							</Skeleton>
							<Skeleton className="mt-4 w-2/5 rounded-lg">
								<div className="h-3 w-2/5 rounded-lg bg-default-300" />
							</Skeleton>
						</div>
					) : (
						<>
							<div className="flex items-start justify-between gap-1">
								<h3 className="text-small font-medium text-default-700">
									{title}
								</h3>
								{/* {rating !== undefined ? (
									<div className="flex items-center gap-1">
										<Icon
											className="text-default-500"
											icon="solar:star-bold"
											width={16}
										/>
										<span className="text-small text-default-500">
											{rating}
										</span>
									</div>
								) : null} */}
							</div>
							{description ? (
								<p className="text-small text-default-500">
									{
										// @ts-ignore
										<ReactMarkdown rehypePlugins={[rehypeRaw]}>
											{/* only show first 100 character  xs */}
											{description.length > 100
												? description.slice(0, 100) + "..."
												: description}
										</ReactMarkdown>
									}
								</p>
							) : null}
							<p className="text-small font-medium text-default-500 flex-row flex items-center gap-1">
								<MapPinnedIcon /> {locations.length}
							</p>
						</>
					)}
				</div>
			</div>
		);
	}
);

PlaceListItem.displayName = "PlaceListItem";

export default PlaceListItem;
