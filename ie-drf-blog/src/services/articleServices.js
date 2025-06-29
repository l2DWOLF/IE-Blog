import axiosInstance from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse";


export function getAllArticles(){
    return axiosInstance.get('articles/').then(handleResponse);
}
