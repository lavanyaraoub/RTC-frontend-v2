import React, { } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';

const Settings = ({ navigation }) => {

  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    api.getJSON('dac_params').then(async (resJSON) => {
      setSettings(resJSON.resp.A);
      setLoading(false);
    })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={styles.containerStart}>
        <View style={[styles.rowBetween, styles.itemsStart, styles.pt20, styles.px20, styles.flex1,]}>
          <View style={[styles.flex1, styles.justifyCenter, styles.itemsCenter, styles.mr30, { backgroundColor: '#0006', borderRadius: 10, }, styles.py20, styles.px30]}>
            <Image source={require('../../img/lock.png')} style={[styles.icnHome, styles.mr5, styles.mb30]} />
            <TouchableOpacity style={styles.w100p} onPress={() => { navigation.goBack(); }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Ionicons name="chevron-back-sharp" size={20} color="#fffd" style={styles.mr5} />
                <Text style={styles.btnTxtRed}>BACK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={[styles.flex4, styles.pr20, styles.pb30]}>
            <View style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20, styles.itemsCenter, styles.justifyCenter]}>
              <Ionicons name="ios-settings-sharp" size={14} color="#fffa" style={styles.mr5} />
              <Text style={styles.title1}>SETTINGS</Text>
            </View>
            <View style={[{ backgroundColor: '#fff1' }, styles.pt40, styles.pb30]}>
              <View style={styles.rowCenter}>
                <TouchableOpacity style={styles.btnSettings} onPress={() => { navigation.navigate('SettingScreens', { screen: 'MachineParameters', params: { settings, init: fetchData } }) }}>
                  <LinearGradient colors={['#3f3f3f', '#010101']} style={styles.gradientSettings}>
                    <Image source={require('../../img/setting/setting1.png')} style={[styles.icnSetting, styles.mr5]} />
                    <Text style={styles.btnTxtSettings}>
                      Machine{'\n'}Parameter
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSettings} onPress={() => { navigation.navigate('SettingScreens', { screen: 'PitchError', params: { settings, init: fetchData } }) }}>
                  <LinearGradient colors={['#3f3f3f', '#010101']} style={styles.gradientSettings}>
                    <Image source={require('../../img/setting/setting2.png')} style={[styles.icnSetting, styles.mr5]} />
                    <Text style={styles.btnTxtSettings}>
                      Pitch{'\n'}Compensation
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={[styles.rowCenter, styles.mt40]}>
                <TouchableOpacity style={styles.btnSettings} onPress={() => { navigation.navigate('SettingScreens', { screen: 'PositionOffsets', params: { settings, init: fetchData } }) }}>
                  <LinearGradient colors={['#3f3f3f', '#010101']} style={styles.gradientSettings}>
                    <Image source={require('../../img/setting/setting3.png')} style={[styles.icnSetting, styles.mr5]} />
                    <Text style={styles.btnTxtSettings}>
                      Position{'\n'}Offset
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSettings} onPress={() => { navigation.navigate('SettingScreens', { screen: 'BPF', params: { settings, init: fetchData } }) }}>
                  <LinearGradient colors={['#3f3f3f', '#010101']} style={styles.gradientSettings}>
                    <Image source={require('../../img/setting/setting4.png')} style={[styles.icnSetting, styles.mr5]} />
                    <Text style={styles.btnTxtSettings}>
                      BPF
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Settings;




