// Actions
const GET_WIFI = "GET_WIFI";
const GET_HOTSPOT = "GET_HOTSPOT";
const GET_WIFISETTING = "GET_WIFISETTING";
const GET_HOTSPOTENABLE = "GET_HOTSPOTENABLE";


// Action Creators
export const setWifi = (wifi) => ({
    type: GET_WIFI,
    wifi
})
export const setHotspot = (hotspot) => ({
    type: GET_HOTSPOT,
    hotspot
})
export const setWifiSetting = (setting) => ({
    type: GET_WIFISETTING,
    setting
})
export const setHotspotEnable = (setting, loading) => ({
    type: GET_HOTSPOTENABLE,
    setting,
    loading
})


// Initial State
const initialState = {
    isWifi: false,
    isHotspot: false,
    isWifiSetting: false,
    isHotspotEnable: false,
    loading: false
};

// Reducer
export default function panelReducer(state = initialState, action) {
    switch (action.type) {
        case GET_WIFI:
            return { ...state, isWifi: action.wifi };
        case GET_HOTSPOT:
            return { ...state, isHotspot: action.hotspot };
        case GET_WIFISETTING:
            return { ...state, isWifiSetting: action.setting }
        case GET_HOTSPOTENABLE:
            return { ...state, isHotspotEnable: action.setting, loading: action.loading }
        default:
            return state;
    }
};