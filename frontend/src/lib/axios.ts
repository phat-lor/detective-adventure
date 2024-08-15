import axios from "axios";

const BASE_URL = process.env.BACKEND_ENDPOINT;

const backendApi = axios.create({
	baseURL: BASE_URL + "/v1",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export { backendApi };
