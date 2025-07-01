import axiosInstance from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse";


export function getArticles({limit = 5, offset = 0}){
    return axiosInstance.get('articles/', {params:{limit, offset}}).then(handleResponse);
}

export function createArticle(payload){
    return axiosInstance.post('articles/', payload).then(handleResponse);
}