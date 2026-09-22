import React, {useState, useRef, useEffect, useContext, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, TextInput } from 'react-native';
const {width, height} = Dimensions.get('window');

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Numeric from '../../components/Numeric';
import {SocketContext} from '../../helpers/SocketContext';

const MachineParameters = ({navigation, route}) => {
  const socket = useContext(SocketContext);
  
  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = useState(['']);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState([]);
    

  const [machineparams, setMachineparams] = useState([
    route.params.settings.cldl_timing,
    route.params.settings.motor_dir,
    route.params.settings.jog_feed,
    route.params.settings.homing_offset,
    route.params.settings.ecs,
    route.params.settings.cl_dl,
    route.params.settings.pot,
    route.params.settings.timing,
    route.params.settings.home_dir,
    route.params.settings.fin_signal,
    route.params.settings.not,
    route.params.settings.back_lash,
  ]);


  const [currfield, setCurrfield] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [rs232Enabled, setRs232Enabled] = useState(0);

  const itemsRef = useRef([]);
  const nullRef = useRef(null);


  
  const handleSend = useCallback((ev, req) => {
    socket.emit(ev, req);
  }, []);

  // ✅ ADDED: ask backend for rs232 state when this screen loads
  useEffect(() => {
    try {
      handleSend('get_rs232_status', {});
    } catch (e) {
      // keep silent / log if you want
      // console.log(e);
    }
  }, []);

  // ✅ ADDED: listen for backend rs232 state response and set UI accordingly
  useEffect(() => {
    if (!socket) return;

    const onRs232Status = (res) => {
      // expecting res.Data = "0" or "1" (or 0/1)
      if (res && res.Data !== undefined && res.Data !== null) {
        setRs232Enabled(Number(res.Data) ? 1 : 0);
      }
    };

    socket.on('rs232_status', onRs232Status);

    return () => {
      socket.off('rs232_status', onRs232Status);
    };
  }, [socket]);

  // RS232 / ECS operator guidance alarms.
  // These messages must appear on Machine Parameters screen itself.
  useEffect(() => {
    if (!socket) return;

    const onMachineParamAlarm = (data) => {
      const text = typeof data === 'string' ? data : '';

      const isRs232EcsMessage =
        text.includes('RS232') ||
        text.includes('ECS');

      if (!isRs232EcsMessage) {
        return;
      }

      setMessage('');
      setErrors([text]);
      setError(true);
    };

    socket.on('alarm_error', onMachineParamAlarm);

    return () => {
      socket.off('alarm_error', onMachineParamAlarm);
    };
  }, [socket]);
  

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 10);
    if(nullRef.current) {
      nullRef.current.focus();
    }
 }, []);

useEffect(() => {
  if(itemsRef.current[currfield]) {
      itemsRef.current[currfield].focus();
  }
  else {
    if(nullRef.current) {
      nullRef.current.focus();
    }
  }
}, [currfield, cursor]);


const keyPress = (keyVal) => {
  let temp = JSON.parse(JSON.stringify(machineparams));
      switch (keyVal) {
        case 'BKSP':
          if(cursor>0) {
            temp[currfield] = temp[currfield].toString().slice(0, cursor-1)+temp[currfield].toString().slice(cursor);
            setMachineparams(temp);
            setCursor(cursor-1);
          }
          else {
            itemsRef.current[currfield].focus();
          }
          break;
        // case 'DEL':
        //   if(itemsRef.current[currfield].value.length > cursor) {
        //     temp[currfield] = temp[currfield].toString().slice(0, cursor)+temp[currfield].toString().slice(cursor+1);
        //     setMachineparams(temp);
        //   }
        //   itemsRef.current[currfield].focus();
        //   break;
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
          temp[currfield] = temp[currfield].toString().substring(0, cursor) + keyVal + temp[currfield].toString().substring(cursor);
          setMachineparams(temp);
          setCursor(cursor+1);
          break;
      }
};

let countDecimals = function (value) {
  if(Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0; 
}

  const handleSubmit = () => {
    let errorsArr = [];
    if(parseFloat(machineparams[0]) < 100 || parseFloat(machineparams[0]) > 10000 || machineparams[0].toString().trim() == '') { errorsArr.push('CL/DL Delay must be within 100 to 10000 ms'); }
    if(parseFloat(machineparams[2]) < 1 || parseFloat(machineparams[2]) > 35 || machineparams[2].toString().trim() == '') { errorsArr.push('Jog feed value must be within 1 to 35'); }
    if(parseFloat(machineparams[3]) < -359.999 || parseFloat(machineparams[3]) > 359.999 || machineparams[3].toString().trim() == '') { errorsArr.push('Homing Offset  must be within ±0.000 to 359.999'); }
    if(parseFloat(machineparams[6]) < 0 || parseFloat(machineparams[6]) > 359.999 || machineparams[6].toString().trim() == '') { errorsArr.push('POT must be within 0 to 359.999'); }
    if(parseFloat(machineparams[7]) < 100 || parseFloat(machineparams[7]) > 3000 || machineparams[7].toString().trim() == '') { errorsArr.push('Finish sig timing must be within 100 to 3000 ms'); }
    if(parseFloat(machineparams[10]) < -359.999 || parseFloat(machineparams[10]) > 0 || machineparams[10].toString().trim() == '') { errorsArr.push('NOT must be within 0 to -359.999'); }
    if(parseFloat(machineparams[11]) < 0 || parseFloat(machineparams[11]) > 359.999 || machineparams[11].toString().trim() == '') { errorsArr.push('Backlash must be within 0 to 359.999'); }

    if((machineparams[0].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[0]))) > 3)) { errorsArr.push('CL/DL Delay can only have a maximum of 3 decial places'); }
    if((machineparams[2].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[2]))) > 3)) { errorsArr.push('Jog feed value can only have a maximum of 3 decial places'); }
    if((machineparams[3].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[3]))) > 3)) { errorsArr.push('Homing Offset can only have a maximum of 3 decial places'); }
    if((machineparams[6].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[6]))) > 3)) { errorsArr.push('POT can only have a maximum of 3 decial places'); }
    if((machineparams[7].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[7]))) > 3)) { errorsArr.push('Finish sig timing can only have a maximum of 3 decial places'); }
    if((machineparams[10].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[10]))) > 3)) { errorsArr.push('NOT can only have a maximum of 3 decial places'); }
    if((machineparams[11].toString().trim() !== '') && (countDecimals(Math.abs(parseFloat(machineparams[11]))) > 4)) { errorsArr.push('Backlash can only have a maximum of 4 decial places'); }
    
    if(errorsArr.length > 0) {
      setErrors(errorsArr);
      setError(true);
      return;
    }

    let cleaned = JSON.parse(JSON.stringify(route.params.settings));
    let data = {...cleaned, 
      cldl_timing: machineparams[0],
      motor_dir: machineparams[1],
      jog_feed: machineparams[2],
      homing_offset: machineparams[3],
      ecs: machineparams[4],
      cl_dl: machineparams[5],
      pot: machineparams[6],
      timing: machineparams[7],
      home_dir: machineparams[8],
      fin_signal: machineparams[9],
      not: machineparams[10],
      back_lash: machineparams[11],
    };
    api.postJSON('dac_params', {A: data}).then(async(resJSON) => {
        route.params.init();
      
        if (
          resJSON &&
          (
            resJSON.status === 'error' ||
            resJSON.error
          )
        ) {
          setMessage('');
          setErrors([
            resJSON.error ||
            'Machine parameters could not be saved.'
          ]);
          setError(true);
        } else {
          setError(false);
          setErrors([]);
          setMessage('Machine parameters saved successfully');
        }
      
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      
        const msg =
          e?.response?.data?.error ||
          e?.message ||
          'Machine parameters could not be saved.';
      
        setMessage('');
        setErrors([msg]);
        setError(true);
        setLoading(false);
      });
    setCurrfield(null);
  };



  return (
    <>
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={styles.containerStart}>
        <View style={[styles.rowBetween, styles.itemsStretch, styles.pt50, styles.px20, styles.flex1, ]}>
          <View style={[styles.flex3, styles.pr20, { position: 'relative' } ]}>
            <View style={[styles.flex1, styles.mb30]}>
              <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20]}>
                <Ionicons name="settings-outline" size={15} color="#fffa" style={styles.mr10} />
                <Text style={styles.title1}>MACHINE PARAMETERS</Text>
              </LinearGradient>
              <View style={[styles.widgetBody, { maxHeight: height * 0.55 }]}>
                <ScrollView>
              
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1]}>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>CL/DL DELAY (ms)</Text>
                        <TouchableOpacity style={styles.data2Col}
                            onPress={async ()=>{
                                await setCursor(0);
                                await setCurrfield(0);
                                setCursor(machineparams[0].toString().length);
                            }}
                            >
                            <TextInput
                                ref={el => itemsRef.current[0] = el} 
                                style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (0))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                selection={{start: cursor, end: cursor}}
                                value={machineparams[0]}
                                onChangeText={(e)=>{}}
                                showSoftInputOnFocus={false}
                                autoFocus={false}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>MOTOR DIR</Text>
                      <TouchableOpacity style={styles.data2Col} onPress={async()=>{ 
                        console.log(machineparams[1]);
                          let temp = await JSON.parse(JSON.stringify(machineparams));
                          temp[1] = await machineparams[1] == 0 ? 1 : 0;
                          await setMachineparams(temp);
                          await setCurrfield(null);
                          nullRef.current.focus();
                        }}>
                        <Text style={styles.setting2Val}>{machineparams[1] == 1 ? '+ve' : '-ve'}</Text>
                      </TouchableOpacity>
                    </View>
                    {/* FEATURE 2 PATCH: JOG FEED is display-only. Manual screen owns live Jog speed. */}
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>JOG FEED</Text>
                      <View style={styles.data2Col}>
                        <Text style={[styles.body1, styles.px10, styles.textCenter, styles.py10, {borderColor: '#35a0', borderWidth: 2}]}>
                          {machineparams[2]}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>HOME OFFSET</Text>
                        <TouchableOpacity style={styles.data2Col}
                            onPress={async ()=>{
                                await setCursor(0);
                                await setCurrfield(3);
                                setCursor(machineparams[3].toString().length);
                            }}
                            >
                            <TextInput
                                ref={el => itemsRef.current[3] = el} 
                                style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (3))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                selection={{start: cursor, end: cursor}}
                                value={machineparams[3]}
                                onChangeText={(e)=>{}}
                                showSoftInputOnFocus={false}
                                autoFocus={false}
                                />
                        </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1]}>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>ECS</Text>
                      <TouchableOpacity style={styles.data2Col} onPress={async()=>{ 
                        let temp = await JSON.parse(JSON.stringify(machineparams));
                        temp[4] = await machineparams[4] == 0 ? 1 : 0;
                        await setMachineparams(temp);
                        await setCurrfield(null);
                        nullRef.current.focus();
                        }}>
                        <Text style={styles.setting2Val}>{machineparams[4]}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>CL/DCL</Text>
                      <TouchableOpacity style={styles.data2Col} onPress={async()=>{ 
                        let temp = await JSON.parse(JSON.stringify(machineparams));
                        temp[5] = await machineparams[5] == 0 ? 1 : 0;
                        await setMachineparams(temp);
                        await setCurrfield(null);
                        nullRef.current.focus();
                        }}>
                        <Text style={styles.setting2Val}>{machineparams[5]}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>POT</Text>
                        <TouchableOpacity style={styles.data2Col}
                            onPress={async ()=>{
                                await setCursor(0);
                                await setCurrfield(6);
                                setCursor(machineparams[6].toString().length);
                            }}
                            >
                            <TextInput
                                ref={el => itemsRef.current[6] = el} 
                                style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (6))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                selection={{start: cursor, end: cursor}}
                                value={machineparams[6]}
                                onChangeText={(e)=>{}}
                                showSoftInputOnFocus={false}
                                autoFocus={false}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>Finish Sig Timing (ms)</Text>
                        <TouchableOpacity style={styles.data2Col}
                            onPress={async ()=>{
                                await setCursor(0);
                                await setCurrfield(7);
                                setCursor(machineparams[7].toString().length);
                            }}
                            >
                            <TextInput
                                ref={el => itemsRef.current[7] = el} 
                                style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (7))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                selection={{start: cursor, end: cursor}}
                                value={machineparams[7]}
                                onChangeText={(e)=>{}}
                                showSoftInputOnFocus={false}
                                autoFocus={false}
                                />
                        </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.rowBetween, styles.itemsStretch, styles.flex1]}>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>HOME DIR</Text>
                      <TouchableOpacity style={styles.data2Col} onPress={async()=>{ 
                        console.log(machineparams[8]);
                          let temp = await JSON.parse(JSON.stringify(machineparams));
                          temp[8] = await machineparams[8] == 0 ? 1 : 0;
                          await setMachineparams(temp);
                          await setCurrfield(null);
                          nullRef.current.focus();
                        }}>
                        <Text style={styles.setting2Val}>{machineparams[8] == 1 ? '+ve' : '-ve'}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>FIN SIGNAL</Text>
                      <TouchableOpacity style={styles.data2Col} onPress={async()=>{ 
                        let temp = await JSON.parse(JSON.stringify(machineparams));
                        temp[9] = await machineparams[9] == 0 ? 1 : 0;
                        await setMachineparams(temp);
                        await setCurrfield(null);
                        nullRef.current.focus();
                        }}>
                        <Text style={styles.setting2Val}>{machineparams[9]}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>NOT</Text>
                        <TouchableOpacity style={styles.data2Col}
                            onPress={async ()=>{
                                await setCursor(0);
                                await setCurrfield(10);
                                setCursor(machineparams[10].toString().length);
                            }}
                            >
                            <TextInput
                                ref={el => itemsRef.current[10] = el} 
                                style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (10))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                selection={{start: cursor, end: cursor}}
                                value={machineparams[10]}
                                onChangeText={(e)=>{}}
                                showSoftInputOnFocus={false}
                                autoFocus={false}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.settingBlock}>
                      <Text style={styles.subtitle1}>BACKLASH</Text>
                        <TouchableOpacity style={styles.data2Col}
                            onPress={async ()=>{
                                await setCursor(0);
                                await setCurrfield(11);
                                setCursor(machineparams[11].toString().length);
                            }}
                            >
                            <TextInput
                                ref={el => itemsRef.current[11] = el} 
                                style={[styles.body1, styles.px10, styles.textCenter, styles.py10, ((currfield !== null) && (currfield == (11))) ? {borderColor: '#35a', borderWidth: 2} : {borderColor: '#35a0', borderWidth: 2} ]}
                                selection={{start: cursor, end: cursor}}
                                value={machineparams[11]}
                                onChangeText={(e)=>{}}
                                showSoftInputOnFocus={false}
                                autoFocus={false}
                                />
                        </TouchableOpacity>
                    </View>
                  </View>
                  
                </ScrollView>
              </View>  
              <View style={{ marginTop: 25, width: '35%' }}>
              <TouchableOpacity onPress={() => {
                  const next = rs232Enabled ? 0 : 1;
                  // Backend is the source of truth.
                  // Do not locally change rs232Enabled here.
                  // UI button updates only after backend sends rs232_status.
                  handleSend('rs232_toggle', { Data: String(next) });
                }}>
                  <LinearGradient
                    colors={
                      rs232Enabled
                        ? [COLORS.green1, COLORS.green2]
                        : [COLORS.red1, COLORS.red2]
                    }
                    style={styles.btn}
                  >
                    <Text style={styles.btnTxtRed}>
                      RS232 {rs232Enabled ? 'ON' : 'OFF'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ handleSubmit(); }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Ionicons name="ios-save-outline" size={20} color="#fffa" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ 
              handleSend('resetMultiTurn', {});
             }}>
              <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                <Ionicons name="ios-checkmark-sharp" size={20} color="#fffa" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>RESET MULTITURN DATA</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ navigation.goBack(); }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Ionicons name="chevron-back-sharp" size={20} color="#fffc" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>BACK</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{}} ref={el => nullRef.current = el} >
                { currfield !== null &&
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

export default MachineParameters;
