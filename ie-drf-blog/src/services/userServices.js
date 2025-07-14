import axios from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse"

const authURL = import.meta.env.VITE_API_AUTH_URL;

export async function userLogin(credentials) {
    return axios.post(`${authURL}/login/`, credentials).then(handleResponse);
};

export async function userLogout(data){
    return axios.post(`${authURL}/logout/`, {refresh: data.refreshToken}, {
        headers: {
            Authorization: `Bearer ${data.accessToken}`
        }
    }).then(handleResponse)
};

export const userRegistration = async (values) => {
    await axios.post(`${authURL}/register/`, values).then(handleResponse);
};

export const getUserProfile = async (id) => {
    return await axios.get(`/userprofiles/${id}`).then(handleResponse);
};
