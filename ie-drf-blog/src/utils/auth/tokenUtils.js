import { jwtDecode } from "jwt-decode";

export function isAccessTokenValid(token) {
    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        const valid = decoded.exp > now;
        return valid;
    } catch (e) {
        console.warn("[TokenUtils] Failed to decode token:", e);
        return false;
    }
}
