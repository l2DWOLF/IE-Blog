import axios from "axios"

function handleResponse(response){
    if(response.status >= 200 && response.status < 300){
        if(response.data.error){
            throw new Error(response.data.error)
        }
        return response.data
    }
    throw new Error(`HTTP Error - Status: ${response.status}`);
}

export function getAllArticles(){
    return axios.get('http://127.0.0.1:8000/api/articles').then(handleResponse);
}