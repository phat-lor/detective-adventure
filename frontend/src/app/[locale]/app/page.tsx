"use client";
import TaskCard from "@/components/TasksCard";
import { Task, UserTasks } from "@/types/UserTasks";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	CircularProgress,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
	Skeleton,
	Spinner,
	useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

import { Fragment, useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import { getUserTaskById, getUserTasks, startTask } from "../server";
import { useSession } from "next-auth/react";
import rehypeRaw from "rehype-raw";

import {
	ArrowRightIcon,
	CheckCheckIcon,
	ListStartIcon,
	PlayIcon,
	ScanBarcodeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { useRouter } from "@/lib/navigation";
import Map from "./Map";
import { getLocale } from "next-intl/server";

import {
	usePathname as useRawPathname,
	useSearchParams,
} from "next/navigation";

function LandingPage() {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [selected, setSelected] = useState<string | null>(null);
	const [selectedData, setSelectedData] = useState<Task | null>(null);
	const [data, setData] = useState<UserTasks | null>();
	const { data: session } = useSession({ required: true });
	const [loading, setLoading] = useState(false);
	const route = useRouter();
	const rawPathname = useRawPathname();
	const searchParam = useSearchParams();

	const t = useTranslations("tasks");
	async function fetchData() {
		// console.log(session?.accessToken);
		setLoading(true);
		const locale = rawPathname.split("/")[1];
		if (!locale)
			return toast.error("Locale not found", {
				description: "Locale not found",
			});
		console.log(locale);
		const data = await getUserTasks(session?.accessToken ?? "", locale);
		if (!data) {
			setLoading(false);
			return;
		}
		const processedTasks = data?.data.map((task: Task) => {
			const maxValue = task.locations.length;
			const value = task.locations.filter(
				(location) => location.cleared
			).length;

			const status =
				value === 0
					? "NOT_STARTED"
					: value === maxValue
					? "COMPLETED"
					: "IN_PROGRESS";
			return {
				title: task.title,
				description: task.description,
				id: task.id,
				status: status,
				value: value,
				thumbnails: task.thumbnails,
				maxValue: maxValue,
				locations: task.locations,
			};
		});
		console.log(processedTasks);
		// @ts-ignore
		setData({ data: processedTasks, meta: data.meta });
		setLoading(false);

		const selPlace = searchParam.get("locationId");

		if (selPlace) {
			setSelected(selPlace);
		}
	}

	useEffect(() => {
		fetchData();
	}, [session]);

	useEffect(() => {
		async function fetchTask() {
			if (!selected) {
				return;
			}
			const task = data?.data.find((task) => task.id === selected);
			if (!task) {
				return toast.error("Erm what the sigma?", {
					description: "Task not found",
				});
			}
			console.log(task);

			task.status;

			const calculatedCenter = task.locations
				.reduce(
					(acc, curr) => {
						acc[0] += curr.latitude;
						acc[1] += curr.longitude;
						return acc;
					},
					[0, 0]
				)
				.map((coord) => coord / task.locations.length);

			const latitudes = task.locations.map((location) => location.latitude);
			const longitudes = task.locations.map((location) => location.longitude);
			const latDiff = Math.max(...latitudes) - Math.min(...latitudes);
			const longDiff = Math.max(...longitudes) - Math.min(...longitudes);
			const calculatedZoom = Math.max(latDiff, longDiff);

			console.log(status);
			setSelectedData({
				...task,
				centerDefault: {
					latitude: calculatedCenter[0],
					longitude: calculatedCenter[1],
					placeName: "Center",
					id: "center",
				},
				zoomDefault: 15,
			});
		}
		fetchTask();

		if (selected) {
			onOpen();
		}
	}, [data?.data, onOpen, selected]);

	const handleSelectedClick = async () => {
		switch (selectedData?.status) {
			case "IN_PROGRESS":
			case "STARTED":
				setLoading(true);
				route.push(`/task/${selectedData?.id}`);
				break;
			case "COMPLETED":
				toast.success("Task completed", {
					description: "Task has been completed",
				});
				break;
			case "NOT_STARTED":
				setLoading(true);
				try {
					const res = await startTask(
						session?.accessToken ?? "",
						selectedData?.id ?? ""
					);
					if (!res) {
						return toast.error("Task not started", {
							description: "Task could not be started",
						});
					}
					toast.success("Task started", {
						description: "Task has been started",
					});
					fetchData();
				} catch (e) {
				} finally {
					route.push(`/task/${selectedData?.id}`);
					// setLoading(false);
				}

				break;
		}
	};

	return (
		<main>
			<div className="flex gap-5 items-center justify-center mt-10 flex-col">
				<h1 className="text-4xl font-semibold text-center">{t("title")}</h1>
				{/* loading skelition */}
				{!data?.data && (
					<Spinner size="lg" className="mt-10" label="Hang tight" />
				)}

				<div className="my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 xl:grid-cols-3 ">
					{/* no tasks */}
					{data?.data.map((task) => (
						<TaskCard
							key={task.id}
							title={task.title}
							description={task.description}
							id={task.id}
							status={task.status as any}
							value={task.value || 0}
							maxValue={task.maxValue || 100}
							thumbnail={task.thumbnails?.[0] ?? "https://placehold.co/600x400"}
							setSelected={setSelected}
						/>
					))}
				</div>
			</div>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={() => setSelected(null)}
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<h2 className="text-2xl ">{selectedData?.title}</h2>
							</ModalHeader>
							<ModalBody>
								<div className="flex flex-col gap-3">
									<div className="flex gap-2  flex-col items-start">
										<p className="text-lg font-semibold">Thumbnail</p>
										<Image
											alt={selectedData?.title}
											isLoading={loading}
											src={selectedData?.thumbnails?.[0] ?? ""}
											width={600}
											height={400}
										/>
									</div>
									<div className="flex flex-col gap-1 ">
										<p className="text-lg font-semibold">Description</p>
										{selectedData?.description && (
											// @ts-ignore
											<ReactMarkdown rehypePlugins={[rehypeRaw]}>
												{selectedData.description}
											</ReactMarkdown>
										)}
									</div>
									<div className="flex flex-col gap-1">
										<p className="text-lg font-semibold">Progress</p>
										<div className="justify-between flex items-center">
											<CircularProgress
												size="lg"
												value={selectedData?.value}
												maxValue={selectedData?.maxValue}
												showValueLabel
												color="primary"
											/>
											<p>
												{selectedData?.value}/{selectedData?.maxValue}
											</p>
										</div>
									</div>
									<div className="flex flex-col gap-1">
										<p className="text-lg font-semibold">Locations</p>
										<ScrollShadow
											className="-mx-6 -my-5 flex w-full max-w-full snap-x justify-start gap-6 px-6 py-5"
											orientation="horizontal"
											size={20}
										>
											{selectedData?.locations &&
												selectedData?.locations.map((location) => (
													<Card key={location.id} className="min-w-40">
														<CardHeader>
															<Image
																src={location.thumbnails?.[0]}
																alt={location.placeName}
																width={600}
																height={400}
															/>
														</CardHeader>
														<CardBody className="flex flex-row gap-1 items-center justify-between">
															<p className="text-lg font-semibold">
																{location.placeName}
															</p>
															<Chip
																color={location.cleared ? "success" : "default"}
																className="text-white w-8 h-8"
															>
																{location.cleared ? (
																	<ArrowRightIcon />
																) : (
																	<ListStartIcon />
																)}
															</Chip>
														</CardBody>
													</Card>
													// <div
													// 	key={location.id}
													// 	className="flex gap-2 items-center"
													// >
													// 	<Chip
													// 		color={location.cleared ? "success" : "default"}
													// 		className="text-white"
													// 	>
													// 		{location.cleared ? (
													// 			<ArrowRightIcon />
													// 		) : (
													// 			<ListStartIcon />
													// 		)}
													// 	</Chip>
													// 	<p>{location.placeName}</p>
													// </div>
												))}
										</ScrollShadow>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<p className="text-lg font-semibold">Maps</p>
									<Card className="h-56 w-full rounded-md">
										<Fragment>
											<Map selectedData={selectedData} />
										</Fragment>
									</Card>
									{/* <Map
												apiKey="AIzaSyD1yC-YBtXtul0A4q8M_MvStseu6BXU11A"
												locations={selectedData?.locations}
											/> */}
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									isLoading={loading}
									fullWidth
									color="primary"
									startContent={
										!selectedData ? (
											<PlayIcon />
										) : selectedData.status === "COMPLETED" ? (
											<CheckCheckIcon />
										) : selectedData.status === "NOT_STARTED" ? (
											<PlayIcon />
										) : selectedData?.status === "IN_PROGRESS" ||
										  selectedData?.status === "STARTED" ? (
											<ScanBarcodeIcon />
										) : (
											<PlayIcon />
										)
									}
									isDisabled={
										!selectedData || selectedData.status === "COMPLETED"
									}
									onClick={handleSelectedClick}
								>
									{selectedData?.status === "COMPLETED"
										? "Completed"
										: selectedData?.status === "IN_PROGRESS" ||
										  selectedData?.status === "STARTED"
										? "Continue"
										: "Start"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</main>
	);
}

export default LandingPage;
