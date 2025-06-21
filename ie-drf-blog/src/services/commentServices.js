import axios from 'axios'
import { handleResponse } from './utils/handleResponse'

export async function getAllComments(){
    let allComments = [];
    let nextUrl = "http://127.0.0.1:8000/api/comments/"

    while (nextUrl) {
        const response = await axios.get(nextUrl);
        const data = handleResponse(response);
        
        allComments = [...allComments, ...data.results]
        nextUrl = data.next;
    }
    return allComments;
}