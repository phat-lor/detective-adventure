import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CircularProgress,
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
		<Card className="w-full h-[calc(100vh-4rem)]">
			<CardHeader className="text-3xl font-bold">{task?.task.title}</CardHeader>
			<CardBody className="prose lg:prose-xl w-xl">
				{task && (
					// @ts-ignore
					<ReactMarkdown rehypePlugins={[rehypeRaw]}>
						{task?.task.locations[0].details}
					</ReactMarkdown>
				)}
			</CardBody>
			<CardFooter className="flex gap-2 h-full items-center">
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
			</CardFooter>
		</Card>
	);
}
