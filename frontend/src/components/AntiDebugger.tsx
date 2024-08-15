"use client";

import { useEffect } from "react";

function AntiDebugger() {
	useEffect(() => {
		if (process.env.NODE_ENV == "development") return;
		const z = () =>
				Promise.all([
					(() => {
						let e = performance.now();
						return new Promise((t) => {
							requestAnimationFrame(() => {
								let n = performance.now();
								t(n - e > 100);
							});
						});
					})(),
					Promise.resolve(
						(() => {
							let e = window.outerWidth - window.innerWidth > 160,
								t = window.outerHeight - window.innerHeight > 160;
							return e || t;
						})()
					),
				]).then(([e, t]) => e || t),
			asd = () => {
				eval("console.log('Halo Debugger!')");
				eval("debugger;");
			},
			dssd = () => {
				window.addEventListener("contextmenu", (e) => e.preventDefault()),
					window.addEventListener("keydown", (e) => {
						(123 === e.keyCode ||
							(e.ctrlKey && e.shiftKey && 73 === e.keyCode) ||
							(e.ctrlKey && e.shiftKey && 74 === e.keyCode) ||
							(e.ctrlKey && 85 === e.keyCode) ||
							(e.ctrlKey && e.shiftKey && 67 === e.keyCode)) &&
							e.preventDefault();
					}),
					window.addEventListener("keyup", (e) => {
						123 === e.keyCode && e.preventDefault();
					});
			},
			dss = () => {
				z().then((e) => {
					e && asd();
				}),
					setInterval(() => {
						z().then((e) => {
							e && asd();
						});
					}, 1e3),
					window.addEventListener("devtoolschange", () => asd());
			};
		dssd(), dss();
	}, []);
	return null;
}

export default AntiDebugger;
