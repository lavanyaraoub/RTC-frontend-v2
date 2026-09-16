import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles';
import COLORS from '../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Keypad = ({ navigation, code, line, cursor, setCode, setLine, setCursor, itemsRef, multi }) => {
    return (
        <View style={styles.keypadWrap}>
            <View style={[styles.rowCenter]}>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '1' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>1</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '2' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>2</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '3' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>3</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '4' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>4</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '5' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>5</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '6' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>6</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '7' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>7</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '8' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>8</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '9' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>9</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '0' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>0</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={multi == false}
                    onPress={() => {
                        if (line > 0) {
                            let current = line;
                            if (code[current - 1].length >= cursor) {
                                setLine(current - 1);
                                itemsRef.current[current - 1].focus();
                            }
                            else {
                                setCursor(code[line - 1].length);
                                setLine(current - 1);
                                itemsRef.current[current - 1].focus();
                            }
                        }
                        else {
                            itemsRef.current[line].focus();
                        }
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                        <Ionicons name="arrow-up" size={19.5} color="#fffa" style={styles.textCenter} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <View style={[styles.rowCenter]}>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'A' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>A</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'B' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>B</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'D' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>D</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'F' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>F</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'G' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>G</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'M' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>M</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={multi == false}
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'P' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                        <Text style={[styles.textCenter, styles.body2]}>P</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={multi == false}
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + 'R' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                        <Text style={[styles.textCenter, styles.body2]}>R</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (cursor > 0) {
                            setCursor(cursor - 1);
                        }
                        else {
                            let current = line;
                            if (current > 0) {
                                setCursor(0);
                                setLine(current - 1);
                                setCursor(code[current - 1].length);
                                itemsRef.current[current - 1].focus();
                            }
                            else {
                                itemsRef.current[line].focus();
                            }
                        }
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                        <Ionicons name="arrow-back" size={19} color="#fffa" style={styles.textCenter} />
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (cursor < code[line].length) {
                            setCursor(cursor + 1);
                        }
                        else {
                            let current = line;
                            if (current < (code.length - 1)) {
                                setCursor(0);
                                setLine(current + 1);
                                itemsRef.current[current + 1].focus();
                            }
                            else {
                                itemsRef.current[line].focus();
                            }
                        }
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                        <Ionicons name="arrow-forward" size={19.5} color="#fffa" style={styles.textCenter} />
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={multi == false}
                    onPress={() => {
                        if (line < (code.length - 1)) {
                            let current = line;
                            if (code[current + 1].length >= cursor) {
                                setLine(current + 1);
                                itemsRef.current[current + 1].focus();
                            }
                            else {
                                setCursor(code[line + 1].length);
                                setLine(current + 1);
                                itemsRef.current[current + 1].focus();
                            }
                        }
                        else {
                            itemsRef.current[line].focus();
                        }
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]} >
                        <Ionicons name="arrow-down" size={19.5} color="#fffa" style={styles.textCenter} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={[styles.rowCenter]}>
                <TouchableOpacity
                    onPress={() => {
                        if (code[line].length > 0) {
                            if (cursor > 0) {
                                let temp = JSON.parse(JSON.stringify(code));
                                temp[line] = temp[line].slice(0, cursor - 1) + temp[line].slice(cursor);
                                setCode(temp);
                                setCursor(cursor - 1);
                            }
                            itemsRef.current[line].focus();
                        }
                        else {
                            if (line > 0) {
                                setCursor(0);
                                let temp = JSON.parse(JSON.stringify(code));
                                let current = line;
                                setLine(current - 1);
                                temp.splice(current, 1);
                                setCode(temp);
                                setCursor(temp[current - 1].length);
                                itemsRef.current[current - 1].focus();
                            }
                            else {
                                itemsRef.current[line].focus();
                            }
                        }
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>Backspace</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // Check if line is not empty
                        if (code[line].length > cursor) {
                            let temp = JSON.parse(JSON.stringify(code));
                            temp[line] = temp[line].slice(0, cursor) + temp[line].slice(cursor + 1);
                            setCode(temp);
                        }
                        else if (code[line].length < 1) {
                            if (code.length > (line + 1)) {
                                setCursor(0);
                                let temp = JSON.parse(JSON.stringify(code));
                                let current = line;
                                temp.splice(current, 1);
                                setCode(temp);
                            }
                        }
                        itemsRef.current[line].focus();
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>Delete</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '-' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>-</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + '.' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>.</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + ';' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>;</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        temp[line] = temp[line].substring(0, cursor) + ' ' + temp[line].substring(cursor);
                        setCode(temp);
                        setCursor(cursor + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>Space</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={multi == false}
                    onPress={() => {
                        let temp = JSON.parse(JSON.stringify(code));
                        let current = line;
                        if (cursor == 0) {
                            temp.splice(current, 0, '');
                        }
                        else {
                            temp.splice(current + 1, 0, '');
                            setCursor(0);
                        }
                        setCode(temp);
                        setLine(current + 1);
                    }}
                    style={[styles.flex1, styles.btnKey]}
                >
                    <LinearGradient style={styles.gradKey} colors={[COLORS.key1, COLORS.key2]}>
                        <Text style={[styles.textCenter, styles.body2]}>Enter</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Keypad;




