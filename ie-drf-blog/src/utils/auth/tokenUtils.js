import { jwtDecode } from "jwt-decode";

export function isAccessTokenValid(token) {
    if (!token) {
        console.log("[TokenUtils] Token missing");
        return false;
    }

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        const valid = decoded.exp > now;

        console.log("[TokenUtils] isAccessTokenValid:", {
            decoded,
            now,
            exp: decoded.exp,
            valid,
        });

        return valid;
    } catch (e) {
        console.warn("[TokenUtils] Failed to decode token:", e);
        return false;
    }
}
