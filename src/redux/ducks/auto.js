// Actions
const GET_AUTO = "UC/AUTO/GET_AUTO";
const SET_AUTO = "UC/AUTO/SET_AUTO";
const GET_RUNNING = "UC/AUTO/GET_RUNNING";
const SET_RUNNING = "UC/AUTO/SET_RUNNING";
const GET_JOG = "UC/AUTO/GET_JOG";
const SET_JOG = "UC/AUTO/SET_JOG";
const GET_EMERGENCY = "UC/AUTO/GET_EMERGENCY";
const SET_EMERGENCY = "UC/AUTO/SET_EMERGENCY";

// Action Creators
export const getAuto = () => ({
    type: GET_AUTO
})

export const setAuto = (filename, code) => ({
    type: SET_AUTO,
    filename,
    code
});

export const getRunning = () => ({
    type: GET_RUNNING
})

export const setRunning = (running) => ({
    type: SET_RUNNING,
    running
});

export const getJog = () => ({
    type: GET_JOG
})

export const setJog = (jog) => ({
    type: SET_JOG,
    jog
});

export const getEmergency = () => ({
    type: GET_EMERGENCY
})

export const setEmergency = (emergency, reset, zeroref) => ({
    type: SET_EMERGENCY,
    emergency,
    reset,
    zeroref
});

// Initial State
const initialState = {
    filename: null,
    code: null,
    running: false,
    jog: false,
    emergency: false,
    reset: false,
    zeroref: false
};

// Reducer
export default function autoReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTO:
            return { ...state, filename: action.filename, code: action.code };
        case SET_RUNNING:
            return { ...state, running: action.running };
        case SET_JOG:
            return { ...state, jog: action.jog };
        case SET_EMERGENCY:
            return { ...state, emergency: action.emergency, reset: action.reset, zeroref: action.zeroref };
        default:
            return state;
    }
};