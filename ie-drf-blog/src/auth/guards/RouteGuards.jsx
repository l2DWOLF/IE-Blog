import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "../../components/common/loadscreen/LoadingScreen";
import { warningMsg } from "../../utils/toastify/toast";
import useAuth from "../hooks/useAuth";


export function GuestRoute({ children }) {
    const {user} = useAuth();
    const isAuthLoading = useSelector(state => state.user.isAuthLoading);
    const toastFired = useRef(false);
    const location = useLocation();

    useEffect(() => {
        if(user?.id && !toastFired.current && !location.state?.fromLogin){
            warningMsg("You're already logged in :)")
            toastFired.current = true;
        }
    }, [user, location.state]);

    if (isAuthLoading) return <LoadingScreen />;

    return user?.id ? <Navigate to="/" /> : children;
}
