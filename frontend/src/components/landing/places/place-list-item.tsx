"use client";

import React from "react";
import { Button, Image, Skeleton } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

export type PlaceListItemColor = {
	name: string;
	hex: string;
};

export type PlaceItem = {
	id: string;
	name: string;
	href: string;
	price: number;
	rating?: number;
	ratingCount?: number;
	description?: string;
	imageSrc: string;
};

export type PlaceListItemProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"id"
> & {
	isPopular?: boolean;
	isLoading?: boolean;
	removeWrapper?: boolean;
} & PlaceItem;

const PlaceListItem = React.forwardRef<HTMLDivElement, PlaceListItemProps>(
	(
		{
			name,
			price,
			rating,
			isLoading,
			description,
			imageSrc,
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
				<Image
					isBlurred
					isZoomed
					alt={name}
					className="aspect-square w-full hover:scale-110"
					isLoading={isLoading}
					src={imageSrc}
				/>

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
									{name}
								</h3>
								{rating !== undefined ? (
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
								) : null}
							</div>
							{description ? (
								<p className="text-small text-default-500">{description}</p>
							) : null}
							<p className="text-small font-medium text-default-500">
								${price}
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
