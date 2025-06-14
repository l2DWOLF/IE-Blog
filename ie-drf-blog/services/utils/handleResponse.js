

export function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        if (response.data.error) {
            throw new Error(response.data.error)
        }
        return response.data
    }
    throw new Error(`HTTP Error - Status: ${response.status}`);
}