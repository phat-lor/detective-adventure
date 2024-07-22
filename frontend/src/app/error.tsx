"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@nextui-org/react";
import { SearchXIcon, ServerCrashIcon, UnplugIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
	const [info, setInfo] = useState({
		host: "...",
		path: "...",
	});
	useEffect(() => {
		setInfo({
			host: window.location.host,
			path: window.location.pathname,
		});
	}, []);
	return (
		// Fall back in english incase anything fails
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Error Occured</title>
				<style>{`
					body {
						background-color: rgb(4, 5, 8);
						color: #aaaaaa;
						font-family: monospace;
						display: flex;
						justify-content: center;
						flex-direction: column;
						align-items: center;
						height: 100vh;
						margin: 0;
						gap: 0.5rem;
					}

					#container {
						display: flex;
						justify-content: center;
						flex-direction: row;
						align-items: center;
						gap: 0.5rem;
					}

		

				`}</style>
			</head>

			<body>
				<div id="container">
					<ServerCrashIcon size={50} />
					<h1>|</h1>
					{error.message || "An error occurred"}
					<br />
					{"Host: " + info.host}
					<br />
					{"Path: " + info.path}
				</div>
				<Link href="/">Go back to home</Link>
				<Link href="#" onClick={reset}>
					Retry
				</Link>
			</body>
		</html>
	);
};

export default Error;
