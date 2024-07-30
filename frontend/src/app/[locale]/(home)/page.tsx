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
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
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

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { useRouter } from "@/lib/navigation";
function LandingPage() {
	const t = useTranslations("landing");
	const strings = t("description_type", { returnObjects: true }).split(",");
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [selected, setSelected] = useState<string | null>(null);
	const [selectedData, setSelectedData] = useState<Task | null>(null);
	const [data, setData] = useState<UserTasks | null>();
	const { data: session } = useSession({ required: true });
	const [loading, setLoading] = useState(false);
	const route = useRouter();
	async function fetchData() {
		// console.log(session?.accessToken);
		setLoading(true);
		const data = await getUserTasks(session?.accessToken ?? "");
		if (!data) {
			setLoading(false);
			return;
		}
		const processedTasks = data?.data.map((task: Task) => {
			const maxValue = task.locations.length;
			const value = task.locations.filter(
				(location) => location.cleared
			).length;
			return {
				title: task.title,
				description: task.description,
				id: task.id,
				status: task.status,
				value: value,
				maxValue: maxValue,
				locations: task.locations,
			};
		});
		console.log(processedTasks);
		setData({ data: processedTasks, meta: data.meta });
		setLoading(false);
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

			setSelectedData({
				...task,
				centerDefault: {
					latitude: calculatedCenter[0],
					longitude: calculatedCenter[1],
					placeName: "Center",
					id: "center",
				},
				zoomDefault: 100,
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
				break;
		}
	};

	return (
		<main>
			<div className="flex gap-5 items-center justify-center mt-10 flex-col">
				<h1 className="text-4xl font-semibold text-center">📌Tasks</h1>
				{/* loading skelition */}
				{!data?.data && (
					<Spinner size="lg" className="mt-10" label="Hang tight" />
				)}

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
						setSelected={setSelected}
					/>
				))}
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
										{selectedData?.locations &&
											selectedData?.locations.map((location) => (
												<div
													key={location.id}
													className="flex gap-2 items-center"
												>
													<Chip
														color={location.cleared ? "success" : "default"}
														className="text-white"
													>
														{location.cleared ? (
															<ArrowRightIcon />
														) : (
															<ListStartIcon />
														)}
													</Chip>
													<p>{location.placeName}</p>
												</div>
											))}
									</div>
									<div className="flex flex-col gap-1">
										<p className="text-lg font-semibold">Maps</p>
										<Card className="h-56 w-full rounded-md">
											<MapContainer
												center={[
													selectedData?.centerDefault?.latitude || 0,
													selectedData?.centerDefault?.longitude || 0,
												]}
												zoom={selectedData?.zoomDefault || 13}
												// center={[51.505, -0.09]}
												// calculated center
												// zoom={13}
												// calculated zoom
												scrollWheelZoom={false}
												style={{ height: "100%", width: "100%" }}
											>
												<TileLayer
													attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
													url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
												/>
												{/* <Marker position={[51.505, -0.09]}>
														<Popup>
															A pretty CSS3 popup. <br /> Easily customizable.
														</Popup>
													</Marker> */}
												{selectedData?.locations.map((location) => (
													<Marker
														key={location.id}
														position={[location.latitude, location.longitude]}
													>
														<Popup>{location.placeName}</Popup>
													</Marker>
												))}
											</MapContainer>
										</Card>
										{/* <Map
												apiKey="AIzaSyD1yC-YBtXtul0A4q8M_MvStseu6BXU11A"
												locations={selectedData?.locations}
											/> */}
									</div>
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
