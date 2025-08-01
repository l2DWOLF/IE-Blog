import { errorMsg, warningMsg } from "../toastify/toast";

export const handleException = (err, options = { toast: true, alert: true }) => {
    let msg = `Unknown error occurred (fallback message) ${err}`;

    const data = err?.response?.data;
    console.error("Full Error Response: ", err?.response?.data);

    if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        msg = 'Connection failed. Please check your internet or try again later.';
    }
    if (typeof data?.backend_error === "string") {
        msg = data.backend_error;
    } else if (Array.isArray(data?.backend_error)) {
        msg = data.backend_error[0];
    } else if (Array.isArray(data?.non_field_errors)) {
        msg = data.non_field_errors[0];
    } else if (typeof data?.detail === "string") {
        msg = data.detail;
    } else if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) {
            msg = `${firstKey}: ${data[firstKey][0]}`;
        }
    }

    if (options.toast !== false){ 
        if(options.alert === true) {
        warningMsg(msg);
        console.warn(msg);
        }
        else{
        errorMsg(msg);
        console.error(msg);
        }
    } 
    return msg;
};