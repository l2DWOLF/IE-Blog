import axios from "axios"
import { handleResponse } from "./utils/handleResponse";


export function getAllArticles(){
    return axios.get('http://127.0.0.1:8000/api/articles').then(handleResponse);
}
