"use client";
import { Task } from "@/types";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CircularProgress,
} from "@nextui-org/react";

export default function TaskCatd({ task }: { task: Task }) {
	<Card className="w-full h-[calc(100vh-4rem)]">
		<CardHeader className="text-4xl font-semibold">{task.title}</CardHeader>
		<CardBody>{task.description}</CardBody>
		<CardFooter className="flex gap-2">
			<Button fullWidth color="primary">
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
	</Card>;
}
