import React from 'react'
import { View, Switch, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles'
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import { setWifiSetting } from '../../redux/ducks/panel';


function WifiPanel() {
    const dispatch = useDispatch();
    const { isWifiSetting } = useSelector(state => state.panel);

    const settings = () => {
        dispatch(setWifiSetting(true))
    }

    return (
        <View style={styles.dropdown}>
            <View>
                <TouchableOpacity style={styles.dropdownElement} onPress={() => { settings(isWifiSetting) }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <Text style={{ color: "#ffff" }}>Settings</Text>
                        <Feather name="settings" size={14} color="#ffff" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default WifiPanel