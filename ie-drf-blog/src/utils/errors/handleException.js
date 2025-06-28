import { errorMsg, warningMsg } from "../toastify/toast";

export const handleException = (err, options = { toast: true, alert: true }) => {
    let msg = "Unknown error occurred (fallback message)";

    const data = err?.response?.data;

    if (Array.isArray(data?.backend_error)) {
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