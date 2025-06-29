import store from "../../redux/store";
import {jwtDecode} from "jwt-decode";
import { userLogin, userLogout } from "../../services/userServices";
import { SetToken, SetUser, Signoff } from "../../redux/UserState";
import { successMsg } from "../../utils/toastify/toast";
import { handleException } from "../../utils/errors/handleException";
import axios from 'axios';

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

const baseURL = import.meta.env.VITE_API_BASE_URL;
export const logoutHandler = async (dispatch) => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    
    if(confirmed){
        try {
            const { refreshToken } = store.getState().user;
            await axios.post(`${baseURL}/auth/logout/`, { refresh: refreshToken });
            dispatch(Signoff());
            return successMsg("You've been logged out, see you soon! :)")
        } catch (err) {
            console.error(err.response.data || err.message)
        };
    }
    else return;
};