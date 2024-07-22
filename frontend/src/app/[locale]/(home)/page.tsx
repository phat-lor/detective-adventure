"use client";
import TaskCard from "@/components/TasksCard";
import TestAuth from "@/components/TestAuth";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	CircularProgress,
	Image,
} from "@nextui-org/react";
import {
	ArrowRightIcon,
	CheckCheckIcon,
	CheckIcon,
	EllipsisIcon,
	ScanSearchIcon,
	XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Typewriter from "typewriter-effect";

function LandingPage() {
	const t = useTranslations("landing");
	const strings = t("description_type", { returnObjects: true }).split(",");

	return (
		<main>
			<div className="flex gap-5 items-center justify-center mt-10 flex-col">
				<h1 className="text-4xl font-semibold text-center">📌Objectives</h1>
				{/* Success */}
				<TaskCard status="success" value={100} maxValue={100} />
				{/* In Progress */}
				<TaskCard status="inProgress" value={50} maxValue={100} />
				{/* Await */}
				<TaskCard status="await" value={0} maxValue={100} />
			</div>
		</main>
	);
}

export default LandingPage;
