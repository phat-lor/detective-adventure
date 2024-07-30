import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CircularProgress,
	Divider,
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
interface Task {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	locations: Location[];
}

interface Location {
	id: string;
	createdAt: string;
	updatedAt: string;
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

	const task = await getUserTaskById(session?.accessToken ?? "", params.taskID);

	// get uncleared locations
	const unclearedLocations = task?.task.locations.filter(
		(location) =>
			!task.clearedLocations.find(
				(cleared) => cleared.taskLocationId === location.id
			)
	);

	console.log(task?.clearedLocations);

	console.log(unclearedLocations);

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
				<ModalHeader className="text-2xl font-bold">
					{task?.task.title}
				</ModalHeader>
				<ModalBody>
					<div className="prose w-xl ">
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
					{task && <TaskScan task={task} />}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
