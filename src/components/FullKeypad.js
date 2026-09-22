import React from 'react';
import {View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles';
import COLORS from '../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const FullKeypad = ({navigation, code, cursor, setCode, setCursor, itemsRef}) => {
    const keyIn = (key) => {
        let temp = JSON.parse(JSON.stringify(code));
        temp = temp.substring(0, cursor) + key.toString() + temp.substring(cursor);
        setCode(temp); 
        setCursor(cursor+1);
        itemsRef.current.focus();
    }

  return (
    <View style={styles.keypadWrap}>
        {rows.map((row, rowIdx)=>(
            <View key={rowIdx} style={[styles.rowCenter]}>
                {rowIdx == 2 &&
                <View style={[styles.flex1]}></View>
                }
                {rowIdx == 3 &&
                <View style={[styles.flex2]}></View>
                }
                {row.map((key, keyIdx)=>(
                <TouchableOpacity 
                    key={keyIdx}
                    onPress={()=>{ 
                        keyIn(key);
                        }}
                    style={[styles.flex2, styles.btnKey]}
                    >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>{key}</Text>
                    </LinearGradient>
                </TouchableOpacity>
                ))}
                {rowIdx == 2 &&
                <View style={[styles.flex1]}></View>
                }
                {rowIdx == 3 &&
                <View style={[styles.flex2]}></View>
                }
            </View>
        ))}

    <View style={[styles.rowCenter]}>
        <View style={styles.flex2} />
        
    <TouchableOpacity 
        onPress={()=>{ 
            if(cursor > 0) {
            setCursor(cursor-1);
            }
            itemsRef.current.focus();
            }}
        style={[styles.flex1, styles.btnKey]}
        >
        <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
            <Ionicons name="arrow-back" size={19.5} color="#fffa" style={styles.textCenter} />
        </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=>{ 
            if(cursor < code.length) {
            setCursor(cursor+1);
            }
            itemsRef.current.focus();
            }}
        style={[styles.flex1, styles.btnKey]}
        >
        <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
            <Ionicons name="arrow-forward" size={19.5} color="#fffa" style={styles.textCenter} />
        </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={()=>{ 
                let temp = JSON.parse(JSON.stringify(code));
                temp = temp.substring(0, cursor) + ' ' + temp.substring(cursor);
                setCode(temp); 
                setCursor(cursor+1);
                itemsRef.current.focus();
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>Space</Text>
            </LinearGradient>
            </TouchableOpacity>
        <TouchableOpacity 
            onPress={()=>{ 
                if(code.length > 0) {
                if(cursor > 0) {
                    let temp = JSON.parse(JSON.stringify(code));
                    temp = temp.slice(0, cursor-1)+temp.slice(cursor);
                    setCode(temp); 
                    setCursor(cursor-1);
                }
                }
                itemsRef.current.focus();
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>Bksp</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                // Check if line is not empty
                if(code.length > cursor) {
                let temp = JSON.parse(JSON.stringify(code));
                temp = temp.slice(0, cursor)+temp.slice(cursor+1);
                setCode(temp); 
                }
                itemsRef.current.focus();
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>Delete</Text>
            </LinearGradient>
            </TouchableOpacity>
        <View style={styles.flex2} />
    </View>
    </View>
  );
};

export default FullKeypad;