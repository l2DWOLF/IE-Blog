import {jwtDecode} from "jwt-decode";
import { userLogin, userLogout } from "../../services/userServices";
import { SetToken, SetUser, Signoff } from "../../redux/UserState";
import { successMsg } from "../../utils/toastify/toast";
import { handleException } from "../../utils/errors/handleException";

export const loginHandler = async (Values, dispatch) => {
    try{
        const response = await userLogin({username: Values.username, password: Values.password});
        
        const token = response.token; // remove from django+here
        const accessToken = response.jwt.access;
        const refreshToken = response.jwt.refresh;
        const decodedUser = jwtDecode(accessToken);

        dispatch(SetToken(accessToken, refreshToken));
        dispatch(SetUser(decodedUser));
        return {accessToken, refreshToken};
    } catch (err) {
        handleException(err, {toast: true});
    };
};

export const logoutHandler = async (accessToken, refreshToken, dispatch) => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if(confirmed){
        try {
            await userLogout({ accessToken: accessToken, refreshToken: refreshToken });
            dispatch(Signoff());
            return successMsg("You've been logged out, see you soon! :)")
        } catch (err) {
            console.error(err.response.data || err.message)
        };
    }
    else return;
};