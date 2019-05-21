import {combineReducers} from "redux"
import authReducer from "./authReducer"

ecport default combineReducers({
    auth: authReducer
})