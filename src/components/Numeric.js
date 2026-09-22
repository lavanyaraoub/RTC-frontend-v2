import React from 'react';
import {View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles';
import COLORS from '../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Numeric = ({keyPress}) => {
  return (
    <View style={styles.keypadWrap}> 
        <View style={[styles.rowCenter]}>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('1');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>1</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('2');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>2</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('3');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>3</Text>
            </LinearGradient>
            </TouchableOpacity>
        </View> 

        <View style={[styles.rowCenter]}>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('4');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>4</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('5');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>5</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('6');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>6</Text>
            </LinearGradient>
            </TouchableOpacity>
        </View> 

        <View style={[styles.rowCenter]}>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('7');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>7</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('8');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>8</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('9');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>9</Text>
            </LinearGradient>
            </TouchableOpacity>
        </View> 
        <View style={[styles.rowCenter]}>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('BKSP');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                <Ionicons name="backspace-outline" size={19} color="#fffa" style={styles.textCenter} />
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('0');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>0</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{  
                keyPress('-');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>-</Text>
            </LinearGradient>
            </TouchableOpacity>
        </View> 
    <View style={[styles.rowCenter]}>
        <TouchableOpacity 
        onPress={()=>{  
            keyPress('LEFT');
            }}
        style={[styles.flex1, styles.btnKey]}
        >
        <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
            <Ionicons name="arrow-back" size={19} color="#fffa" style={styles.textCenter} />
        </LinearGradient>
        </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ 
                keyPress('.');
                }}
            style={[styles.flex1, styles.btnKey]}
            >
            <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                <Text style={[styles.textCenter, styles.body2]}>.</Text>
            </LinearGradient>
            </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=>{ 
            keyPress('RIGHT');
            }}
        style={[styles.flex1, styles.btnKey]}
        >
        <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
            <Ionicons name="arrow-forward" size={19} color="#fffa" style={styles.textCenter} />
        </LinearGradient>
        </TouchableOpacity>
    </View>
    </View>
  );
};

export default Numeric;




