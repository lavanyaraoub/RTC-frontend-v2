import React, { useState, useRef} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, Dimensions, TextInput } from 'react-native';
const {width, height} = Dimensions.get('window');

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from '../../styles';
import COLORS from '../../colors';
import FullKeypad from '../../components/FullKeypad';
import api from '../../helpers/Api';

const Setting = ({navigation}) => {

  const [code, setCode] = useState('');
  const [pass, setPass] = useState('1986');
  const [cursor, setCursor] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const itemsRef = useRef(null);



  const fetchData = async() => {
    setLoading(true);
      api.getJSON('password').then(async(resJSON) => {
        console.log(':response:', resJSON);
        if(resJSON.resp) {
          if(resJSON.resp.code) {
            setPass(resJSON.resp.code);            
          }
        }
        setLoading(false);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }

  React.useEffect(()=>{
    fetchData();
  }, []); 

  setTimeout(() => {
    if(itemsRef && itemsRef.current) {
      itemsRef.current.focus();
    }
  }, 800);


  return (
    <>
      <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
        <View style={styles.containerStretch}>


          <View style={[styles.row0Start, styles.mb15]}>
            <Ionicons name="lock-closed" size={20} color="#fffa" style={styles.mr10} />
            <Text style={styles.title1}>Please enter your password to access</Text>
          </View>
          <View style={[styles.row0Between]}>
          <TextInput
            ref={el => itemsRef.current = el} 
            style={[styles.flex1, styles.mr40, styles.code1, styles.px10, styles.input2 ]}
            multiline={false}
            selection={{start: cursor, end: cursor}}
            value={code}
            showSoftInputOnFocus={false}
            placeholder="Password"
            autoFocus
            secureTextEntry
            />
            <TouchableOpacity style={code.trim() == '' ? {opacity: '0.5'} : {opacity: '1'}} disabled={code.trim() == ''} onPress={()=>{ 
              if(code == pass) {
                setCode('');
                navigation.navigate('SettingScreens', {screen: 'Settings'})
              } 
              else { setError(true); }
              }}>
              <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                <Ionicons name="ios-checkmark-sharp" size={20} color="#fffa" style={styles.mr10} />
                <Text style={styles.btnTxtRed}>Get Access</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <FullKeypad  
            code={code} cursor={cursor} 
            setCode={setCode} setCursor={setCursor} 
            itemsRef={itemsRef}
            />
        </View>
      </ImageBackground>
      {error &&
      <View style={styles.toastWrap}>
        <View style={styles.toastInner}>
          <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.toastInner}>
            <View style={styles.mb20}>
              <View style={[styles.row0Start, styles.mb10]}>
                <Ionicons name="close-circle" size={24} color="#fffa" style={styles.mr10} />
                <Text style={styles.body3}>Incorrect password. Please try  again.</Text>
              </View>
            </View>
            <TouchableOpacity style={{}} onPress={()=>{ setError(false); itemsRef.current.focus(); }}>
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

export default Setting;




