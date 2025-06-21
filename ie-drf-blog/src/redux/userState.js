export class UserState{
    constructor(){

        const defaultUser = {
            id: "",
            username: "",
            is_admin: false,
            is_mod: false,
        }

        this.token = sessionStorage.getItem("access_token") || "";
        this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : defaultUser;
        
    }
}

export const ActionType = {
    SetToken: "SetToken",
    SetUser: "SetUser",
    SetMyCardIds: "SetMyCardIds",
    Signoff: "Signoff",
};

// Action creators
export function SetToken(token) {
    sessionStorage.setItem("access_token", token);
    return { type: ActionType.SetToken, payload: token };
}

export function SetUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    return { type: ActionType.SetUser, payload: user };
}


export function Signoff() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    return { type: ActionType.Signoff };
}

export function userReducer(currentState = new UserState(), action) {
    const newState = { ...currentState };

    switch (action.type) {
        case ActionType.SetToken:
            newState.token = action.payload;
            break;

        case ActionType.SetUser:
            newState.user = action.payload;
            break;

        case ActionType.Signoff:
            newState.token = "";
            newState.user = {
                id: "",
                is_mod: false,
                is_admin: false,
            };
            break;

        default:
            break;
    }

    return newState;
}