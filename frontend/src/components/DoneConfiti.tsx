"use client";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function DoneConfiti() {
	const searchParams = useSearchParams();
	useEffect(() => {
		// check query params
		if (searchParams.get("done") === "true") {
			toast.success("Task Completed", {
				description: "You have successfully completed the task",
			});

			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});

			const searchParams = new URLSearchParams(window.location.search);
			searchParams.delete("done");
			window.history.replaceState(
				{},
				"",
				window.location.pathname + "?" + searchParams.toString()
			);
		}
	}, [searchParams]);

	return null;
}

export default DoneConfiti;
