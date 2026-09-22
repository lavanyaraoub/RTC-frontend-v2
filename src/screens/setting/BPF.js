import React, {useState, useRef, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, TextInput } from 'react-native';
const {width, height} = Dimensions.get('window');

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Numeric from '../../components/Numeric';

const BPF = ({navigation, route}) => {

  console.log()
  
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(['']);
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState([]);

    //const [bpf, setBpf] = useState(route.params.settings.binary_pos_feed);
    const [bpf, setBpf] = useState(
      route?.params?.settings?.binary_pos_feed && Array.isArray(route.params.settings.binary_pos_feed)
        ? route.params.settings.binary_pos_feed
        : [
            // default: one row so UI still renders safely
            { binary: "", pos: "", dir: 0, feed_rate: "" }
          ]
    );

    const [currfield, setCurrfield] = useState(null);
    const [cursor, setCursor] = useState(0);

    const itemsRef = useRef([]);
    const nullRef = useRef([]);

    useEffect(() => {
      if (Array.isArray(route?.params?.settings?.binary_pos_feed)) {
        itemsRef.current = itemsRef.current.slice(0, (route.params.settings.binary_pos_feed.length * 3 - 1));
      }
      nullRef.current?.focus();
        //itemsRef.current = itemsRef.current.slice(0, (route.params.settings.binary_pos_feed.length*3 - 1));
        //nullRef.current.focus();
     }, []);

    useEffect(() => {
      if(itemsRef.current[currfield]) {
            itemsRef.current[currfield].focus();
        }
        else {
          nullRef.current.focus();
        }
     }, [currfield, cursor]);

    const keyPress = (keyVal) => {
      let temp = JSON.parse(JSON.stringify(bpf));
      switch(currfield%3) {
        case 0:
          switch (keyVal) {
            case 'BKSP':
              if(cursor>0) {
                temp[Math.floor(currfield/3)].binary = temp[Math.floor(currfield/3)].binary.toString().slice(0, cursor-1)+temp[Math.floor(currfield/3)].binary.toString().slice(cursor);
                setBpf(temp);
                setCursor(cursor-1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            case 'LEFT':
              if(cursor>0) {
                setCursor(cursor-1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            case 'RIGHT':
              if(itemsRef.current[currfield].value.length > cursor) {
                setCursor(cursor+1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            default:
              temp[Math.floor(currfield/3)].binary = temp[Math.floor(currfield/3)].binary.substring(0, cursor) + keyVal + temp[Math.floor(currfield/3)].binary.substring(cursor);
              setBpf(temp);
              setCursor(cursor+1);
              break;
          }
          break;
        case 1:
          switch (keyVal) {
            case 'BKSP':
              if(cursor>0) {
                temp[Math.floor(currfield/3)].pos = temp[Math.floor(currfield/3)].pos.toString().slice(0, cursor-1)+temp[Math.floor(currfield/3)].pos.toString().slice(cursor);
                setBpf(temp);
                setCursor(cursor-1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            case 'DEL':
              if(itemsRef.current[currfield].value.length > cursor) {
                temp[Math.floor(currfield/3)].pos = temp[Math.floor(currfield/3)].pos.toString().slice(0, cursor)+temp[Math.floor(currfield/3)].pos.toString().slice(cursor+1);
                setBpf(temp);
              }
              itemsRef.current[currfield].focus();
              break;
            case 'LEFT':
              if(cursor>0) {
                setCursor(cursor-1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            case 'RIGHT':
              if(itemsRef.current[currfield].value.length > cursor) {
                setCursor(cursor+1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            default:
              temp[Math.floor(currfield/3)].pos = temp[Math.floor(currfield/3)].pos.toString().substring(0, cursor) + keyVal + temp[Math.floor(currfield/3)].pos.toString().substring(cursor);
              setBpf(temp);
              setCursor(cursor+1);
              break;
          }
          break;
        case 2:
          switch (keyVal) {
            case 'BKSP':
              if(cursor>0) {
                temp[Math.floor(currfield/3)].feed_rate = temp[Math.floor(currfield/3)].feed_rate.toString().slice(0, cursor-1)+temp[Math.floor(currfield/3)].feed_rate.toString().slice(cursor);
                setBpf(temp);
                setCursor(cursor-1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            case 'DEL':
              if(itemsRef.current[currfield].value.length > cursor) {
                temp[Math.floor(currfield/3)].feed_rate = temp[Math.floor(currfield/3)].feed_rate.toString().slice(0, cursor)+temp[Math.floor(currfield/3)].feed_rate.toString().slice(cursor+1);
                setBpf(temp);
              }
              itemsRef.current[currfield].focus();
              break;
            case 'LEFT':
              if(cursor>0) {
                setCursor(cursor-1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            case 'RIGHT':
              if(itemsRef.current[currfield].value.length > cursor) {
                setCursor(cursor+1);
              }
              else {
                itemsRef.current[currfield].focus();
              }
              break;
            default:
              temp[Math.floor(currfield/3)].feed_rate = temp[Math.floor(currfield/3)].feed_rate.toString().substring(0, cursor) + keyVal + temp[Math.floor(currfield/3)].feed_rate.toString().substring(cursor);
              setBpf(temp);
              setCursor(cursor+1);
              break;
          }
          break;
        default: 
          console.log('unknown key');
          break;
      }

    };



    let countDecimals = function (value) {
      if(Math.floor(value) === value) return 0;
      return value.toString().split(".")[1].length || 0; 
    }

    const handleSubmit = () => {
      let flag1, flag2, flag3, flag4 = false;
      bpf.map((val, valIdx)=>{
        if(val.binary.toString().trim() == '') { flag1 = true; }
        if(parseFloat(val.pos) < 0 || parseFloat(val.pos) > 359.999 || val.pos.toString().trim() == '') {
          flag2 = true;
        }
        if(parseFloat(val.feed_rate) < 1 || parseFloat(val.feed_rate) > 20 || val.feed_rate.toString().trim() == '') {
          flag3 = true;
        }
        if(val.pos.toString().trim() !== '') { 
          if(countDecimals(Math.abs(parseFloat(val.pos))) > 3 ) {
            flag4 = true;
          }
        }
        if(val.feed_rate.toString().trim() !== '') { 
          if(countDecimals(Math.abs(parseFloat(val.feed_rate))) > 3 ) {
            flag4 = true;
          }
        }
      });
      let errorsArr = [];
      if(flag1) {
        errorsArr.push('Binary value canot be empty');
      }
      if(flag2) {
        errorsArr.push('Position must be within 0 to 359.999 degrees');
      }
      if(flag3) {
        errorsArr.push('Feed rate must be within 1 to 35');
      }
      if(flag4) {
        errorsArr.push('Maximum decimal places allowed is 3.');
      }
      if(errorsArr.length > 0) {
        setErrors(errorsArr);
        setError(true);
        return;
      }
        let cleaned = JSON.parse(JSON.stringify(route.params.settings));
        let data = {...cleaned, 
        binary_pos_feed: bpf,
        };
        api.postJSON('dac_params', {A: data}).then(async(resJSON) => {
        console.log(resJSON);
        route.params.init();
        setMessage('Binary position feed saved successfully');
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
        <View style={[styles.rowBetween, styles.itemsStretch, styles.pt50, styles.px20, styles.flex1, ]}>
          <View style={[styles.flex3, styles.pr20, ]}>
            <View style={[styles.flex1, styles.mb30]}>
              <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20]}>
                <Ionicons name="settings-outline" size={15} color="#fffa" style={styles.mr10} />
                <Text style={styles.title1}>BPF</Text>
              </LinearGradient>              
              <ScrollView style={[styles.widgetBody, styles.flex1]}>
                <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1, styles.px5, styles.py5]}>
                    <View style={styles.settingsCol}>
                        <View style={styles.headerGroup}>
                            <View style={styles.headerCol}>
                                <Text style={styles.subtitle1}>BINARY CODE</Text>
                            </View>
                            <View style={styles.headerCol}>
                                <Text style={styles.subtitle1}>POSITION (DEGREE)</Text>
                            </View>
                            <View style={styles.headerCol}>
                                <Text style={styles.subtitle1}>SHORTEST PATH</Text>
                            </View>
                            <View style={styles.headerCol}>
                                <Text style={styles.subtitle1}>FEED RATE (DEGREES/MIN)</Text>
                            </View>
                        </View>
                        {bpf.map((item, idx)=>
                        <View key={idx} style={styles.dataGroup}>
                              {/* This is now a non-editable text field */}
                            <View style={[styles.dataCol, {justifyContent: 'center'}]}>
                                <Text style={styles.body1}>{item.binary}</Text>
                            </View>
                            <TouchableOpacity style={styles.dataCol}
                                onPress={async ()=>{
                                    await setCursor(0);
                                    setCurrfield(idx*3 + 1);
                                    setCursor(item.pos.toString().length);
                                }}>
                                <TextInput
                                    ref={el => itemsRef.current[idx*3 + 1] = el} 
                                    style={[styles.body1, styles.px10, styles.py10, ((currfield !== null) && (currfield == (idx*3 + 1))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                    selection={{start: cursor, end: cursor}}
                                    value={item.pos}
                                    onChangeText={(e)=>{
                                    console.log(e);
                                    }}
                                    showSoftInputOnFocus={false}
                                    autoFocus={false}
                                    />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dataCol} onPress={async ()=>{
                                let temp = await JSON.parse(JSON.stringify(bpf));
                                temp[idx].dir = await bpf[idx].dir == 0 ? 1 : 0;
                                await setBpf(temp);
                                await setCurrfield(null);
                                nullRef.current.focus();
                                }}>
                                <Text style={styles.subtitle1}>{item.dir == 1 ? '1' : '0'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dataCol}
                                onPress={async ()=>{
                                    await setCursor(0);
                                    setCurrfield(idx*3 + 2);
                                    setCursor(item.feed_rate.toString().length);
                                }}>
                                <TextInput
                                    ref={el => itemsRef.current[idx*3 + 2] = el} 
                                    style={[styles.body1, styles.px10, styles.py10, ((currfield == (idx*3 + 2))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                    selection={{start: cursor, end: cursor}}
                                    value={item.feed_rate}
                                    onChangeText={(e)=>{
                                    console.log(e);
                                    }}
                                    showSoftInputOnFocus={false}
                                    autoFocus={false}
                                    />
                            </TouchableOpacity>
                        </View>
                        )}
                    </View>
                    
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ handleSubmit(); }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Ionicons name="ios-save-outline" size={20} color="#fffa" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.w100p} onPress={()=>{  }}>
              <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                <Ionicons name="ios-checkmark-sharp" size={20} color="#fffa" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>ENABLE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ navigation.goBack(); }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>BACK</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{}} ref={el => nullRef.current = el} >
                { currfield != null &&
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
          <TouchableOpacity style={{}} onPress={()=>{ setMessage(''); }}>
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
            {errors.map((err, errIdx)=>(
              <View key={errIdx} style={[styles.row0Start, styles.mb10]}>
                <Ionicons name="close-circle" size={24} color="rgb(195, 119, 119)" style={styles.mr10} />
                <Text style={styles.body3}>{err}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={{}} onPress={()=>{ setError(false); }}>
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

export default BPF;