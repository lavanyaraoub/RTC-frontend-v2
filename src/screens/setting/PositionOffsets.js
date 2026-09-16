import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, TextInput } from 'react-native';
const { width, height } = Dimensions.get('window');

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Numeric from '../../components/Numeric';

const PositionOffsets = ({ navigation, route }) => {

  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = useState(['']);
  const [error, setError] = useState(false);

  const [offsets, setOffsets] = useState([
    route.params.settings.g54,
    route.params.settings.g55,
    route.params.settings.g56,
    route.params.settings.g57,
    route.params.settings.g58
  ]);


  const [currfield, setCurrfield] = useState(null);
  const [cursor, setCursor] = useState(0);

  const itemsRef = useRef([]);
  const nullRef = useRef(null);


  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 5);
    if (nullRef.current) {
      nullRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (itemsRef.current[currfield]) {
      itemsRef.current[currfield].focus();
    }
    else {
      if (nullRef.current) {
        nullRef.current.focus();
      }
    }
  }, [currfield, cursor]);


  const keyPress = (keyVal) => {
    let temp = JSON.parse(JSON.stringify(offsets));
    switch (keyVal) {
      case 'BKSP':
        if (cursor > 0) {
          temp[currfield] = temp[currfield].toString().slice(0, cursor - 1) + temp[currfield].toString().slice(cursor);
          setOffsets(temp);
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
        temp[currfield] = temp[currfield].toString().substring(0, cursor) + keyVal + temp[currfield].toString().substring(cursor);
        setOffsets(temp);
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

    offsets.map((val, valIdx) => {
      if (parseFloat(val) < -359.999 || parseFloat(val) > 359.999 || val.toString().trim() == '' || countDecimals(Math.abs(parseFloat(val))) > 3) {
        flag = true;
      }
    });

    if (flag) {
      setError(true);
      return;
    }

    let cleaned = JSON.parse(JSON.stringify(route.params.settings));
    let data = {
      ...cleaned,
      g54: offsets[0],
      g55: offsets[1],
      g56: offsets[2],
      g57: offsets[3],
      g58: offsets[4],
    };
    console.log(data);
    api.postJSON('dac_params', { A: data }).then(async (resJSON) => {
      console.log(resJSON);
      route.params.init();
      setMessage('Position offset saved successfully');
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
                  <Text style={styles.title1}>POSITION OFFSETS</Text>
                </LinearGradient>
                <ScrollView style={[styles.widgetBody, styles.flex1]}>
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1]}>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>G54</Text>
                      <TouchableOpacity style={styles.data2Col}
                        onPress={async () => {
                          await setCursor(0);
                          await setCurrfield(0);
                          setCursor(offsets[0].toString().length);
                        }}
                      >
                        <TextInput
                          ref={el => itemsRef.current[0] = el}
                          style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (0))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                          selection={{ start: cursor, end: cursor }}
                          value={offsets[0]}
                          onChangeText={(e) => { }}
                          showSoftInputOnFocus={false}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>G55</Text>
                      <TouchableOpacity style={styles.data2Col}
                        onPress={async () => {
                          await setCursor(0);
                          await setCurrfield(1);
                          setCursor(offsets[1].toString().length);
                        }}
                      >
                        <TextInput
                          ref={el => itemsRef.current[1] = el}
                          style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (1))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                          selection={{ start: cursor, end: cursor }}
                          value={offsets[1]}
                          onChangeText={(e) => { }}
                          showSoftInputOnFocus={false}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1]}>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>G56</Text>
                      <TouchableOpacity style={styles.data2Col}
                        onPress={async () => {
                          await setCursor(0);
                          await setCurrfield(2);
                          setCursor(offsets[2].toString().length);
                        }}
                      >
                        <TextInput
                          ref={el => itemsRef.current[2] = el}
                          style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (2))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                          selection={{ start: cursor, end: cursor }}
                          value={offsets[2]}
                          onChangeText={(e) => { }}
                          showSoftInputOnFocus={false}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>G57</Text>
                      <TouchableOpacity style={styles.data2Col}
                        onPress={async () => {
                          await setCursor(0);
                          await setCurrfield(3);
                          setCursor(offsets[3].toString().length);
                        }}
                      >
                        <TextInput
                          ref={el => itemsRef.current[3] = el}
                          style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (3))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                          selection={{ start: cursor, end: cursor }}
                          value={offsets[3]}
                          onChangeText={(e) => { }}
                          showSoftInputOnFocus={false}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1]}>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>G58</Text>
                      <TouchableOpacity style={styles.data2Col}
                        onPress={async () => {
                          await setCursor(0);
                          await setCurrfield(4);
                          setCursor(offsets[4].toString().length);
                        }}
                      >
                        <TextInput
                          ref={el => itemsRef.current[4] = el}
                          style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (4))) ? { borderColor: '#35a', borderWidth: 2 } : { borderColor: '#35a0', borderWidth: 2 }]}
                          selection={{ start: cursor, end: cursor }}
                          value={offsets[4]}
                          onChangeText={(e) => { }}
                          showSoftInputOnFocus={false}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
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
                {currfield !== null &&
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
                  <Text style={styles.body3}>Position values must be within ±0.000 to 359.999 degrees, with a maximum of 3 decial digits.</Text>
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

export default PositionOffsets;




