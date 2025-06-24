import { useSelector } from 'react-redux';


export default function useAuth(){
    const { user, accessToken, refreshToken, isAuthLoading } = useSelector(state => state.user);
    const isLoggedIn = !!user?.id;
    const isAdmin = user?.is_admin;
    const isMod = user?.is_mod;

    return {
        user, accessToken, refreshToken,
        isAuthLoading, isLoggedIn, isAdmin, isMod,
    };
};