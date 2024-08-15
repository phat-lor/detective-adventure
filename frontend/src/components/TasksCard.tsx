import React from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Chip,
	CircularProgress,
	Button,
	Image,
} from "@nextui-org/react";
import {
	CheckIcon,
	ScanSearchIcon,
	EllipsisIcon,
	ArrowRightIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type Status = "NOT_STARTED" | "STARTED" | "IN_PROGRESS" | "COMPLETED";
type Color =
	| "success"
	| "warning"
	| "danger"
	| "default"
	| "primary"
	| "secondary";

const STATUS_INFO: Record<Status, { icon: JSX.Element; color: Color }> = {
	NOT_STARTED: { icon: <ScanSearchIcon />, color: "default" },
	STARTED: { icon: <ScanSearchIcon />, color: "default" },
	IN_PROGRESS: { icon: <EllipsisIcon />, color: "primary" },
	COMPLETED: { icon: <CheckIcon />, color: "success" },
};

interface TaskCardProps {
	title: string;
	description: string;
	thumbnail: string;
	id: string;
	status: Status;
	value: number;
	maxValue: number;
	setSelected: (value: string | null) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
	title,
	description,
	thumbnail,
	id,
	status,
	value,
	maxValue,
	setSelected,
}) => (
	<Card fullWidth>
		<Image
			src={thumbnail}
			alt={title}
			className="rounded-none object-cover max-h-60"
			width={600}
			height={400}
		/>
		<CardHeader className="flex justify-between">
			<p className="font-semibold text-xl">{title}</p>
			<Chip color={STATUS_INFO[status].color} className="text-white">
				{STATUS_INFO[status].icon}
			</Chip>
		</CardHeader>
		<CardBody>
			{
				// @ts-ignore
				<ReactMarkdown rehypePlugins={[rehypeRaw]}>
					{/* only show first 100 character  xs */}
					{description.length > 100
						? description.slice(0, 100) + "..."
						: description}
				</ReactMarkdown>
				// description.split(" ").slice(0, 10).join(" ") + "..."
			}
		</CardBody>
		<CardFooter className="justify-between">
			<CircularProgress
				size="lg"
				value={value}
				maxValue={maxValue}
				showValueLabel
				color={STATUS_INFO[status].color}
			/>
			<Button isIconOnly color="primary" onClick={() => setSelected(id)}>
				<ArrowRightIcon />
			</Button>
		</CardFooter>
	</Card>
);

export default TaskCard;
