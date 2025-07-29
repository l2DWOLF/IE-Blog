import { userReducer} from "./UserState";
import {configureStore, combineReducers} from "@reduxjs/toolkit"

const rootReducer = combineReducers({user: userReducer,});

const store = configureStore({
    reducer: rootReducer,
});
export default store;