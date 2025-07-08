import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "../../components/common/loadscreen/LoadingScreen";
import { infoMsg, warningMsg } from "../../utils/toastify/toast";
import useAuth from "../hooks/useAuth";


export function GuestRoute({ children }) {
    const {user, isAuthLoading} = useAuth();
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
};

export function AuthRoute({ roles = [], children }){
    const { user } = useAuth();
    const toastFired = useRef(false);
    const location = useLocation();

    const roleMatched = roles.some((role) => {
        if (role === "admin") return user?.is_admin;
        if (role === "mod") return user?.is_mod;
        if (role === "user") return (!!user?.id);
        return false
    })

    useEffect(() => {
        if (!user?.id && !toastFired.current) {
            warningMsg("You don't have permissions to view this page - Please login or register to continue");
            toastFired.current = true;
        }
        else if (!roleMatched && !toastFired.current) {
            warningMsg("You don't have permission to view this page.")
            toastFired.current = true;
        }
    }, [user.id, roleMatched]);

    if (!user?.id) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    if (!roleMatched) {
        return <Navigate to="/" />;
    };

    return children;
};

export function RoleRoute({ roles = [], children}){
    const { user } = useAuth();
    const toastFired = useRef(false);
    const location = useLocation();

    const roleMatched = roles.some((role) => {
        if(role === "admin") return user?.is_admin;
        if(role === "mod") return user?.is_mod;
        return false
    })

    useEffect(() => {
        if(!user?.id && !toastFired.current){
            warningMsg("Please login or register to continue");
            toastFired.current = true;
        }
        else if (!roleMatched && !toastFired.current){
            warningMsg("You don't have permission to view this page.")
            toastFired.current = true;
        }
    }, [user, roleMatched]);
    
    if(!user?.id){
        return <Navigate to="/login" state={{from:location}} />;
    }
    if(!roleMatched){
        return <Navigate to="/"/>;
    };

    return children;
};
