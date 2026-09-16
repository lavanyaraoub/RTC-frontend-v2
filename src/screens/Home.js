import React from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles';

import { LinearGradient } from 'expo-linear-gradient';

import HomeStatusPanel from '../components/panels/HomeStatusPanel';


const Home = ({ navigation }) => {

  return (

    <ImageBackground
      style={styles.imgBg}
      width={width}
      source={require('../img/bg.png')}
    >

      <TouchableOpacity
        onPress={() => {
          navigation.navigate(
            'RemoteScreens',
            {
              screen:
                'RemoteScreens'
            }
          );
        }}
        style={[
          {
            marginRight:
              25,

            marginTop:
              30,

            alignSelf:
              'flex-end'
          }
        ]}
      >
        <View
          style={
            styles.row0End
          }
        >
          <MaterialCommunityIcons
            name="remote"
            size={24}
            color="#ffff"
          />
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => {
          navigation.navigate(
            'NotePadScreens',
            {
              screen:
                'NotePadScreens'
            }
          );
        }}
        style={[
          {
            marginRight:
              25,

            alignSelf:
              'flex-end'
          }
        ]}
      >
        <View
          style={[
            styles.row0End,
            {
              marginTop:
                30
            }
          ]}
        >
          <MaterialCommunityIcons
            name="note"
            size={24}
            color="#ffff"
          />
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'TextProgramScreen'
          )
        }
        style={[
          {
            marginRight:
              25,

            alignSelf:
              'flex-end'
          }
        ]}
      >
        <View
          style={[
            styles.row0End,
            {
              marginTop:
                30
            }
          ]}
        >
          <Image
            source={require('../img/text_program_logo.png')}
            style={{
              width:
                24,

              height:
                24
            }}
          />
        </View>
      </TouchableOpacity>


      {/*
       * =====================================================
       * HOME-ONLY STATUS COMPONENT
       * =====================================================
       *
       * All dashboard styles and socket display listeners are
       * isolated inside HomeStatusPanel.js.
       *
       * Global styles.js is NOT modified.
       */}
      <HomeStatusPanel />


      {/*
       * Existing Home navigation buttons.
       * Routes / behavior unchanged.
       */}
      <View
        style={[
          styles.containerCenter,
          {
            justifyContent:
              'flex-end',

            paddingBottom:
              18,

            pointerEvents:
              'box-none'
          }
        ]}
      >

        <View
          style={
            styles.rowCenter
          }
        >

          <TouchableOpacity
            style={
              styles.btnHome
            }
            onPress={() => {
              navigation.navigate(
                'ManualScreens',
                {
                  screen:
                    'Manual'
                }
              );
            }}
          >
            <LinearGradient
              colors={[
                '#3f3f3f',
                '#010101'
              ]}
              style={
                styles.gradientHome
              }
            >
              <Image
                source={require('../img/home/manual.png')}
                style={
                  styles.icnHome
                }
              />

              <Text
                style={
                  styles.btnTxtHome
                }
              >
                Manual
              </Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.btnHome
            }
            onPress={() => {
              navigation.navigate(
                'ProgramScreens',
                {
                  screen:
                    'Program'
                }
              );
            }}
          >
            <LinearGradient
              colors={[
                '#3f3f3f',
                '#010101'
              ]}
              style={
                styles.gradientHome
              }
            >
              <Image
                source={require('../img/home/program.png')}
                style={
                  styles.icnHome
                }
              />

              <Text
                style={
                  styles.btnTxtHome
                }
              >
                Program
              </Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.btnHome
            }
            onPress={() => {
              navigation.navigate(
                'AutoScreens',
                {
                  screen:
                    'Auto'
                }
              );
            }}
          >
            <LinearGradient
              colors={[
                '#3f3f3f',
                '#010101'
              ]}
              style={
                styles.gradientHome
              }
            >
              <Image
                source={require('../img/home/auto.png')}
                style={
                  styles.icnHome
                }
              />

              <Text
                style={
                  styles.btnTxtHome
                }
              >
                Auto
              </Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.btnHome
            }
            onPress={() => {
              navigation.navigate(
                'SettingScreens',
                {
                  screen:
                    'Setting'
                }
              );
            }}
          >
            <LinearGradient
              colors={[
                '#3f3f3f',
                '#010101'
              ]}
              style={
                styles.gradientHome
              }
            >
              <Image
                source={require('../img/home/settings.png')}
                style={
                  styles.icnHome
                }
              />

              <Text
                style={
                  styles.btnTxtHome
                }
              >
                Setting
              </Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.btnHome
            }
            onPress={() => {
              navigation.navigate(
                'AboutScreens',
                {
                  screen:
                    'Help'
                }
              );
            }}
          >
            <LinearGradient
              colors={[
                '#3f3f3f',
                '#010101'
              ]}
              style={
                styles.gradientHome
              }
            >
              <Image
                source={require('../img/home/help.png')}
                style={
                  styles.icnHome
                }
              />

              <Text
                style={
                  styles.btnTxtHome
                }
              >
                HELP
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

      </View>

    </ImageBackground>
  );
};


export default Home;
