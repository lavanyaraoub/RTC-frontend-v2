import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, TextInput } from 'react-native';
const { width, height } = Dimensions.get('window');

import Numeric from '../../components/Numeric';

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const PitchError = ({ navigation, route }) => {

  const [loading, setLoading] = React.useState(false);

  //const [values, setValues] = React.useState(route.params.settings.pitch_error);
  const [values, setValues] = React.useState(
    route?.params?.settings?.pitch_error || Array(36).fill('')
  );


  const [message, setMessage] = useState(['']);
  const [error, setError] = useState(false);

  const [currfield, setCurrfield] = useState(null);
  const [cursor, setCursor] = useState(0);

  const itemsRef = useRef([]);
  const nullRef = useRef([]);

  const set1 = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const set2 = [100, 110, 120, 130, 140, 150, 160, 170, 180];
  const set3 = [190, 200, 210, 220, 230, 240, 250, 260, 270];
  const set4 = [280, 290, 300, 310, 320, 330, 340, 350, 360];

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 36);
    nullRef.current.focus();
  }, []);

  useEffect(() => {
    if (itemsRef.current[currfield]) {
      itemsRef.current[currfield].focus();
    }
    else {
      nullRef.current.focus();
    }
  }, [currfield, cursor]);

  const keyPress = (keyVal) => {
    let temp = JSON.parse(JSON.stringify(values));
    switch (keyVal) {
      case 'BKSP':
        if (cursor > 0) {
          temp[currfield] = temp[currfield].toString().slice(0, cursor - 1) + temp[currfield].toString().slice(cursor);
          setValues(temp);
          setCursor(cursor - 1);
        }
        else {
          itemsRef.current[currfield].focus();
        }
        break;
      case 'LEFT':
        if (cursor > 0) {
          setCursor(cursor - 1);
        }
        else {
          itemsRef.current[currfield].focus();
        }
        break;
      case 'RIGHT':
        if (itemsRef.current[currfield].value.length > cursor) {
          setCursor(cursor + 1);
        }
        else {
          itemsRef.current[currfield].focus();
        }
        break;
      default:
        temp[currfield] = temp[currfield].substring(0, cursor) + keyVal + temp[currfield].substring(cursor);
        setValues(temp);
        setCursor(cursor + 1);
        break;
    }

  };

  let countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  }

  const handleSubmit = () => {

    let flag = false;

    values.map((val, valIdx) => {
      console.log(val, parseFloat(val), "val******")
      console.log(parseFloat(val) <= -0.050, parseFloat(val) >= 0.050, "values checking")
      if (parseFloat(val) < -0.050 || parseFloat(val) > 0.050 || val.toString().trim() == '' || countDecimals(Math.abs(parseFloat(val))) > 3) {
        flag = true;
      }
    });

    if (flag) {
      setError(true);
      return;
    }

    let cleaned = JSON.parse(JSON.stringify(route.params.settings));
    let data = { ...cleaned, pitch_error: values };
    console.log(data);
    api.postJSON('dac_params', { A: data }).then(async (resJSON) => {
      console.log(resJSON);
      route.params.init();
      setMessage('Pitch error saved successfully');
      setLoading(false);
    })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
    setCurrfield(null);
  };


  return (
    <>
      <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
        <View style={styles.containerStart}>
          <View style={[styles.rowBetween, styles.itemsStretch, styles.pt50, styles.px20, styles.flex1,]}>
            <View style={[styles.flex3, styles.pr20,]}>
              <View style={[styles.flex1, styles.mb30]}>
                <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20]}>
                  <Ionicons name="settings-outline" size={15} color="#fffa" style={styles.mr10} />
                  <Text style={styles.title1}>PITCH ERROR</Text>
                </LinearGradient>
                <ScrollView style={[styles.widgetBody, styles.flex1]}>
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1, styles.px5, styles.py5]}>
                    <View style={styles.settingsCol}>
                      <View style={styles.headerGroup}>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>DEGREE</Text>
                        </View>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>VALUE</Text>
                        </View>
                      </View>
                      {set1.map((item1, item1Idx) => (
                        <View style={styles.dataGroup} key={item1Idx}>
                          <View style={styles.data4Col}>
                            <Text style={styles.subtitle2}>{item1}</Text>
                          </View>
                          <TouchableOpacity style={styles.data3Col}
                            onPress={async () => {
                              await setCursor(0);
                              await setCurrfield(item1Idx);
                              setCursor(values[item1Idx].toString().length);
                            }}
                          >
                            <TextInput
                              ref={el => itemsRef.current[item1Idx] = el}
                              style={[styles.body1, styles.px10, styles.textCenter, styles.py15, ((currfield !== null) && (currfield == (item1Idx))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                              selection={{ start: cursor, end: cursor }}
                              value={values[item1Idx]}
                              onChangeText={(e) => { }}
                              showSoftInputOnFocus={false}
                              autoFocus={false}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>

                    <View style={styles.settingsCol}>
                      <View style={styles.headerGroup}>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>DEGREE</Text>
                        </View>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>VALUE</Text>
                        </View>
                      </View>
                      {set2.map((item2, item2Idx) => (
                        <View style={styles.dataGroup} key={item2Idx}>
                          <View style={styles.data4Col}>
                            <Text style={styles.subtitle2}>{item2}</Text>
                          </View>
                          <TouchableOpacity style={styles.data3Col}
                            onPress={async () => {
                              await setCursor(0);
                              await setCurrfield(item2Idx + 9);
                              setCursor(values[item2Idx + 9].toString().length);
                            }}
                          >
                            <TextInput
                              ref={el => itemsRef.current[item2Idx + 9] = el}
                              style={[styles.body1, styles.px10, styles.textCenter, styles.py15, ((currfield !== null) && (currfield == (item2Idx + 9))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                              selection={{ start: cursor, end: cursor }}
                              value={values[item2Idx + 9]}
                              onChangeText={(e) => { }}
                              showSoftInputOnFocus={false}
                              autoFocus={false}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>

                    <View style={styles.settingsCol}>
                      <View style={styles.headerGroup}>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>DEGREE</Text>
                        </View>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>VALUE</Text>
                        </View>
                      </View>
                      {set3.map((item3, item3Idx) => (
                        <View style={styles.dataGroup} key={item3Idx}>
                          <View style={styles.data4Col}>
                            <Text style={styles.subtitle2}>{item3}</Text>
                          </View>
                          <TouchableOpacity style={styles.data3Col}
                            onPress={async () => {
                              await setCursor(0);
                              await setCurrfield(item3Idx + 18);
                              setCursor(values[item3Idx + 18].toString().length);
                            }}
                          >
                            <TextInput
                              ref={el => itemsRef.current[item3Idx + 18] = el}
                              style={[styles.body1, styles.px10, styles.textCenter, styles.py15, ((currfield !== null) && (currfield == (item3Idx + 18))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                              selection={{ start: cursor, end: cursor }}
                              value={values[item3Idx + 18]}
                              onChangeText={(e) => { }}
                              showSoftInputOnFocus={false}
                              autoFocus={false}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>

                    <View style={styles.settingsCol}>
                      <View style={styles.headerGroup}>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>DEGREE</Text>
                        </View>
                        <View style={styles.headerCol}>
                          <Text style={styles.subtitle1}>VALUE</Text>
                        </View>
                      </View>
                      {set4.map((item4, item4Idx) => (
                        <View style={styles.dataGroup} key={item4Idx}>
                          <View style={styles.data4Col}>
                            <Text style={styles.subtitle2}>{item4}</Text>
                          </View>
                          <TouchableOpacity style={styles.data3Col}
                            onPress={async () => {
                              await setCursor(0);
                              await setCurrfield(item4Idx + 27);
                              setCursor(values[item4Idx + 27].toString().length);
                            }}
                          >
                            <TextInput
                              ref={el => itemsRef.current[item4Idx + 27] = el}
                              style={[styles.body1, styles.px10, styles.textCenter, styles.py15, ((currfield !== null) && (currfield == (item4Idx + 27))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                              selection={{ start: cursor, end: cursor }}
                              value={values[item4Idx + 27]}
                              onChangeText={(e) => { }}
                              showSoftInputOnFocus={false}
                              autoFocus={false}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
            <View style={[styles.flex1, styles.justifyStart]}>
              <TouchableOpacity style={styles.w100p} onPress={() => { handleSubmit(); }}>
                <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                  <Ionicons name="ios-save-outline" size={20} color="#fffa" style={styles.mr10} />
                  <Text style={styles.btnTxtRed}>SAVE</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.w100p} onPress={() => { navigation.goBack(); }}>
                <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                  <Ionicons name="chevron-back-sharp" size={20} color="#fffc" style={styles.mr10} />
                  <Text style={styles.btnTxtRed}>BACK</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{}} ref={el => nullRef.current = el} >
                {currfield != null &&
                  <Numeric keyPress={keyPress} />}
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      {message != '' &&
        <View style={styles.toastWrap}>
          <View style={styles.toastInner}>
            <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.toastInner}>
              <View style={[styles.row0Center, styles.mb20]}>
                <Ionicons name="checkmark-circle" size={24} color="#fffa" style={styles.mr10} />
                <Text style={styles.body3}>{message}</Text>
              </View>
              <TouchableOpacity style={{}} onPress={() => { setMessage(''); }}>
                <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                  <Text style={styles.btnTxtRed}>CLOSE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>}
      {error &&
        <View style={styles.toastWrap}>
          <View style={styles.toastInner}>
            <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.toastInner}>
              <View style={styles.mb20}>
                <View style={[styles.row0Start, styles.mb10]}>
                  <Ionicons name="close-circle" size={24} color="rgb(195, 119, 119)" style={styles.mr10} />
                  <Text style={styles.body3}>Pitch error values must be within ± 0.050 to 0.050, with a maximum of 3 decimal digits.</Text>
                </View>
              </View>
              <TouchableOpacity style={{}} onPress={() => { setError(false); }}>
                <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                  <Text style={styles.btnTxtRed}>CLOSE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>}
    </>
  );
};

export default PitchError;




