import axios from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse"

export function userLogin(credentials) {
    return axios.post("http://127.0.0.1:8000/api/auth/login/", credentials).then(handleResponse);
};

export function userLogout(data){
    return axios.post("http://127.0.0.1:8000/api/auth/logout/", {refresh: data.refreshToken}, {
        headers: {
            Authorization: `Bearer ${data.accessToken}`
        }
    }).then(handleResponse)
};

export const userRegistration = async (values) => {
    await axios.post("http://127.0.0.1:8000/api/auth/register/", values).then(handleResponse);
};


