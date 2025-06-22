import {jwtDecode} from "jwt-decode";
import { userLogin } from "../../services/userServices";
import { SetToken, SetUser } from "../../redux/UserState";

export const loginHandler = async (Values, dispatch) => {
    try{
        const response = await userLogin({username: Values.username, password: Values.password});
        
        const token = response.token; // remove 
        const accessToken = response.jwt.access;
        const refreshToken = response.jwt.refresh;
        const decodedUser = jwtDecode(accessToken);

        dispatch(SetToken(accessToken, refreshToken));
        dispatch(SetUser(decodedUser));
        return {accessToken, refreshToken}
    } catch (err) {
        console.error(err.response.data || err.message);
    };
};