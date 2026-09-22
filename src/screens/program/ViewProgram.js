import React, {useState, useRef, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useDispatch } from "react-redux";
import {setAuto} from '../../redux/ducks/auto';
const {width, height} = Dimensions.get('window');
import { CommonActions } from '@react-navigation/native';

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import Keypad from '../../components/Keypad';
import FullKeypad from '../../components/FullKeypad';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ViewProgram = ({route, navigation}) => {
  
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [program, setProgram] = React.useState([]);
  const [filename, setFilename] = useState(route.params.filename);
  const [newFilename, setNewFilename] = useState(route.params.filename);
  const [nameEntry, setNameEntry] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [message, setMessage] = useState(null);

  const [code, setCode] = useState(['']);
  const [line, setLine] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [cursorFname, setCursorFname] = useState(0);

  const itemsRef = useRef([]);
  const fnameRef = useRef(null);
  
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  
  const fetchData = async() => {
    setLoading(true);
      api.getJSON('getContents?file_name='+route.params.filename).then(async(resJSON) => {
      setProgram(resJSON.contents.split('<br>'));
      setLoading(false);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }

  const handleDelete = () => {
    api.postJSON('deleteFile?file_name='+route.params.filename, {}).then(async(resJSON) => {
      console.log('RS', resJSON);
      setLoading(false);
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
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }

  const handleRename = () => {
    api.postJSON('renameFile?file_name='+route.params.filename+'&new_file_name='+newFilename, {}).then(async(resJSON) => {
      console.log(resJSON);
      setLoading(false);
      route.params.init();
      setFilename(newFilename);
      setNameEntry(false);
      setMessage(["success", "File renamed successfully"]);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }

  useEffect(()=>{
    fetchData();
  }, []); 

  const handleSelect = () => {
    dispatch(setAuto(filename, program));
    navigation.navigate('AutoScreens', {screen: 'Auto'});
  };

  const editInit = async() => {
    await setCode(program);
    await setLine(0);
    await setCursor(0);
    await setEditing(true);
    await setMessage(null);
    itemsRef.current[line].focus();
  }


const handleSubmit = () => {

  let cleaned = [];
  let errorsArr = [];
  code.map((cd, cdIdx)=>{
    if(cd.trim() != '') {
      cleaned.push(cd);
      if(cd.trim()[cd.trim().length-1] !== ';') {
        errorsArr.push('Syntax Error on Line '+(cdIdx+1));
      }
    }
  });
  if(cleaned.length < 1) {
        errorsArr.push('Please enter some code!');
  }
  if(errorsArr.length > 0) {
    console.log('errs');
    setErrors(errorsArr);
    setError(true);
    return;
  }

  api.postJSON('createFile', {file_name: filename, contents: cleaned.join('\n')}).then(async(resJSON) => {
    setLoading(false);
    if(JSON.parse(resJSON).status == 'success') {
      setProgram(code);
      setEditing(false);
      setMessage(["success", 'Program saved successfully']);
      fetchData();
    }
    else if(JSON.parse(resJSON).status == 'error') {
      setMessage(["error", JSON.parse(resJSON).desc]);
    }
    else {
      setMessage(["error", 'Program could not be saved']);
    }
  })
  .catch((e) => {
    console.log(e);
    setLoading(false);
  });
};


  useEffect(() => {
   if(itemsRef.current[line]) {
      itemsRef.current = itemsRef.current.slice(0, code.length);
      itemsRef.current[line].focus();
    }
 }, [code.length]);
  
  return (
    <>
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={styles.containerStart}>
        <View style={[styles.rowBetween, styles.itemsStart, styles.pt20, styles.px20, styles.flex1 ]}>
            <View style={[styles.flex3, styles.pr20, {height:'100%'}]}>
              <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20, styles.mb10]}>
                <Ionicons name="ios-folder-open-sharp" size={15} color="#fffa" style={styles.mr10} />
                <Text style={styles.title1}>{editing == true ? 'EDIT PROGRAM' : filename}</Text>
              </LinearGradient>
              <ScrollView style={[styles.widgetBody, styles.flex1]}>
                { loading == true ? 
                <View style={styles.loadingWrap}>
                  <ActivityIndicator size="small" />
                </View>
                :
                program.length < 1 ? 
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyTxt}>Could not load program</Text>
                </View>
                :
                editing == false ?
                program.map((line, lineIdx)=> (
                  line!== '' &&
                  <View key={lineIdx} style={[styles.row0Start, styles.oddRow]}>
                    <View style={[styles.px10, styles.bR1]}>
                      <Text style={styles.codeLine1}>{lineIdx+1}</Text>
                    </View>
                    <View style={[styles.flex1, styles.pl20, styles.py10 ]}>
                      <Text style={styles.code1}>{line}</Text>
                    </View>
                  </View>
                ))
                :
                <View>
                  {code.map((statement, statementIndex)=>(
                  <View style={[styles.row0Start]} key={statementIndex}>
                    <View style={[styles.px10, styles.bR1]}>
                      <Text style={styles.codeLine1}>{statementIndex+1}</Text>
                    </View>
                    <View style={[styles.flex1, styles.pl10]}>
                      <TextInput
                        ref={el => itemsRef.current[statementIndex] = el} 
                        style={[styles.code1, styles.px10, styles.py10, {outlineWidth: 0} ]}
                        multiline={true}
                        selection={line == statementIndex ? {start: cursor, end: cursor} : undefined}
                        value={code[statementIndex]}
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
                </View>
              }
              </ScrollView>
              {editing == true &&
              <Keypad  
                code={code} line={line} cursor={cursor} 
                setCode={setCode} setLine={setLine} setCursor={setCursor} 
                itemsRef={itemsRef} multi={true}
                />}
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ handleSelect(); }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>SELECT PROGRAM</Text>
              </LinearGradient>
            </TouchableOpacity>
            {editing == false &&
            <TouchableOpacity style={styles.w100p} onPress={()=>{ editInit(); }}>
              <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>EDIT</Text>
              </LinearGradient>
            </TouchableOpacity>}
            {editing == true &&
            <>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ handleSubmit(); }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.w100p, styles.mb20]} onPress={()=>{ 
              setNewFilename(filename);
              setEditing(false);
              setLine(0); setCursor(0);
               }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>CANCEL</Text>
              </LinearGradient>
            </TouchableOpacity>
            </>}

            {editing == false &&
            <TouchableOpacity style={styles.w100p} onPress={()=>{ setNameEntry(true); setCursorFname(filename.length); }}>
              <LinearGradient colors={[COLORS.blue1, COLORS.blue2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>RENAME</Text>
              </LinearGradient>
            </TouchableOpacity>}
            <TouchableOpacity style={styles.w100p} onPress={()=>{ setDeleteConfirm(true); }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>DELETE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.w100p} onPress={()=>{ navigation.goBack(); }}>
              <LinearGradient colors={[COLORS.gray1, COLORS.gray2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>BACK</Text>
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
          <Text style={styles.title1}>Rename Program</Text>
        </View>
        <View style={[styles.row0Between]}>
        <TextInput
          ref={el => fnameRef.current = el} 
          style={[styles.flex1, styles.mr40, styles.code1, styles.px10, styles.input2 ]}
          multiline={false}
          selection={{start: cursorFname, end: cursorFname}}
          value={newFilename}
          showSoftInputOnFocus={false}
          placeholder="Filename"
          autoFocus
          onTouchEnd={()=>{
            setCursorFname(newFilename.length);
          }}
          />
          <View style={[styles.row0End]}>
            <TouchableOpacity style={styles.mr20} onPress={()=>{ setNameEntry(false); setNewFilename(filename); setCursorFname(filename.length);  }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>CANCEL</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={newFilename.trim() == '' ? {opacity: '0.5'} : {opacity: '1'}} disabled={newFilename.trim() == ''} onPress={()=>{ handleRename(); }}>
              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>RENAME</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <FullKeypad  
          code={newFilename} cursor={cursorFname} 
          setCode={setNewFilename} setCursor={setCursorFname} 
          itemsRef={fnameRef}
          />
      </View>
    </View>
    }
    {message != null &&
    <View style={styles.toastWrap}>
      <View style={styles.toastInner}>
        <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.toastInner}>
          <View style={[styles.row0Center, styles.mb20]}>
            <Ionicons name={message[0] == 'error' ? "alert-circle" : "checkmark-circle"} size={24} color={message[0] == 'error' ? "rgb(195, 119, 119)" : "#fffa"} style={styles.mr10} />
            <Text style={styles.body3}>{message[1]}</Text>
          </View>
          <TouchableOpacity style={{}} onPress={()=>{ 
            if(message[0] == 'error') {
              setMessage(null);
              itemsRef.current[line].focus();
            }
            else {
              setMessage(null);
            }
             }}>
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
    {deleteConfirm &&
    <View style={styles.toastWrap}>
      <View style={styles.toastInner}>
        <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.toastInner}>
          <View style={styles.mb20}>
            <View style={[styles.row0Start, styles.mb10]}>
              <Ionicons name="alert-circle-outline" size={24} color="rgb(195, 119, 119)" style={styles.mr10} />
              <Text style={styles.body3}>
                Are you sure you want to permenantly delete this program file ({route.params.filename})?
              </Text>
            </View>
          </View>

          <View style={[styles.row0End]}>
            <TouchableOpacity style={styles.mr20} onPress={()=>{ setDeleteConfirm(false); }}>
              <LinearGradient colors={[COLORS.gray1, COLORS.gray2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>CANCEL</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ handleDelete(); }}>
              <LinearGradient colors={[COLORS.red1, COLORS.red2]} style={styles.btn}>
                <Text style={styles.btnTxtRed}>DELETE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
        </LinearGradient>
      </View>
    </View>}
    </>
  );
};

export default ViewProgram;




