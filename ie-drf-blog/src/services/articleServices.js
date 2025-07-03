import axiosInstance from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse";


export function getArticles({limit = 5, offset = 0}){
    return axiosInstance.get('articles/', {params:{limit, offset}}).then(handleResponse);
}

export function getArticle(id){
    return axiosInstance.get(`articles/${id}`).then(handleResponse);
}

export function createArticle(payload){
    return axiosInstance.post('articles/', payload).then(handleResponse);
}

export function updateArticle(id, payload){
    return axiosInstance.put(`articles/${id}/`, payload).then(handleResponse);
}

export function deleteArticle(id){
    return axiosInstance.delete(`articles/${id}/`).then(handleResponse);
}