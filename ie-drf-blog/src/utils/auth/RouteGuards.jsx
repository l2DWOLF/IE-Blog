import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { isAccessTokenValid } from "../../utils/auth/tokenUtils";

export function RequireGuest() {
    const { accessToken, isRefreshing, isAppReady } = useSelector((state) => state.user);
    const [blockRender, setBlockRender] = useState(true);
    const [finalIsLoggedIn, setFinalIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!isAppReady || isRefreshing || !accessToken) {
            setBlockRender(true);
        } else {
            const delay = setTimeout(() => {
                const loggedIn = isAccessTokenValid(accessToken);
                setFinalIsLoggedIn(loggedIn);

                console.log("[RequireGuest] Guard Final Check:", {
                    isAppReady,
                    isRefreshing,
                    accessToken,
                    loggedIn,
                });

                setBlockRender(false);
            }, 100);

            return () => clearTimeout(delay);
        }
    }, [isAppReady, isRefreshing, accessToken]);

    if (blockRender) return null;

    if (finalIsLoggedIn) {
        console.log("[RequireGuest] Redirecting to home because user is logged in");
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
