import { useSelector } from 'react-redux';


export default function useAuth(){
    const { user, accessToken, refreshToken, isAuthLoading } = useSelector(state => state.user);
    const isLoggedIn = !!user?.id && !!accessToken && !!refreshToken;
    const isAdmin = user?.is_admin;
    const isMod = user?.is_mod;
    const isStaff = user?.is_staff;

    return {
        user, accessToken, refreshToken,
        isAuthLoading, isLoggedIn, isAdmin, isMod, isStaff
    };
};