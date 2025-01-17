import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CircularProgress,
	Divider,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { clearLocation, getUserTaskById } from "../../server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ScanBarcodeIcon } from "lucide-react";
import TaskScan from "@/components/TaskScan";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import LangugeSwitcher from "@/components/locale/LangSwitcher";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
interface Task {
	id: string;
	createdAt: string;
	updatedAt: string;
	thumbnails: string[];
	title: string;
	description: string;
	locations: Location[];
}

interface Location {
	id: string;
	createdAt: string;
	updatedAt: string;
	thumbnails: string[];
	placeName: string;
	details: string;
	latitude: number;
	longitude: number;
	taskId: string;
}

export interface TaskInstance {
	id: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	taskId: string;
	status: string;
	clearedLocations: any[]; // You can replace 'any' with the specific type if known
	task: Task;
}

export default async function Page({
	params,
	searchParams,
}: {
	params: { taskID: string };
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const session = await getServerSession(authOptions);
	const locale = await getLocale();

	const task = await getUserTaskById(
		session?.accessToken ?? "",
		params.taskID,
		locale
	);

	// get uncleared locations
	const unclearedLocations = task?.task.locations.filter(
		(location) =>
			!task.clearedLocations.find(
				(cleared) => cleared.taskLocationId === location.id
			)
	);

	// console.log(task?.clearedLocations);

	// console.log(unclearedLocations);

	return (
		<Modal
			className="w-full h-[calc(100vh-0.5rem)] max-h-[calc(100%-1.5rem)]"
			isOpen={true}
			scrollBehavior="inside"
			hideCloseButton
			backdrop="transparent"
			size="xl"
		>
			<ModalContent>
				<ModalHeader className="text-2xl font-bold flex justify-between">
					{task?.task.title}
					<div>
						<LangugeSwitcher />
					</div>
				</ModalHeader>
				<ModalBody>
					<Image
						src={unclearedLocations?.[0]?.thumbnails?.[0]}
						alt={task?.task.title}
						width={600}
					/>
					<div className="prose w-xl dark:prose-invert">
						{task && (
							// @ts-ignore
							<ReactMarkdown rehypePlugins={[rehypeRaw]}>
								{unclearedLocations?.[0]?.details ?? ""}
							</ReactMarkdown>
						)}
					</div>
				</ModalBody>
				<Divider />
				<ModalFooter className="flex gap-2 items-center ">
					{task && (
						<TaskScan
							task={task}
							curLocationID={unclearedLocations?.[0]?.id ?? ""}
						/>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
