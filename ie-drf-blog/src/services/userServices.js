import axios from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse"

export function userLogin(credentials) {
    return axios.post("http://127.0.0.1:8000/api/auth/login/", credentials).then(handleResponse);
};




