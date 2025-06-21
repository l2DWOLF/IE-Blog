import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/"
});

axiosInstance.interceptors.request.use(
    async (config) => {
    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                if (refreshToken) {
                    try {
                        const response = await axios.post(
                            "http://127.0.0.1:8000/api/token/refresh/",
                            { refresh: refreshToken },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        const newAccessToken = response.data.access;
                        const newRefreshToken = response.data.refresh;
                        const decodedUser = jwtDecode(newAccessToken);

                        sessionStorage.setItem("access_token", newAccessToken);
                        sessionStorage.setItem("user", JSON.stringify(decodedUser));
                        if (newRefreshToken) {
                            sessionStorage.setItem("refresh_token", newRefreshToken);
                        }

                        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    } catch (err) {
                        console.error("[AxiosInstance] Token Refresh Failed:", err);
                        sessionStorage.clear();
                        throw err;
                    }
                } else {
                    console.warn("[AxiosInstance] No refresh token available. Please re-login");
                }
            } else {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
        } catch (decodeErr) {
            console.error("[AxiosInstance] Failed to decode access token:", decodeErr);
            sessionStorage.clear();
        }
    }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
export default axiosInstance;