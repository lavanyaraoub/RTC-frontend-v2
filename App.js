import * as React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { useDispatch, useSelector, Provider } from "react-redux";
import COLORS from './src/colors';
import styles from './src/styles';

import store from './src/redux/configureStore'

import Home from './src/screens/Home';
import Manual from './src/screens/manual/Manual';
import Program from './src/screens/program/Program';
import ViewProgram from './src/screens/program/ViewProgram';
import Code from './src/screens/program/Code';
import Auto from './src/screens/auto/Auto';
import Setting from './src/screens/setting/Setting';
import Settings from './src/screens/setting/Settings';
import MachineParameters from './src/screens/setting/MachineParameters';
import PitchError from './src/screens/setting/PitchError';
import PositionOffsets from './src/screens/setting/PositionOffsets';
import BPF from './src/screens/setting/BPF';
import Help from './src/screens/setting/Help';
import Faq from './src/screens/setting/Faq';
import TextProgramScreen from './src/screens/TextProgramScreen/TextProgramScreen';

import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

import { setWsStatus } from './src/redux/ducks/wsocket';
import { SocketContext, socket } from './src/helpers/SocketContext';
import RemoteScreen from './src/screens/remote/RemoteScreen';
import WifiPanel from './src/components/panels/WifiPanel';
import Hotspot from './src/components/panels/Hotspot';
import { setHotspot, setWifi } from './src/redux/ducks/panel';
import WifiSettings from './src/components/panels/WifiSettings';
import NotePadScreen from './src/screens/notepad/Notepad';


const ManualStack = createStackNavigator();

function ManualScreens() {
  return (
    <ManualStack.Navigator>
      <ManualStack.Screen
        name="Manual"
        component={Manual}
        options={{ headerShown: false }}
      />
    </ManualStack.Navigator>
  );
}


const ProgramStack = createStackNavigator();

function ProgramScreens() {
  return (
    <ProgramStack.Navigator>
      <ProgramStack.Screen
        name="Program"
        component={Program}
        options={{ headerShown: false }}
      />

      <ProgramStack.Screen
        name="ViewProgram"
        component={ViewProgram}
        options={{ headerShown: false }}
      />

      <ProgramStack.Screen
        name="Code"
        component={Code}
        options={{ headerShown: false }}
      />
    </ProgramStack.Navigator>
  );
}


const AutoStack = createStackNavigator();

function AutoScreens() {
  return (
    <AutoStack.Navigator>
      <AutoStack.Screen
        name="Auto"
        component={Auto}
        options={{ headerShown: false }}
      />
    </AutoStack.Navigator>
  );
}


const SettingStack = createStackNavigator();

function SettingScreens() {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
      />

      <SettingStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />

      <SettingStack.Screen
        name="MachineParameters"
        component={MachineParameters}
        options={{ headerShown: false }}
      />

      <SettingStack.Screen
        name="PitchError"
        component={PitchError}
        options={{ headerShown: false }}
      />

      <SettingStack.Screen
        name="PositionOffsets"
        component={PositionOffsets}
        options={{ headerShown: false }}
      />

      <SettingStack.Screen
        name="BPF"
        component={BPF}
        options={{ headerShown: false }}
      />
    </SettingStack.Navigator>
  );
}


const AboutStack = createStackNavigator();

function AboutScreens() {
  return (
    <AboutStack.Navigator>
      <AboutStack.Screen
        name="Help"
        component={Help}
        options={{ headerShown: false }}
      />

      <AboutStack.Screen
        name="Faq"
        component={Faq}
        options={{ headerShown: false }}
      />
    </AboutStack.Navigator>
  );
}


function CustomDrawerContent(props) {
  return (
    <View
      style={{
        backgroundColor: '#282828',
        display: 'flex',
        height: '100%',
        width: 200
      }}
    >

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate(
            'ManualScreens',
            {
              screen: 'Manual'
            }
          );
        }}
      >
        <LinearGradient
          style={styles.gradDrawerItem}
          colors={
            props.state.index == 1
              ? [COLORS.drawerInactive1, COLORS.drawerInactive2]
              : [COLORS.drawerActive1, COLORS.drawerActive2]
          }
        >
          <Image
            source={
              props.state.index == 1
                ? require('./src/img/home/manual.png')
                : require('./src/img/home/disabled/manual.png')
            }
            style={styles.icnDrawer}
          />

          <Text
            style={
              props.state.index == 1
                ? styles.drawerActiveLabel
                : styles.drawerLabel
            }
          >
            MANUAL
          </Text>
        </LinearGradient>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate(
            'ProgramScreens',
            {
              screen: 'Program'
            }
          );
        }}
      >
        <Image
          source={
            props.state.index == 2
              ? require('./src/img/home/program.png')
              : require('./src/img/home/disabled/program.png')
          }
          style={styles.icnDrawer}
        />

        <Text
          style={
            props.state.index == 2
              ? styles.drawerActiveLabel
              : styles.drawerLabel
          }
        >
          PROGRAM
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate(
            'AutoScreens',
            {
              screen: 'Auto'
            }
          );
        }}
      >
        <Image
          source={
            props.state.index == 3
              ? require('./src/img/home/auto.png')
              : require('./src/img/home/disabled/auto.png')
          }
          style={styles.icnDrawer}
        />

        <Text
          style={
            props.state.index == 3
              ? styles.drawerActiveLabel
              : styles.drawerLabel
          }
        >
          AUTO
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate(
            'SettingScreens',
            {
              screen: 'Setting'
            }
          );
        }}
      >
        <Image
          source={
            props.state.index == 4
              ? require('./src/img/home/settings.png')
              : require('./src/img/home/disabled/settings.png')
          }
          style={styles.icnDrawer}
        />

        <Text
          style={
            props.state.index == 4
              ? styles.drawerActiveLabel
              : styles.drawerLabel
          }
        >
          SETTING
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate(
            'AboutScreens',
            {
              screen: 'Help'
            }
          );
        }}
      >
        <Image
          source={
            props.state.index == 5
              ? require('./src/img/home/help.png')
              : require('./src/img/home/disabled/help.png')
          }
          style={styles.icnDrawer}
        />

        <Text
          style={
            props.state.index == 5
              ? styles.drawerActiveLabel
              : styles.drawerLabel
          }
        >
          HELP
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Home');
        }}
      >
        <Ionicons
          name="ios-home-sharp"
          size={32}
          color={
            props.state.index == 0
              ? "#fffa"
              : "#fff4"
          }
          style={styles.mb20}
        />

        <Text
          style={
            props.state.index == 0
              ? styles.drawerActiveLabel
              : styles.drawerLabel
          }
        >
          HOME
        </Text>
      </TouchableOpacity>

    </View>
  );
}


const Drawer = createDrawerNavigator();


const MainStack = () => {

  const { wsStatus } = useSelector(
    state => state.socket
  );

  const { running, jog } = useSelector(
    state => state.auto
  );

  const {
    isWifi,
    isHotspot,
    isWifiSetting,
    loading,
    isHotspotEnable
  } = useSelector(
    state => state.panel
  );

  const dispatch = useDispatch();


  /*
   * =====================================================
   * SOCKET CONNECTION STATUS LISTENERS
   * =====================================================
   *
   * BUG FIX:
   *
   * Previously socket.on() was called directly inside the
   * MainStack render body.
   *
   * Every Redux / React re-render therefore registered a
   * NEW connect / disconnect / connect_error listener.
   *
   * This caused listeners to accumulate over time.
   *
   * Register listeners once through useEffect and remove
   * exactly those listeners when MainStack unmounts.
   *
   * Existing behavior / event names / Redux logic remain
   * unchanged.
   * =====================================================
   */
  React.useEffect(() => {

    const handleSocketConnect = () => {
      dispatch(
        setWsStatus(1)
      );
    };


    const handleSocketDisconnect = () => {
      dispatch(
        setWsStatus(0)
      );
    };


    const handleSocketConnectError = (err) => {
      console.log(
        "err",
        err
      );
    };


    socket.on(
      "connect",
      handleSocketConnect
    );

    socket.on(
      "disconnect",
      handleSocketDisconnect
    );

    socket.on(
      "connect_error",
      handleSocketConnectError
    );


    return () => {

      socket.off(
        "connect",
        handleSocketConnect
      );

      socket.off(
        "disconnect",
        handleSocketDisconnect
      );

      socket.off(
        "connect_error",
        handleSocketConnectError
      );

    };

  }, [dispatch]);


  const wifiOpen = () => {
    dispatch(
      setWifi(
        !isWifi
      )
    )
  }


  const hotspotOpen = () => {
    dispatch(
      setHotspot(
        !isHotspot
      )
    )
  }


  const [isLoaded] = useFonts({
    "Arimo-Regular": require("./assets/fonts/Arimo/Arimo-Regular.ttf"),
    "Arimo-Medium": require("./assets/fonts/Arimo/Arimo-Medium.ttf"),
    "Arimo-SemiBold": require("./assets/fonts/Arimo/Arimo-SemiBold.ttf"),
    "Arimo-Bold": require("./assets/fonts/Arimo/Arimo-Bold.ttf"),
  });


  if (!isLoaded) {

    return null;

  }
  else {

    return (
      <>

        {
          isWifi &&
          <WifiPanel />
        }


        {
          isHotspot &&
          <Hotspot />
        }


        {
          isWifi &&
          isWifiSetting &&
          <WifiSettings />
        }


        <NavigationContainer>

          <Drawer.Navigator

            initialRouteName="Home"

            drawerContent={
              (props) =>
                <CustomDrawerContent
                  {...props}
                />
            }

            drawerStyle={{
              width: 200
            }}

            screenOptions={(
              {
                navigation,
                route
              }
            ) => ({

              header: () => {

                return (

                  <LinearGradient
                    colors={[
                      '#232323',
                      '#020202'
                    ]}
                    style={styles.header}
                  >

                    {
                      route.name != 'Home' &&

                      <TouchableOpacity

                        style={
                          styles.headerLeft
                        }

                        disabled={
                          (
                            (
                              route.name ==
                              'ManualScreens' &&
                              jog
                            )
                            ||
                            (
                              route.name ==
                              'AutoScreens' &&
                              running
                            )
                          )
                        }

                        onPress={() => {

                          navigation.toggleDrawer();

                        }}
                      >

                        <Ionicons
                          name="menu"
                          size={28}
                          color="#fffa"
                        />

                      </TouchableOpacity>
                    }


                    <View
                      style={
                        styles.headerCenter
                      }
                    >

                      <Image

                        style={{
                          width: 86,
                          height: 20,
                          resizeMode: 'contain',
                        }}

                        source={
                          require(
                            './src/img/logo.png'
                          )
                        }

                      />


                      <Text
                        style={
                          styles.headerTitle
                        }
                      >
                        ROTARY TABLE CONTROLLER
                      </Text>

                    </View>


                    <TouchableOpacity

                      style={
                        styles.headerRight
                      }

                      disabled={
                        isWifi
                      }

                      onPress={() => {
                        hotspotOpen()
                      }}

                    >

                      <View
                        style={{
                          marginRight: 20
                        }}
                      >

                        <MaterialIcons

                          name="wifi-tethering"

                          size={24}

                          color={
                            isWifi
                              ? "#5a5a5a"
                              : "#ffff"
                          }

                        />

                      </View>

                    </TouchableOpacity>


                    <TouchableOpacity

                      style={
                        styles.headerRight
                      }

                      disabled={
                        isHotspot ||
                        isHotspotEnable
                      }

                      onPress={() => {
                        wifiOpen()
                      }}

                    >

                      <View
                        style={{
                          marginRight: 20
                        }}
                      >

                        <AntDesign

                          name="wifi"

                          size={24}

                          color={
                            isHotspot ||
                            isHotspotEnable
                              ? "#5a5a5a"
                              : "#ffff"
                          }

                        />

                      </View>

                    </TouchableOpacity>


                    <TouchableOpacity
                      style={
                        styles.headerRight
                      }
                    >

                      <View

                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor:
                            wsStatus == 1
                              ? 'green'
                              : 'red'
                        }}

                      />


                      <Text
                        style={
                          styles.txtWsStatus
                        }
                      >

                        {
                          wsStatus == 1
                            ? 'Connected'
                            : 'Disconnected'
                        }

                      </Text>

                    </TouchableOpacity>

                  </LinearGradient>

                );
              },

              headerTintColor: '#fff',

            })}
          >

            <Drawer.Screen
              name="Home"
              component={Home}
              options={{
                drawerLabel: 'Home',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="ManualScreens"
              component={ManualScreens}
              options={{
                drawerLabel: 'Manual',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="ProgramScreens"
              component={ProgramScreens}
              options={{
                drawerLabel: 'Program',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="AutoScreens"
              component={AutoScreens}
              options={{
                drawerLabel: 'Auto',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="SettingScreens"
              component={SettingScreens}
              options={{
                drawerLabel: 'Setting',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="AboutScreens"
              component={AboutScreens}
              options={{
                drawerLabel: 'Help',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="RemoteScreens"
              component={RemoteScreen}
              options={{
                drawerLabel: 'Remote',
                headerShown: true
              }}
            />


            <Drawer.Screen
              name="NotePadScreens"
              component={NotePadScreen}
              options={{
                drawerLabel: 'Notepad',
                headerShown: true
              }}
            />


            <Drawer.Screen

              name="TextProgramScreen"

              component={
                TextProgramScreen
              }

              options={{

                drawerLabel:
                  'Text Program',

                headerShown:
                  true,

                // You can hide it from the drawer menu if you want
                drawerItemStyle: {
                  display: 'none'
                }

              }}

            />

          </Drawer.Navigator>

        </NavigationContainer>

      </>
    );

  }
}


export default function App() {

  return (

    <SocketContext.Provider
      value={socket}
    >

      <Provider
        store={store}
      >

        <MainStack />

      </Provider>

    </SocketContext.Provider>

  );
}