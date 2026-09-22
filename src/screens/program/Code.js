import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, TextInput } from 'react-native';
const {width, height} = Dimensions.get('window');
import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import Keypad from '../../components/Keypad';
import FullKeypad from '../../components/FullKeypad';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

const Code = ({navigation}) => {

  const [loading, setLoading] = useState(false);
  const [nameEntry, setNameEntry] = useState(false);

  const [code, setCode] = useState(['']);
  const [line, setLine] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [cursorFname, setCursorFname] = useState(0);

  const [filename, setFilename] = useState('');

  const itemsRef = useRef([]);
  const fnameRef = useRef(null);

  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, code.length);
    itemsRef.current[line].focus();
 }, [code.length]);

 useEffect(() => {
  itemsRef.current[0].focus();
}, []);

const validate = () => {
  console.log(code);
  let cleaned = [];
  let flag = false;
  let errorsArr = [];
  code.map((cd, cdIdx)=>{
    if(cd.trim() != '') {
      cleaned.push(cd);
      if(cd.trim()[cd.trim().length-1] !== ';') {
        errorsArr.push('Syntax Error on Line '+(cdIdx+1));
      }
    }
  });
  console.log(cleaned);
  if(cleaned.length < 1) {
        errorsArr.push('Please enter some code!');
  }
  if(errorsArr.length > 0) {
    setErrors(errorsArr);
    setError(true);
    return;
  }

  setNameEntry(true);

};

const handleSubmit = () => {

  if(filename.trim() == '') {
    return;
  }

  let cleaned = [];
  code.map((cd, cdIdx)=>{
    if(cd.trim() != '') {
      cleaned.push(cd);
    }
  });

  api.postJSON('createFile', {file_name: filename, contents: cleaned.join('\n')}).then(async(resJSON) => {

    console.log('resJSON', resJSON);
    if(JSON.parse(resJSON).status == 'success') {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Home' },
            {
              name: 'ProgramScreens',
              screen: "Program",
            },
          ],
        })
      );
    }
    else if(JSON.parse(resJSON).status == 'error') {
      let errorsArr = [];
      errorsArr.push(JSON.parse(resJSON).desc);
      setErrors(errorsArr);
      setError(true);
      setNameEntry(false);    }
    else {
      console.log('Unknown err');
      let errorsArr = [];
      errorsArr.push('Program could not be saved');
      setErrors(errorsArr);
      setError(true);
      setNameEntry(false);    }
      setLoading(false);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  };
 

  return (
    <>
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={[styles.containerStart]}>
        <View style={[styles.rowBetween, styles.itemsStretch, styles.pt20, styles.px20, styles.flex1 ]}>
          <View style={[styles.flex3, styles.pr20 ]}>
            <View style={styles.cols}>
              <View style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20, styles.itemsCenter,]}>
                <Ionicons name="ios-code-slash" size={19} color="#fff6" style={styles.mr10} />
                <Text style={styles.title1}>PROGRAM</Text>
              </View>
              <ScrollView pointerEvents="none" style={styles.editorWrap}>
                {code.map((statement, statementIndex)=>(
                  <View style={[styles.row0Start]} key={statementIndex}>
                    <View style={[styles.px10, styles.bR1]}>
                      <Text style={styles.codeLine1}>{statementIndex+1}</Text>
                    </View>
                    <View style={styles.flex1}>
                      <TextInput
                        ref={el => itemsRef.current[statementIndex] = el} 
                        style={[styles.code1, styles.px10, styles.py10 ]}
                        multiline={true}
                        selection={line == statementIndex ? {start: cursor, end: cursor} : undefined}
                        value={code[statementIndex]}
                        onChangeText={(e)=>{
                          console.log(e);
                        }}
                        showSoftInputOnFocus={false}
                        onTouchEnd={()=>{
                          setCursor(0);
                          setLine(statementIndex);
                          setCursor(code[statementIndex].length);
                        }}
                        />
                    </View>
                  </View>
                ))}
              </ScrollView>
              <Keypad  
                code={code} line={line} cursor={cursor} 
                setCode={setCode} setLine={setLine} setCursor={setCursor} 
                itemsRef={itemsRef} multi={true}
                />
            </View>
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>
            <TouchableOpacity style={styles.mb10} onPress={()=>{ validate() }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ navigation.goBack(); }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>CANCEL</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>

    {nameEntry &&
    <View style={styles.overlayWrap}>
      <View style={styles.overlayInner}>
        <View style={styles.mb15}>
          <Text style={styles.title1}>Save as</Text>
        </View>
        <View style={[styles.row0Between]}>
        <TextInput
          ref={el => fnameRef.current = el} 
          style={[styles.flex1, styles.mr40, styles.code1, styles.px10, styles.input2 ]}
          multiline={false}
          selection={{start: cursorFname, end: cursorFname}}
          value={filename}
          showSoftInputOnFocus={false}
          placeholder="Filename"
          autoFocus
          onTouchEnd={()=>{
            setCursorFname(filename.length);
          }}
          />
          <View style={[styles.row0End]}>
            <TouchableOpacity style={styles.mr20} onPress={()=>{ setNameEntry(false); setFilename(''); setCursorFname(0); itemsRef.current[line].focus();  }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>CANCEL</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={filename.trim() == '' ? {opacity: '0.5'} : {opacity: '1'}} disabled={filename.trim() == ''} onPress={()=>{ handleSubmit(); }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <FullKeypad  
          code={filename} cursor={cursorFname} 
          setCode={setFilename} setCursor={setCursorFname} 
          itemsRef={fnameRef}
          />
      </View>
    </View>
    }
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
          <TouchableOpacity style={{}} onPress={()=>{ 
            setError(false); 
            itemsRef.current[line].focus(); 
            }}>
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

export default Code;




