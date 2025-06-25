import axios from './AxiosInstance'
import { handleResponse } from './utils/handleResponse'

export async function getAllComments(){
    let allComments = [];
    let nextUrl = "comments/"

    while (nextUrl) {
        const response = await axios.get(nextUrl);
        const data = handleResponse(response);
        
        allComments = [...allComments, ...data.results]
        nextUrl = data.next;
    }
    return allComments;
};

export async function getArticleComments(articleId){
    const response = await axios.get(`articles/${articleId}/comments/`);
    return handleResponse(response);
};