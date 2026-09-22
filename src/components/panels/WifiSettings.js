import React from 'react'
import { View, Switch, Text, TouchableOpacity, TextInput } from 'react-native';
import COLORS from '../../colors';
import styles from '../../styles'
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from "react-redux";
import { setWifiSetting } from '../../redux/ducks/panel';
import api from '../../helpers/Api';
import FullKeypadSettings from '../FullKeypadSettings';
import swal from 'sweetalert';


function WifiSettings() {

    const dispatch = useDispatch();
    const [ssid, setSsid] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [country, setCountry] = React.useState("IN");
    const [error, setError] = React.useState("");
    const [cursor, setCursor] = React.useState(0);
    const [cursor1, setCursor1] = React.useState(0);
    const [cursor2, setCursor2] = React.useState(2);
    const [passwordClick, setPasswordClick] = React.useState(false);
    const [countryClick, setCountryClick] = React.useState(false);
    const [ssidClick, setSsidClick] = React.useState(true);

    const itemsRef = React.useRef(null);
    const itemsRef1 = React.useRef(null);
    const itemsRef2 = React.useRef(null);

    const onCancel = () => {
        dispatch(setWifiSetting(false))
    }

    const onSubmitHandler = () => {
        const data = {
            ssid: ssid,
            pwd: password,
            country: country
        }
        if (ssid == "") {
            swal("Enter SSID", "", "error");
            return
        }
        if (password == "") {
            swal("Enter Password", "", "error");
            return
        }
        if (country == "") {
            swal("Enter country", "", "error");
            return
        }
        api.postJSON('wifi/configure', data).then(async (resJSON) => {
            if (resJSON?.status === "success") {
                swal("Connected...!", "You need to reboot your device", "success");
            } else {
                swal("Error!", "", "error");
            }
            setError(resJSON);
        })
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <View style={styles.WifiSettings}>
            <View style={[styles.containerCenter]}>
                <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", width: "100%" }}>
                    <View style={{ marginRight: 10 }}>
                        <Text style={{ color: "#ffff" }}>NAME :</Text>
                    </View>
                    <View style={{ width: "70%" }}>
                        <TouchableOpacity onPress={() => {
                            setCountryClick(false)
                            setPasswordClick(false)
                            setSsidClick(true)
                        }}>
                            <TextInput
                                style={[styles.inputWifi, { marginLeft: 25 }]}
                                onChangeText={setSsid}
                                ref={el => itemsRef.current = el}
                                value={ssid}
                                selection={{ start: cursor, end: cursor }}
                                placeholder="Enter Network Name"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", width: "100%", marginTop: 10 }}>
                    <View style={{ marginRight: 10 }}>
                        <Text style={{ color: "#ffff" }}>PASSWORD :</Text>
                    </View>
                    <View style={{ width: "70%" }}>
                        <TouchableOpacity onPress={() => {
                            setCountryClick(false)
                            setPasswordClick(true)
                            setSsidClick(false)
                        }
                        }
                        >
                            <TextInput
                                style={[styles.inputWifi, { marginLeft: 4 }]}
                                secureTextEntry={true}
                                onChangeText={setPassword}
                                selection={{ start: cursor1, end: cursor1 }}
                                value={password}
                                ref={el => itemsRef1.current = el}
                                placeholder="Enter Password"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", width: "100%", marginTop: 10 }}>
                    <View style={{ marginRight: 10 }}>
                        <Text style={{ color: "#ffff" }}>COUNTRY :</Text>
                    </View>
                    <View style={{ width: "70%" }}>
                        <TouchableOpacity onPress={() => {
                            setCountryClick(true)
                            setPasswordClick(false)
                            setSsidClick(false)
                        }}>
                            <TextInput
                                style={[styles.inputWifi, { marginLeft: 10 }]}
                                onChangeText={setCountry}
                                selection={{ start: cursor2, end: cursor2 }}
                                value={country}
                                ref={el => itemsRef2.current = el}
                                placeholder="Enter Country"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <FullKeypadSettings
                code={ssidClick ? ssid : passwordClick ? password : countryClick ? country : null}
                cursor={ssidClick ? cursor : passwordClick ? cursor1 : countryClick ? cursor2 : null}
                setCode={ssidClick ? setSsid : passwordClick ? setPassword : countryClick ? setCountry : null}
                setCursor={ssidClick ? setCursor : passwordClick ? setCursor1 : countryClick ? setCursor2 : null}
                itemsRef={ssidClick ? itemsRef : passwordClick ? itemsRef1 : countryClick ? itemsRef2 : null}
            />
            <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <View style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={onSubmitHandler}>
                        <LinearGradient colors={[COLORS.green1, COLORS.green1]} style={styles.btn0}>
                            <Text style={{ color: "#ffff" }}>Submit</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={onCancel}>
                        <LinearGradient colors={[COLORS.red1, COLORS.red1]} style={styles.btn0}>
                            <Text style={{ color: "#ffff" }} >Cancel</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default WifiSettings