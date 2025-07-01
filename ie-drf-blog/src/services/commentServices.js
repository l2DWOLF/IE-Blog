import axiosInstance from './AxiosInstance'
import { handleResponse } from './utils/handleResponse'

export async function getAllComments({ limit = 5_000, offset = 0 }) {
    return axiosInstance.get('comments/', { params: { limit, offset } }).then(handleResponse)
};

export async function getArticleComments(articleId){
    const response = await axiosInstance.get(`articles/${articleId}/comments/`);
    return handleResponse(response);
};