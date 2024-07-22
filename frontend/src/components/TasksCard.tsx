import React from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Chip,
	CircularProgress,
	Button,
} from "@nextui-org/react";
import {
	CheckIcon,
	ScanSearchIcon,
	EllipsisIcon,
	ArrowRightIcon,
} from "lucide-react";

const statusIcons = {
	success: <CheckIcon />,
	inProgress: <ScanSearchIcon />,
	await: <EllipsisIcon />,
};

const statusColors = {
	success: "success",
	inProgress: "warning",
	await: "danger",
};

interface TaskCardProps {
	status: "success" | "inProgress" | "await";
	value: number;
	maxValue: number;
}

const TaskCard = ({ status, value, maxValue }: TaskCardProps) => {
	const statusText = {
		success: "Task Success",
		inProgress: "Task In Progress",
		await: "Task Not Checked",
	};

	return (
		<Card className="min-w-full">
			<CardHeader>
				<div className="flex w-full justify-between">
					<p className="font-semibold text-xl">{statusText[status]}</p>
					<Chip
						color={
							statusColors[status] as
								| "success"
								| "warning"
								| "danger"
								| "default"
								| "primary"
								| "secondary"
						}
						className="text-white"
					>
						{statusIcons[status]}
					</Chip>
				</div>
			</CardHeader>
			<CardBody>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</p>
			</CardBody>
			<CardFooter className="justify-between">
				<CircularProgress
					size="lg"
					value={value}
					maxValue={maxValue}
					showValueLabel
					color={
						statusColors[status] as
							| "success"
							| "warning"
							| "danger"
							| "default"
							| "primary"
							| "secondary"
					}
				/>
				<Button isIconOnly color="primary">
					<ArrowRightIcon />
				</Button>
			</CardFooter>
		</Card>
	);
};

export default TaskCard;
