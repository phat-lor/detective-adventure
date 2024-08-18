import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import LocationsTable from "./LocTable";

export default async function Page() {
	const session = await getServerSession(authOptions);

	if (session?.user.role !== "ADMIN")
		throw new Error("You are not authorized to access this page");

	return (
		<div className="mt-10 flex flex-col gap-4">
			<div className="flex flex-row justify-between items-center">
				<p className="text-xl font-semibold">Locations</p>
			</div>
			<LocationsTable />
		</div>
	);
}
