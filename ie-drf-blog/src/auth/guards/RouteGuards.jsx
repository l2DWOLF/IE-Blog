import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../components/common/loadscreen/LoadingScreen";
import { warningMsg } from "../../utils/toastify/toast";

export function GuestRoute({ children }) {
    const user = useSelector(state => state.user.user);
    const isAuthLoading = useSelector(state => state.user.isAuthLoading);
    const toastFired = useRef(false);

    useEffect(() => {
        if(user?.id && !toastFired.current){
            warningMsg("You're already logged in :)")
            toastFired.current = true;
        }
    }, [user]);

    if (isAuthLoading) return <LoadingScreen />;

    return user?.id ? <Navigate to="/" /> : children;
}
