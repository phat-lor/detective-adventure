"use server";

import { backendApi } from "@/lib/axios";
import { Task } from "@/types";
import { TaskInstance } from "./task/[taskID]/page";
import { AxiosError } from "axios";
import translate from "translate";

translate.key = process.env.TRANSLATE_KEY;

export async function getUserTasks(
	access_token: string,
	locale: string = "en"
) {
	if (!access_token) {
		return;
	}

	const res = await backendApi.get("/users/me/tasks", {
		headers: { Authorization: `Bearer ${access_token}` },
	});

	const processed = await Promise.all(
		res.data.data.map(async (task: Task) => {
			const translated = await translate(task.title, {
				to: locale,
			});

			const description = await translate(task.description, {
				to: locale,
			});

			return { ...task, title: translated, description: description };
		})
	);

	return {
		meta: res.data.meta,
		data: processed,
	};
}

export async function getUserTaskById(access_token: string, id: string) {
	if (!access_token) {
		return;
	}

	const res = await backendApi.get(`/users/me/tasks/${id}`, {
		headers: { Authorization: `Bearer ${access_token}` },
	});

	return res.data as TaskInstance;
}

export async function startTask(access_token: string, id: string) {
	if (!access_token) {
		return;
	}

	const res = await backendApi.post(
		`/users/me/tasks/start/${id}`,
		{},
		{
			headers: { Authorization: `Bearer ${access_token}` },
		}
	);

	return res.data;
}

export async function clearLocation(
	access_token: string,
	taskId: string,
	locationId: string
) {
	if (!access_token) {
		return;
	}
	try {
		const res = await backendApi.post(
			`/users/me/tasks/clear`,
			{
				taskId: taskId,
				locationId: locationId,
			},
			{
				headers: { Authorization: `Bearer ${access_token}` },
			}
		);

		return { ...res.data, ok: true };
	} catch (e) {
		// console.error(e);
		if (e instanceof AxiosError) {
			return { ok: false, error: e.response?.data?.message };
		}
	}
}

export async function fetchTasks(locale: string = "en") {
	const res = await backendApi.get("/tasks?perPage=3");

	const processed = await Promise.all(
		res.data.data.map(async (task: Task) => {
			const translated = await translate(task.title, {
				to: locale,
			});

			const description = await translate(task.description, {
				to: locale,
			});

			return { ...task, title: translated, description: description };
		})
	);
	console.log(processed);
	return processed as Task[];
}
