import { combineReducers, createStore } from 'redux';
import socketReducer from './ducks/wsocket';
import autoReducer from './ducks/auto';
import panelReducer from './ducks/panel';

const reducer = combineReducers({
    socket: socketReducer,
    auto: autoReducer,
    panel: panelReducer,
});

const store = createStore(reducer, {});

export default store;