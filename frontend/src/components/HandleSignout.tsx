"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

function HandleSignout() {
	const { data: session } = useSession();
	useEffect(() => {
		if (session?.errSignOut) {
			signOut();
		}
	}, [session]);

	return null;
}

export default HandleSignout;
