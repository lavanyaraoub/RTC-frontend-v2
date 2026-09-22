import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
const { width, height } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SocketContext } from '../../helpers/SocketContext';
import styles from '../../styles';
import COLORS from '../../colors';
import Stats from '../../components/Stats'
import api from '../../helpers/Api';
import Numpad from '../../components/Numpad';
import { setRunning } from '../../redux/ducks/auto';

const Auto = ({ navigation }) => {
  const socket = useContext(SocketContext);
  const { filename, code, running, jog, emergency, reset, zeroref } = useSelector(state => state.auto);
  const [loading, setLoading] = useState(false);
  const [line, setLine] = useState(null);
  const [data, setData] = useState('continuous');
  const [inputValue, setInputValue] = useState('');
  const [cursor, setCursor] = useState(0);
  const [isNumpadVisible, setIsNumpadVisible] = useState(false);
  const [modal, setModal] = React.useState(false);
  const [ecs, setEcs] = React.useState(false);
  const [nextDisabled, setNextDisabled] = React.useState(false);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  // === Clear input when RESET is pressed ===
  useEffect(() => {
    if (reset) {
      setInputValue('');
      setCursor(0);
      //setIsNumpadVisible(false); //optional: also close numpad when reset
    }
  }, [reset]);

  // === Numpad key handling ===
  const keyPress = (keyVal) => {
    console.log("Numpad sent:", keyVal);
    switch (keyVal) {
      case 'BKSP':
        if (cursor > 0) {
          const newValue = inputValue.slice(0, cursor - 1) + inputValue.slice(cursor);
          setInputValue(newValue);
          setCursor(cursor - 1);
        }
        break;
      case 'LEFT':
        if (cursor > 0) {
          setCursor(cursor - 1);
        }
        break;
      case 'RIGHT':
        if (cursor < inputValue.length) {
          setCursor(cursor + 1);
        }
        break;
      default: // numbers
        const newValue = inputValue.substring(0, cursor) + keyVal + inputValue.substring(cursor);
        setInputValue(newValue);
        setCursor(cursor + 1);
        break;
    }
  };

  const handleNumpadEnter = () => {
    if (!inputValue || isNaN(inputValue) || parseInt(inputValue) <= 0) {
      alert('Please enter a valid line number.');
      return;
    }
    console.log(`Sending line number ${inputValue} via WebSocket...`);
    handleSend('save_line_number', { "user_line": inputValue });
    setIsNumpadVisible(false);
  };

  const handleLine = useCallback(data => {
    setLine(data.line);
    try {
      scrollRef.current.scrollTo({
        x: 0,
        y: parseInt(data.line) * 45,
        animated: true,
      });
    } catch (error) {
      console.log('scroll failed', error);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setLine(null);
    dispatch(setRunning(false));
  }, []);

  const handleDest = useCallback(() => {
    setNextDisabled(false);
  }, []);

  const handleSend = useCallback((ev, req) => {
    socket.emit(ev, req);
  }, [socket]);

  const fetchData = async () => {
    setLoading(true);
    api.getJSON('dac_params').then(async (resJSON) => {
      setEcs(resJSON.resp.A.ecs);
      if (resJSON.resp.A.ecs == 1) {
        handleSend('set_program_mode', { "data": "continuous" });
        setData('continuous');
      } else {
        handleSend('set_program_mode', { "data": "single" });
        setData('single');
      }
      setLoading(false);
    })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setLine(null);
      };
    }, [])
  );

  useEffect(() => {
    socket.on("line_number", handleLine);
    socket.on("destination_reached", handleDest);
    socket.on("program_complete", handleComplete);
    return () => {
      socket.off("line_number", handleLine);
      socket.off("destination_reached", handleDest);
      socket.off("program_complete", handleComplete);
    };
  }, [socket, handleLine, handleDest, handleComplete]);

  useFocusEffect(
    React.useCallback(() => {
      setModal(jog);
    }, [jog])
  );

  return (
    <>
      <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
        <View style={styles.containerStart}>
          <Stats location="AUTO" navigation={navigation} />
          <View style={[styles.rowBetween, styles.itemsStart, styles.pt30, styles.px20, styles.flex1]}>
            <View style={[styles.flex2, styles.pr20]}>
              <View style={[styles.flex1, styles.mb50, { borderColor: '#0005', borderWidth: 1, maxHeight: height / 1.4 }]}>
                <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.rowBetween, styles.py10, styles.pl20]}>
                  <View style={styles.row0Start}>
                    <Ionicons name="ios-folder-open-sharp" size={15} color="#fffa" style={styles.mr10} />
                    <Text style={styles.title1}>{filename == null ? 'AUTO' : filename}</Text>
                  </View>
                  <View style={[styles.py5, styles.pr20, styles.row0Between]}>
                    <Text style={styles.title1}>EXECUTING LINE NO</Text>
                    <View style={[styles.px5, styles.ml10, { backgroundColor: '#fff1' }]}>
                      <Text style={[styles.title1, styles.ml20]}>{line == null ? ' ' : line + 1}</Text>
                    </View>
                  </View>
                </LinearGradient>
                {code !== null && <View style={[styles.row0Start, styles.oddRow]}>
                  <View style={[styles.px20, styles.py10, styles.flex1]}>
                    <Text style={styles.title1}>LINE NO</Text>
                  </View>
                  <View style={[styles.flex6, styles.pl20, styles.py10]}>
                    <Text style={styles.title1}>LINE DESCRIPTION</Text>
                  </View>
                </View>}
                <ScrollView ref={el => scrollRef.current = el} style={[styles.widgetBody, styles.flex1]}>
                  {code == null ?
                    <View style={styles.emptyWrap}>
                      <Text style={styles.emptyTxt}>No program selected</Text>
                    </View>
                    :
                    code.map((statement, statementIdx) => (
                      statement.trim() !== "" &&
                      <View style={[styles.row0Start, styles.codeRow, statementIdx % 2 == 0 ? styles.evenRow : styles.oddRow, line == statementIdx && { backgroundColor: 'rgba(52, 158, 72, 0.49)' }]} key={statementIdx}>
                        <View style={[styles.px20, styles.py10, styles.flex1]}>
                          <Text style={styles.body1}>{statementIdx + 1}</Text>
                        </View>
                        <View style={[styles.flex6, styles.pl20, styles.py10]}>
                          <Text style={styles.body1}>{statement}</Text>
                        </View>
                      </View>
                    ))
                  }
                </ScrollView>
              </View>
            </View>
            <View style={[styles.flex1, styles.justifyStart]}>

              {ecs == 0 &&
                <View style={[styles.rowCenter, styles.well, styles.mb10]}>
                  <TouchableOpacity disabled={reset} style={[styles.flex1, { opacity: reset ? 0.5 : 1 }]} onPress={() => {
                    handleSend('set_program_mode', { "data": "continuous" });
                    setData('continuous');
                  }}>
                    <LinearGradient colors={data == 'continuous' ? [COLORS.green1, COLORS.green2] : ['#0000', '#0000']} style={styles.btn0}>
                      <Text style={styles.btnTxtRed}>CONTINUOUS</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={reset}
                    style={[styles.flex1, { opacity: reset ? 0.5 : 1 }]} onPress={() => {
                      handleSend('set_program_mode', { "data": "single" });
                      setData('single');
                    }}>
                    <LinearGradient colors={data == 'single' ? [COLORS.green1, COLORS.green2] : ['#0000', '#0000']} style={styles.btn0}>
                      <Text style={styles.btnTxtRed}>SINGLE BLOCK</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              }

              {code !== null &&
                <TouchableOpacity
                  disabled={reset || emergency}
                  style={{ opacity: reset || emergency ? 0.5 : 1 }}
                  onPress={() => {
                    if (running) {
                      handleSend('stop_execution', { "status": "stop" });
                      dispatch(setRunning(false));
                    }
                    else {
                      handleSend('execute', { "file_name": filename, mode: data == "continuous" ? "1" : "0", ecs: ecs, lineno: -1 });
                      dispatch(setRunning(true));
                    }
                  }}
                >
                  <LinearGradient colors={running ? [COLORS.red1, COLORS.red2] : [COLORS.green1, COLORS.green2]} style={styles.btn}>
                    <Ionicons name={running ? 'stop' : 'play-forward'} size={20} color="#fffa" style={styles.mr10} />
                    <Text style={styles.btnTxtRed}>{running ? 'STOP EXECUTION' : 'EXECUTE'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              }

              {code !== null && data == 'single' && ecs == 0 &&
                <TouchableOpacity
                  disabled={!running || nextDisabled}
                  onPress={() => {
                    setNextDisabled(true);
                    if (line != null) {
                      handleSend('exec_next_line', { "line": line });
                    }
                  }}
                >
                  <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={[styles.btn, (!running || nextDisabled) && { opacity: 0.5 }]}>
                    <Ionicons name="play" size={20} color="#fffa" style={styles.mr10} />
                    <Text style={styles.btnTxtRed}>NEXT BLOCK</Text>
                  </LinearGradient>
                </TouchableOpacity>}

              <TouchableOpacity
                disabled={running}
                style={[styles.mb10, { opacity: running ? 0.5 : 1 }]} onPress={() => { navigation.navigate('ProgramScreens', { screen: 'Program' }); }}>
                <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                  <Text style={styles.btnTxtRed}>SELECT PROGRAM</Text>
                </LinearGradient>
              </TouchableOpacity>
              {/* === Header above input === */}
              <View style={{ marginBottom: 5 }}>
                <Text style={styles.inputHeader}>EXECUTE FROM LINE NUMBER:</Text>
              </View>

              {/* === Input field to open Numpad === */}
              <TouchableOpacity onPress={() => {
                setIsNumpadVisible(true);
                setCursor(inputValue.length);
              }}>
                <View style={styles.inputContainer}>
                  <Text style={inputValue ? styles.inputText : styles.placeholderText}>
                    {inputValue || 'Enter Line No.'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mb10}
                onPress={handleNumpadEnter}
              >
                <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                  <Text style={styles.btnTxtRed}>ENTER</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* === Numpad Modal === */}
      <Numpad
        visible={isNumpadVisible}
        onClose={() => setIsNumpadVisible(false)}
        onKeyPress={keyPress}
        onEnter={handleNumpadEnter}
        // PATCH: SHOW EXISTING LINE NUMBER WHEN NUMPAD OPENS
        initialValue={inputValue}
      />

      {modal &&
        <View style={styles.overlayWrap}>
          <View style={styles.overlayInner}>
            <View style={[styles.rowCenter, styles.mb25]}>
              <Ionicons name="ios-alert-circle" size={20} color="#fffa" style={styles.mr10} />
              <Text style={[styles.title1, { textAlign: 'center' }]}>System is in jog mode. Please stop the jog to visit Auto screen.</Text>
            </View>
            <View style={styles.rowCenter}>
              <TouchableOpacity style={styles.mr15} onPress={() => { navigation.goBack(); }}>
                <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                  <Text style={styles.btnTxtRed}>BACK</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate('ManualScreens', { screen: 'Manual' }); }}>
                <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                  <Text style={styles.btnTxtRed}>MANUAL</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </>
  );
};

export default Auto;
