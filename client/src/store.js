import {createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"

const middleware = [thunk]

// useing ... grabs the variables properties but not vallues, sets up a new instance of the variable to add new values
const store = createStore(() => [], {}, applyMiddleware(...middleware))

export default store
