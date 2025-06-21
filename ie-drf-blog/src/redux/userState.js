export class UserState{
    constructor(){

        const defaultUser = {
            id: "",
            username: "",
            is_admin: false,
            is_mod: false,
        }

        this.token = sessionStorage.getItem("token") || "";
        this.jwt = sessionStorage.getItem("jwt") || "";

    }
}

export const ActionType = {
    SetToken: "SetToken",
    SetUser: "SetUser",
    SetMyCardIds: "SetMyCardIds",
    Signoff: "Signoff",
};

// Action Creators //