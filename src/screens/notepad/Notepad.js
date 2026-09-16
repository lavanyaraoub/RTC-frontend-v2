import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import styles from '../../styles';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../colors';
import { Ionicons } from '@expo/vector-icons';
import api from '../../helpers/Api';
import { CommonActions } from '@react-navigation/native';


const NotePadScreen = ({ navigation }) => {

    const [fileName, setFileName] = React.useState("")
    const [code, setCode] = React.useState([''])
    const [errors, setErrors] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleCodeSubmit = () => {
        console.log(code, "code***");
        setLoading(true)
        let cleaned = [];
        let errorsArr = [];
        code.slice(-1).map((cd, cdIdx) => {
            if (cd.trim() != '') {
                cleaned.push(cd);
                if (cd.trim()[cd.trim().length - 1] !== ';') {
                    errorsArr.push('Syntax Error on Line ' + (cdIdx + 1));
                    setLoading(false)
                }
            }
        });
        console.log(cleaned);
        if (cleaned.length < 1) {
            errorsArr.push('Please enter some code!');
        }
        if (errorsArr.length > 0) {
            setErrors(errorsArr);
            setError(true);
            setLoading(false)
            return;
        }

        if (fileName.trim() == '') {
            errorsArr.push('Please enter filename!');
            setErrors(errorsArr);
            setLoading(false)
            setError(true);
        }

        api.postJSON('createFile', { file_name: fileName, contents: cleaned.join('\n') }).then(async (resJSON) => {
            console.log('resJSON', resJSON);
            if (JSON.parse(resJSON).status == 'success') {
                setLoading(false)
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Home' },
                            {
                                name: 'ProgramScreens',
                                screen: "Program",
                            },
                        ],
                    })
                );
            }
            else if (JSON.parse(resJSON).status == 'error') {
                let errorsArr = [];
                errorsArr.push(JSON.parse(resJSON).desc);
                setErrors(errorsArr);
                setError(true);
                setLoading(false)
            }
            else {
                console.log('Unknown err');
                let errorsArr = [];
                errorsArr.push('Program could not be saved');
                setErrors(errorsArr);
                setError(true);
                setLoading(false)
            }
        })
            .catch((e) => {
                console.log(e);
            });

    }

    return (
        <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
            <View style={[styles.row0Start, { padding: "1rem", height: "90%" }]}>
                <View style={{ width: "80%", height: "100%", marginTop: "1rem" }}>
                    <View>
                        <TextInput style={styles.notepadInput} placeholder='File Name' onChange={(e) => { setFileName(e.target.value) }} />
                    </View>
                    <TextInput
                        style={styles.textArea}
                        editable
                        multiline
                        placeholder='write your program here...'
                        onChange={(e) => {
                            let tempArr = JSON.parse(JSON.stringify(code))
                            tempArr.push(e.target.value)
                            setCode(tempArr)
                        }}
                    />
                </View>
                <View style={{ width: "20%", height: "100%", padding: 8 }}>
                    <TouchableOpacity style={[styles.w100p, { opacity: loading ? 0.3 : 1 }]} onPress={handleCodeSubmit} disabled={loading}>
                        <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                            <Text style={styles.btnTxtRed}>SAVE</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Home', { screen: 'Home' }) }} style={styles.w100p} >
                        <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                            <Text style={styles.btnTxtRed}>Cancel</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {error &&
                    <View style={styles.toastWrap}>
                        <View style={styles.toastInner}>
                            <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.toastInner} >
                                <View style={styles.mb20}>
                                    {errors.map((err, errIdx) => (
                                        <View key={errIdx} style={[styles.row0Start, styles.mb10]}>
                                            <Ionicons name="close-circle" size={24} color="rgb(195, 119, 119)" style={styles.mr10} />
                                            <Text style={styles.body3}>{err}</Text>
                                        </View>
                                    ))}
                                </View>
                                <TouchableOpacity style={{}} onPress={() => {
                                    setError(false);
                                }}>
                                    <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                                        <Text style={styles.btnTxtRed}>CLOSE</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>}
            </View>
        </ImageBackground >
    );
};

export default NotePadScreen;




