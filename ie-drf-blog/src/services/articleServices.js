import axios from "./AxiosInstance"
import { handleResponse } from "./utils/handleResponse";


export function getAllArticles(){
    return axios.get('articles/').then(handleResponse);
}
