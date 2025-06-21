import {jwtDecode} from "jwt-decode";
import { userLogin } from "../../services/userServices";
import { SetToken, SetUser } from "../../redux/UserState";

export const loginHandler = async (Values, dispatch) => {
    try{
        const response = await userLogin({username: Values.username, password: Values.password});
        
        const token = response.token;
        const accessToken = response.jwt.access;
        const refreshToken = response.jwt.refresh;

        const decodedUser = jwtDecode(accessToken);

        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("refresh_token", refreshToken);
        sessionStorage.setItem("user", JSON.stringify(decodedUser));

        dispatch(SetToken(accessToken));
        dispatch(SetUser(decodedUser));
    } catch (err) {
        console.error(err.response.data || err.message);
    };
};