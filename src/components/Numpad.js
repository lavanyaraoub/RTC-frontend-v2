import React, { useState, useEffect } from 'react';

import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import COLORS from '../colors';

const NumpadButton = ({ value, onPress, children, style }) => (
  <TouchableOpacity onPress={() => onPress(value)} style={[styles.button, style]}>
    {children}
  </TouchableOpacity>
);

const Numpad = ({
  visible,
  onClose,
  onKeyPress,
  onEnter,

  // =====================================================
  // PATCH: CURRENT VALUE FROM AUTO SCREEN
  // =====================================================
  initialValue = ""
}) => {

  const [input, setInput] = useState("");

  const [cursorPos, setCursorPos] = useState(0);

  // =====================================================
  // PATCH: LOAD EXISTING VALUE WHEN NUMPAD OPENS
  // =====================================================
  //
  // Example:
  // Auto field = 5
  // Open numpad -> display shows 5|
  //
  // Existing keypad logic below is unchanged.
  //
  useEffect(() => {
    if (visible) {
      const currentValue =
        initialValue !== undefined &&
        initialValue !== null
          ? String(initialValue)
          : "";

      setInput(currentValue);
      setCursorPos(currentValue.length);
    }
  }, [visible, initialValue]);

  const handleKeyPress = (value) => {

    if (value === "BKSP") {

      if (cursorPos > 0) {

        setInput((prev) => prev.slice(0, cursorPos - 1) + prev.slice(cursorPos));

        setCursorPos((pos) => pos - 1);

      }

    } else if (value === "LEFT") {

      setCursorPos((pos) => Math.max(0, pos - 1));

    } else if (value === "RIGHT") {

      setCursorPos((pos) => Math.min(input.length, pos + 1));

    } else {

      // insert numbers

      setInput((prev) => prev.slice(0, cursorPos) + value + prev.slice(cursorPos));

      setCursorPos((pos) => pos + 1);

    }

    // still forward the pressed key back to parent

    onKeyPress(value);

  };

  const handleEnter = () => {

    onEnter(input);

    setInput("");

    setCursorPos(0);

  };

  // render input with a visible cursor "|"

  const renderInputWithCursor = () => {

    return input.slice(0, cursorPos) + "|" + input.slice(cursorPos);

  };

  return (

    <Modal

      transparent={true}

      visible={visible}

      animationType="fade"

      onRequestClose={onClose}

    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          {/* === DISPLAY AREA === */}

          <View style={styles.display}>

            <Text style={styles.displayText}>{renderInputWithCursor()}</Text>

          </View>

          {/* === NUMBER ROWS === */}

          <View style={styles.row}>

            <NumpadButton value="1" onPress={handleKeyPress}><Text style={styles.buttonText}>1</Text></NumpadButton>

            <NumpadButton value="2" onPress={handleKeyPress}><Text style={styles.buttonText}>2</Text></NumpadButton>

            <NumpadButton value="3" onPress={handleKeyPress}><Text style={styles.buttonText}>3</Text></NumpadButton>

          </View>

          <View style={styles.row}>

            <NumpadButton value="4" onPress={handleKeyPress}><Text style={styles.buttonText}>4</Text></NumpadButton>

            <NumpadButton value="5" onPress={handleKeyPress}><Text style={styles.buttonText}>5</Text></NumpadButton>

            <NumpadButton value="6" onPress={handleKeyPress}><Text style={styles.buttonText}>6</Text></NumpadButton>

          </View>

          <View style={styles.row}>

            <NumpadButton value="7" onPress={handleKeyPress}><Text style={styles.buttonText}>7</Text></NumpadButton>

            <NumpadButton value="8" onPress={handleKeyPress}><Text style={styles.buttonText}>8</Text></NumpadButton>

            <NumpadButton value="9" onPress={handleKeyPress}><Text style={styles.buttonText}>9</Text></NumpadButton>

          </View>

          {/* === NEW ROW FOR ARROWS AND 0 (centered) === */}

          <View style={styles.rowCentered}>

            <NumpadButton value="LEFT" onPress={handleKeyPress} style={[styles.controlButton, styles.smallButton]}>

              <Ionicons name="arrow-back" size={30} color="white" />

            </NumpadButton>

            <NumpadButton value="0" onPress={handleKeyPress} style={styles.smallButton}>

              <Text style={styles.buttonText}>0</Text>

            </NumpadButton>

            <NumpadButton value="RIGHT" onPress={handleKeyPress} style={[styles.controlButton, styles.smallButton]}>

              <Ionicons name="arrow-forward" size={30} color="white" />

            </NumpadButton>

          </View>

          {/* === ROW FOR BACKSPACE AND ENTER === */}

          <View style={styles.row}>

            <NumpadButton value="BKSP" onPress={handleKeyPress} style={styles.controlButton}>

              <Ionicons name="backspace-outline" size={30} color="white" />

            </NumpadButton>

            <TouchableOpacity onPress={handleEnter} style={styles.flex2}>

              <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.enterButton}>

                <Ionicons name="checkmark-done-sharp" size={28} color="white" style={{ marginRight: 10 }} />

                <Text style={styles.buttonText}>ENTER</Text>

              </LinearGradient>

            </TouchableOpacity>

          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>

            <Text style={{ color: '#aaa', fontSize: 16 }}>Close</Text>

          </TouchableOpacity>

        </View>

      </View>

    </Modal>

  );

};

const styles = StyleSheet.create({

  overlay: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.7)',

  },

  container: {

    backgroundColor: '#1E1E1E',

    borderRadius: 15,

    padding: 20,

    width: 380,

    elevation: 10,

    shadowColor: '#000',

    shadowOpacity: 0.5,

    shadowRadius: 10,

  },

  display: {

    backgroundColor: '#000',

    padding: 15,

    borderRadius: 10,

    marginBottom: 20,

    minHeight: 50,

    justifyContent: 'center',

  },

  displayText: {

    color: 'white',

    fontSize: 24,

  },

  row: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 15,

  },

  rowCentered: {

    flexDirection: 'row',

    justifyContent: 'center',

    marginBottom: 15,

  },

  button: {

    flex: 1,

    height: 70,

    marginHorizontal: 5,

    backgroundColor: '#333',

    borderRadius: 10,

    justifyContent: 'center',

    alignItems: 'center',

  },

  smallButton: {

    width: 80,

    height: 70,

    marginHorizontal: 8,

    borderRadius: 10,

    justifyContent: 'center',

    alignItems: 'center',

  },

  controlButton: {

    backgroundColor: '#555',

  },

  buttonText: {

    color: 'white',

    fontSize: 24,

    fontWeight: 'bold',

  },

  enterButton: {

    flex: 1,

    flexDirection: 'row',

    height: 70,

    marginHorizontal: 8,

    borderRadius: 10,

    justifyContent: 'center',

    alignItems: 'center',

  },

  closeButton: {

    marginTop: 10,

    alignItems: 'center',

  },

  flex2: { flex: 2 },

});

export default Numpad;
