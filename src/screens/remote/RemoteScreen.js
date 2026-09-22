import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { Entypo } from '@expo/vector-icons';

import styles from '../../styles';
import COLORS from '../../colors';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../helpers/Api';
import swal from 'sweetalert';



const RemoteScreen = ({ navigation }) => {

    const [mode, setMode] = React.useState('SSH');
    const [token, setToken] = React.useState(null);
    const [start, setStart] = React.useState(false);


    const startHandle = () => {
        setStart(true)
        if (mode === 'SSH') {
            setToken(null);
            api.postJSON('remote/start/ssh', {}).then(async (resJSON) => {
                console.log('RS', resJSON);
                if (resJSON?.status === "success") {
                    setToken(resJSON?.response)
                }
                if (resJSON?.status === "error") {
                    swal(resJSON?.response, "", "error");
                }
            })
                .catch((e) => {
                    console.log(e);
                });
        } else if (mode === 'HTTP') {
            setToken(null);
            api.postJSON('remote/start/http', {}).then(async (resJSON) => {
                console.log('RS', resJSON);
                if (resJSON?.status === "success") {
                    setToken(resJSON?.response)
                }
                if (resJSON?.status === "error") {
                    swal(resJSON?.response, "", "error");
                }
            })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    const stopHandle = () => {
        api.postJSON('remote/stop', {}).then(async (resJSON) => {
            console.log('RS', resJSON);
            if (resJSON?.status === "success") {
                setStart(false)
            }
            if (resJSON?.status === "error") {
                swal(resJSON?.response, "", "error");
            }
        })
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
            <View style={styles.containerCenter}>
                <View style={{ width: "20%" }}>
                    <View style={[styles.rowCenter, styles.well, styles.mb10]}>
                        <TouchableOpacity style={styles.flex1} onPress={() => { setMode('SSH'); setToken(null); }}>
                            <LinearGradient colors={mode == 'SSH' ? [COLORS.green1, COLORS.green2] : ['#0000', '#0000']} style={styles.btn0}>
                                <Text style={styles.btnTxtRed}>SSH</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flex1} disabled={mode == 'HTTP'} onPress={() => {
                            setMode('HTTP');
                            setToken(null);
                        }}>
                            <LinearGradient colors={mode == 'HTTP' ? [COLORS.green1, COLORS.green2] : ['#0000', '#0000']} style={styles.btn0}>
                                <Text style={styles.btnTxtRed}>HTTP</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ width: "80%", marginTop: 20 }}>
                    <View style={[styles.rowCenter, styles.well, styles.mb10]}>
                        <View style={{ display: "flex", justifyContent: "space-around", flexDirection: "row", alignItems: "center", width: "100%" }}>
                            {
                                start ? <View>
                                    <TouchableOpacity style={styles.flex1} onPress={stopHandle}>
                                        <LinearGradient colors={[COLORS.red1, COLORS.red1]} style={styles.btn0}>
                                            <Text style={styles.btnTxtRed}><Entypo name="check" size={14} color="#ffff" />Stop</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View> : <View>
                                    <TouchableOpacity style={styles.flex1} onPress={startHandle}>
                                        <LinearGradient colors={[COLORS.blue1, COLORS.blue1]} style={styles.btn0}>
                                            <Text style={styles.btnTxtRed}><Entypo name="check" size={14} color="#ffff" />Start</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View >
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={{ color: "#ffff", marginRight: 20 }}>Status</Text>
                                    <View style={start ? styles.statusGreen : styles.statusRed} />
                                </View>
                                {
                                    token || start ? <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
                                        <Text style={{ color: "#ffff", marginRight: 20 }}>Tocken</Text>
                                        <Text style={{ color: "green" }}>{token}</Text>
                                    </View> : null
                                }
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        </ImageBackground>
    );
};

export default RemoteScreen;




