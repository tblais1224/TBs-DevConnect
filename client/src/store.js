import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
//rootReducer is from index.js but it doesnt need to be specified in path becuase its index.js
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

// useing ... grabs the variables properties but not vallues, sets up a new instance of the variable to add new values
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    //line 16 and compose is required to enable the chrome redux dev tool, shown in intructions on the extension itself
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
