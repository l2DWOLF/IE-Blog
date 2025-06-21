import {jwtDecode} from "jwt-decode";
import { userLogin } from "../../services/userServices";

export const loginHandler = async (Values, dispatch) => {
    try{
        const response = await userLogin({username: Values.username, password: Values.password});
        console.log(response.token);
        
        const token = response.token;
        console.log("token: ", token);
        
        const decodedJwtAccess = jwtDecode(response.jwt.access);
        console.log("decoded access token", decodedJwtAccess);
        const decodedJwtRefresh = jwtDecode(response.jwt.refresh);
        console.log(("decoded refresh token", decodedJwtRefresh));
        
        
    } catch (err) {
        console.error(err.response.data);
    };
};