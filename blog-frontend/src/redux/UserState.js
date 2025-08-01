
const defaultUser = {
    id: "",
    username: "",
    is_admin: false,
    is_mod: false,
};

export class UserState {
    constructor() {
        this.accessToken = sessionStorage.getItem("access_token") || "";
        this.refreshToken = sessionStorage.getItem("refresh_token") || "";
        this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : defaultUser;
        this.isAuthLoading = true;
    }
}

export const ActionType = {
    SetAuthLoading: "SetAuthLoading",
    SetToken: "SetToken",
    SetUser: "SetUser",
    Signoff: "Signoff",
};

export function SetAuthLoading(status){
    return {type: ActionType.SetAuthLoading, payload: status};
}

export function SetToken(accessToken, refreshToken) {
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
    return { type: ActionType.SetToken, payload: { accessToken, refreshToken } };
}

export function SetUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    return { type: ActionType.SetUser, payload: user };
}

export function Signoff() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("SetAuthLoading")
    return { type: ActionType.Signoff };
}

export function userReducer(currentState = new UserState(), action) {
    const newState = { ...currentState };

    switch (action.type) {
        case ActionType.SetAuthLoading:
            newState.isAuthLoading = action.payload;
            break;

        case ActionType.SetToken:
            newState.accessToken = action.payload.accessToken;
            newState.refreshToken = action.payload.refreshToken;
            break;

        case ActionType.SetUser:
            newState.user = action.payload;
            break;

        case ActionType.Signoff:
            newState.accessToken = "";
            newState.refreshToken = "";
            newState.user = defaultUser;
            newState.isAuthLoading = "";
            break;
        
        default:
            break;
    }
    return newState;
}