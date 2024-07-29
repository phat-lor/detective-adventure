import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { getUserTaskById } from "../../server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ScanBarcodeIcon } from "lucide-react";
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

export default async function Page({ params }: { params: { taskID: string } }) {
	const session = await getServerSession(authOptions);
	const task = await getUserTaskById(session?.accessToken ?? "", params.taskID);
	// console.log(JSON.stringify(task));

	return (
		<Modal
			className="w-full h-[calc(100vh-4.5rem)]"
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
								{task?.task.locations[0].details}
							</ReactMarkdown>
						)}
					</div>
				</ModalBody>
				<ModalFooter className="flex gap-2 items-center ">
					<Button fullWidth color="primary" startContent={<ScanBarcodeIcon />}>
						Scan
					</Button>
					<CircularProgress
						size="lg"
						value={2}
						maxValue={7}
						showValueLabel
						color="primary"
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
