import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { SetToken, SetUser, Signoff, SetAuthLoading } from "../redux/UserState";
import store from "../redux/store";
import { handleException } from "../utils/errors/handleException";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL
});

let refreshPromise = null;

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = store.getState().user.accessToken || sessionStorage.getItem("access_token");
        const refreshToken = store.getState().user.refreshToken || sessionStorage.getItem("refresh_token");

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    if (refreshToken) {
                        if (!refreshPromise) {
                            store.dispatch(SetAuthLoading(true));
                            refreshPromise = axios.post(
                                `${baseURL}/token/refresh/`,
                                { refresh: refreshToken },
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            ).then(response => {
                                const newAccessToken = response.data.access;
                                const newRefreshToken = response.data.refresh;
                                const decodedUser = jwtDecode(newAccessToken);

                                store.dispatch(SetToken(newAccessToken, newRefreshToken));
                                store.dispatch(SetUser(decodedUser));
                                return newAccessToken;
                            }).catch(err => {
                                console.error("[AxiosInstance] Token Refresh Failed:", err);
                                store.dispatch(Signoff());
                                throw err;
                            }).finally(() => {
                                refreshPromise = null;
                                store.dispatch(SetAuthLoading(false));
                            });
                        }
                        const newAccessToken = await refreshPromise;
                        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return config;
                    } else {
                        console.warn("[AxiosInstance] No refresh token available. Please re-login.");
                    }
                } else {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
            } catch (err) {
                handleException(err, { toast: true, alert:true });
                store.dispatch(Signoff());
            }
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
export default axiosInstance;