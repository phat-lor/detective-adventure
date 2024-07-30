"use client";

import { clearLocation } from "@/app/[locale]/server";
import { TaskInstance } from "@/app/[locale]/task/[taskID]/page";
import { usePathname, useRouter } from "@/lib/navigation";
import { Task } from "@/types/UserTasks";
import {
	Button,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { ScanBarcodeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TaskScan({ task }: { task: TaskInstance }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const urlPath = usePathname();
	const router = useRouter();
	const { data: session } = useSession({ required: true });
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (task.status === "COMPLETED") {
			onClose();
			router.push("/?done=true");
		}
	}, [onClose, router, task]);

	const onScanQRCode = async (result: IDetectedBarcode[]) => {
		setLoading(true);
		const value = result[0].rawValue;
		// the value is url + ?locationId=locationId get the locationId and ad it to the query
		try {
			console.log(task);
			console.log(value);
			const url = new URL(value);
			const locationId = url.searchParams
				.get("locationId")
				?.toString()
				.replace(/\s/g, "");
			const verified = await clearLocation(
				session?.accessToken ?? "",
				task.task.id,
				locationId ?? ""
			);

			console.log(verified);

			if (verified.ok) {
				toast.success("QR Code Scanned", {
					description: "The QR Code scanned is valid",
				});
				router.push(`${urlPath}?locationId=${locationId}`);
			} else {
				toast.error("Invalid QR Code", {
					description: verified.error,
				});
			}
		} catch (e) {
			toast.error("Invalid QR Code", {
				description: "The QR Code scanned is invalid (Error)",
			});
			console.error(e);
		}
		onClose();
		setLoading(false);
	};
	return (
		<>
			<div className="flex flex-row w-full items-center justify-center gap-2">
				<Button
					fullWidth
					color="primary"
					startContent={<ScanBarcodeIcon />}
					onClick={onOpen}
				>
					Scan
				</Button>
				<CircularProgress
					size="lg"
					value={task.clearedLocations.length}
					maxValue={task.task.locations.length}
					showValueLabel
					color="primary"
				/>
			</div>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Scan QR Code
							</ModalHeader>
							<ModalBody>
								{loading ? (
									<CircularProgress
										color="primary"
										size="lg"
										label="hang tight..."
									/>
								) : (
									<Scanner onScan={(result) => onScanQRCode(result)} />
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
