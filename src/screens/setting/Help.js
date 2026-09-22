import React, {useState, useContext, useCallback, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
const {width, height} = Dimensions.get('window');
import { useFocusEffect } from '@react-navigation/native';

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {SocketContext} from '../../helpers/SocketContext';
import { CommonActions } from '@react-navigation/native';

const Help = ({navigation}) => {
  const socket = useContext(SocketContext);
  
  const [loading, setLoading] = React.useState(false);
  const [support, setSupport] = React.useState(null);

  const [error, setError] = React.useState(false);
  const [msg, setMsg] = React.useState('No Errors');

  const handleAlarm = useCallback((data) => {
      if(data == 'No Alarms') {
          setError(false);
      }
      else {
          if(!error) {
              setError(true);
              setMsg(data);
          }
      }
    }, []);

  const handleSystemNotice = useCallback((data) => {
      const notice =
          data && data.data !== undefined
              ? data.data
              : data;

      if(notice) {
          setError(true);
          setMsg(notice);
      }
    }, []);  
  
  const fetchData = async() => {
    setLoading(true);
      api.getJSON('support').then(async(resJSON) => {
        setSupport(resJSON);
      setLoading(false);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }
  
  const handleSend = useCallback((ev, req) => {
    socket.emit(ev, req);
  }, []);

  React.useEffect(()=>{
    fetchData();
  }, []); 


  useFocusEffect(
    React.useCallback(() => {
      return () => {
          setError(false);
      };
    }, [])
  );

  useEffect(()=>{
      socket.on("alarm_error", handleAlarm);
      socket.on("system_notice", handleSystemNotice);

      return () => {
          socket.off("alarm_error", handleAlarm);
          socket.off("system_notice", handleSystemNotice);
      };
  }, [socket, handleAlarm, handleSystemNotice]);

  
  return (
    <>
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={styles.containerStart}>
        <View style={[styles.rowBetween, styles.itemsStretch, styles.pt50, styles.px20, styles.flex1 ]}>
          <View style={[styles.flex3, styles.pr20, ]}>
            <View style={[styles.flex1, styles.mb30]}>
              <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20]}>
                <Ionicons name="ios-folder-open-sharp" size={15} color="#fffa" style={styles.mr10} />
                <Text style={styles.title1}>SUPPORT</Text>
              </LinearGradient>
              <ScrollView style={[styles.widgetBody, styles.flex1]}>
                <View style={[styles.rowBetween, styles.itemsStretch]}>
                  <View style={[styles.helpBlock, styles.px30]}>
                    <Text style={[styles.subtitleLeft1, styles.mb15]}>SERVICE</Text>
                    <Text style={[styles.body3, styles.mb5]}>{support == null ? "-" : support.service.contact}</Text>
                    <Text style={styles.body3}>{support == null ? "-" : support.service.email}</Text>
                  </View>
                  <View style={[styles.helpBlock, styles.px30]}>
                    <Text style={[styles.subtitleLeft1, styles.mb15]}>SALES</Text>
                    <Text style={[styles.body3, styles.mb5]}>{support == null ? "-" : support.sales.contact}</Text>
                    <Text style={styles.body3}>{support == null ? "-" : support.sales.email}</Text>
                  </View>
                </View>
                <View style={[styles.helpBlock, styles.px30]}>
                    <View style={[styles.rowFStart, styles.mb15]}>
                      <Text style={[styles.subtitleLeft1, {width: 200}]}>
                        SOFTWARE VERSION
                      </Text>
                      <Text style={[styles.settingVal2, styles.ml20]}>
                        {support == null ? "-" : support.software_version}
                      </Text>
                    </View>
                    <View style={styles.rowFStart}>
                      <Text style={[styles.subtitleLeft1, {width: 200}]}>
                        UI VERSION
                      </Text>
                      <Text style={[styles.settingVal2, styles.ml20]}>
                        {support == null ? "-" : support.version}
                      </Text>
                    </View>
                    <View style={[styles.mt30, styles.row0Start]}>
                      <TouchableOpacity onPress={()=>{ handleSend('check_system_update', {"status": ""});  }}>
                        <LinearGradient colors={[COLORS.gray1, COLORS.gray2]} style={styles.btn}>
                          <Text style={styles.btnTxtRed}>Check for updates</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>{ handleSend('perform_system_update', {"status": ""}); }} style={styles.ml15}>
                        <LinearGradient colors={[COLORS.gray1, COLORS.gray2]} style={styles.btn}>
                          <Text style={styles.btnTxtRed}>Update</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async ()=>{ 
                        try {
                          const checkData = await api.getJSON('rollback/check');
                          if(checkData.status !== 'success') {
                            setError(true);
                            setMsg('No backup available to restore.');
                            return;
                          }
                          await api.postJSON('rollback/apply', {});
                        } catch(e) {
                          // Connection drop is expected — jamun exits to trigger systemd restart
                          // The alarm from the backend already shows before exit
                        }
                        }} style={styles.ml15}>
                        <LinearGradient colors={[COLORS.gray1, COLORS.gray2]} style={styles.btn}>
                          <Text style={styles.btnTxtRed}>Restore Backup</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                
              </ScrollView>
            </View>
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>

            <View style={[styles.rowCols, styles.well, styles.mb10]}>
              <TouchableOpacity disabled style={styles.flex1}>
                <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btnFull}>
                    <Text style={styles.btnTxtRed}>SUPPORT</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flex1} onPress={()=>{ 
                navigation.navigate('AboutScreens', {screen: 'Faq'});
              }}>
                <LinearGradient colors={['#0000', '#0000']} style={styles.btnFull}>
                    <Text style={styles.btnTxtRed}>FAQ</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
        { error &&
        <Animatable.View style={styles.modalWrap} animation="slideInUp" duration={300}>
            <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.w100p}>
                <View style={styles.modalInner}>
                    <View style={styles.modalHeader}>
                        <View style={styles.row0Start}>
                            <Ionicons name="notifications-outline" size={20} color="#fffa" style={styles.mr10} />
                            <Text style={styles.body1}>ALARM STATUS</Text>
                        </View>
                        <TouchableOpacity style={[styles.pl20, styles.py15]} onPress={()=>{ setError(false); }}>
                            <Ionicons name="ios-close" size={20} color="#fffa" style={styles.mr10} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.rowBetween}>
                            <Text style={[styles.body1, styles.mr20]}>
                                ALARMS/ ERRORS
                            </Text>
                            <View style={styles.alarmBg}>
                                <Text style={styles.body3}>
                                    {msg}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Animatable.View>}
    </>
  );
};

export default Help;




