"use client";

import { SearchXIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Custom404() {
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
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Not Found</title>
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
					<SearchXIcon size={50} />
					<h1>|</h1>
					404 This resource could not be found
					<br />
					{"Host: " + info.host}
					<br />
					{"Path: " + info.path}
					<br />
				</div>
				<Link href="/">Go back to home</Link>
			</body>
		</html>
	);
}
