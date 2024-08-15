import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { backendApi } from "@/lib/axios";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

export default async function Page({
	params,
	searchParams,
}: {
	params: { taskID: string };
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	if (!params.taskID || !searchParams?.locationIndex) {
		return <div>Invalid parameters</div>;
	}
	const headersList = headers();

	const baseUrl = headersList.get("host");
	try {
		const qr = await backendApi.post(`/tasks/${params.taskID}/qr-code`, {
			baseUrl:
				(process.env.NODE_ENV === "production" ? "https://" : "http://") +
				baseUrl,
			locationIndex: searchParams?.locationIndex,
		});

		return (
			<div>
				<img src={qr.data.imageUrl} alt="QR Code" />
			</div>
		);
	} catch (e) {
		if (e instanceof AxiosError) {
			console.log(e.response?.data);
		}
	}
}
