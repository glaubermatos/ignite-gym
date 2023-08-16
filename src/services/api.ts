import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
    baseURL: "http://10.90.22.164:3333",
    // baseURL: "http://10.90.50.104:3333",
    // baseURL: "http://192.168.1.108:3333",
})

api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message))
    } else {
        return Promise.reject(error)
    }
})

export { api }