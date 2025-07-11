import axiosInstance from './AxiosInstance'
import { handleResponse } from './utils/handleResponse'

export async function getAllComments({ limit = 5_000, offset = 0 }) {
    return axiosInstance.get('comments/', { params: { limit, offset } }).then(handleResponse)
};

export async function getArticleComments(articleId){
    const response = await axiosInstance.get(`articles/${articleId}/comments/`);
    return handleResponse(response);
};

export async function createComment(payload) {
    return axiosInstance.post('comments/', payload).then(handleResponse);
};

export async function updateComment(id, payload) {
    return axiosInstance.put(`comments/${id}/`, payload).then(handleResponse);
};