// Actions
const GET_WS_STATUS = "UC/WS/GET_STATUS";
const SET_WS_STATUS = "UC/WS/SET_STATUS";

// Action Creators
export const getWsStatus = () => ({
	type: GET_WS_STATUS
})

export const setWsStatus = (status) => ({
    type: SET_WS_STATUS,
    status
});

// Initial State
const initialState = {
	wsStatus: 0,
};

// Reducer
export default function socketReducer (state = initialState, action) {
    switch(action.type) {
        case SET_WS_STATUS:
            return {...state, wsStatus: action.status};
        default:
            return state;
    }
};