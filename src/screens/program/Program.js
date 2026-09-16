import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
const {width, height} = Dimensions.get('window');

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import Stats from '../../components/Stats'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Program = ({navigation}) => {
  
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  
  const fetchData = async() => {
    setLoading(true);
    api.getJSON('programs').then(async(resJSON) => {
      setPrograms(resJSON.files == null ? [] : resJSON.files);
      setLoading(false);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Listen for gm_codes updates broadcasted by SocketContext
    const handleGMCodesUpdate = () => {
      console.log("gm_codes folder updated — reloading program list...");
      fetchData();
    };

    window.addEventListener("gm_codes_update", handleGMCodesUpdate);

    return () => {
      window.removeEventListener("gm_codes_update", handleGMCodesUpdate);
    };
  }, []);
 
  return (
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={styles.containerStart}>
        <Stats location="PROGRAM" navigation={navigation} />
        <View style={[styles.rowBetween, styles.itemsStart, styles.pt20, styles.px20, styles.flex1, ]}>
          <View style={[styles.flex3, styles.pr20, {height: '100%'}]}>
            <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20]}>
              <Ionicons name="ios-folder-open-sharp" size={15} color="#fffa" style={styles.mr10} />
              <Text style={styles.title1}>PROGRAM</Text>
            </LinearGradient>
            <ScrollView style={[styles.widgetBody, styles.flex1]}>
              { loading == true ? 
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" />
              </View>
              :
              programs.length < 1 ? 
              <View style={styles.emptyWrap}>
                  <Text style={styles.emptyTxt}>No programs found</Text>
              </View>
              :
              programs.map((program, programIdx)=> (
                <TouchableOpacity
                  key={programIdx}
                  style={[styles.row0Start, programIdx%2 == 0 ? styles.oddRow : styles.evenRow]}
                  onPress={()=>{ navigation.navigate('ProgramScreens', {screen: 'ViewProgram', params: {filename: program, init: fetchData}}) }}
                  >
                  <View style={[styles.px20, styles.py15, styles.bR1]}>
                    <Text style={styles.body1}>{programIdx+1}</Text>
                  </View>
                  <View style={[styles.flex1, styles.pl20, styles.py15 ]}>
                    <Text style={styles.body1}>{program}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ navigation.navigate('ProgramScreens', {screen: 'Code'}) }}>
              <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                <Ionicons name="ios-checkmark-sharp" size={20} color="#fffa" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>NEW</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Program;




