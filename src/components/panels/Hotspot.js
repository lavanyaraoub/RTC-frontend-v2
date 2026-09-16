import React from 'react'
import { View, Switch, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../helpers/Api';
import { setHotspotEnable } from '../../redux/ducks/panel';
import styles from '../../styles'
import swal from 'sweetalert';


function Hotspot() {
    const dispatch = useDispatch();
    const [isEnabled, setIsEnabled] = React.useState(false);
    //const [error, setError] = React.useState("");
    const { isHotspotEnable, loading } = useSelector(state => state.panel);

    const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState)
        await callingApi(isEnabled)
    };

    const callingApi = (isEnabled) => {
        dispatch(setHotspotEnable(!isEnabled, false))
        if (!isEnabled) {
            dispatch(setHotspotEnable(!isEnabled, true))
            api.postJSON('hotspot/start', {}).then(async (resJSON) => {
                dispatch(setHotspotEnable(!isEnabled, false))
                swal("Connected...!", "", "success");
            })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            dispatch(setHotspotEnable(!isEnabled, true))
            if (isHotspotEnable) {
                api.postJSON('hotspot/stop', {}).then(async (resJSON) => {
                    dispatch(setHotspotEnable(false, false))
                    swal("Disconnected...!", "", "error");
                })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        }
    }

    React.useEffect(() => {
        setIsEnabled(isHotspotEnable)
    }, [isHotspotEnable])

    return (
        <View style={styles.dropdownhot}>
            <View>
                <TouchableOpacity style={styles.dropdownElement}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <Text style={{ color: "#ffff" }}>Hotspot</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isHotspotEnable}
                            disabled={loading ? true : false}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                {
                    loading &&
                    <View style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
                        <Text style={{ color: "#ffff" }}>Loading...</Text>
                    </View>

                }
            </View>
        </View>
    )
}

export default Hotspot