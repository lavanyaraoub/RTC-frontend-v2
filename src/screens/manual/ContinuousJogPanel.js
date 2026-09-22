import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';


const ContinuousJogPanel = ({
  enabled = false,
  activeDirection = null,
  speedPercent = 0,
  disabled = false,
  onToggle,
  onStop
}) => {
  const active =
    activeDirection === 0 ||
    activeDirection === 1;

  let stateText = 'NORMAL HOLD-TO-RUN JOG';

  if (enabled && !active) {
    stateText =
      'CONTINUOUS JOG ENABLED\nTap LEFT or RIGHT once to start.';
  }

  if (enabled && activeDirection === 1) {
    stateText =
      `CONTINUOUS LEFT RUNNING - ${speedPercent}%\nTap LEFT again to stop or RIGHT to switch.`;
  }

  if (enabled && activeDirection === 0) {
    stateText =
      `CONTINUOUS RIGHT RUNNING - ${speedPercent}%\nTap RIGHT again to stop or LEFT to switch.`;
  }

  return (
    <View style={localStyles.panel}>

      <Text style={localStyles.heading}>
        CONTINUOUS JOG
      </Text>

      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.8}
        onPress={onToggle}
        style={[
          localStyles.fullWidth,
          disabled && localStyles.disabled
        ]}
      >
        <LinearGradient
          colors={
            enabled
              ? ['#D84A3A', '#A92822']
              : ['#46A85B', '#23753A']
          }
          style={localStyles.enableButton}
        >
          <Text style={localStyles.enableText}>
            {
              enabled
                ? 'CONTINUOUS JOG ENABLED'
                : 'ENABLE CONTINUOUS JOG'
            }
          </Text>
        </LinearGradient>
      </TouchableOpacity>


      {/* <TouchableOpacity
        disabled={
          disabled ||
          !active
        }
        activeOpacity={0.8}
        onPress={onStop}
        style={[
          localStyles.fullWidth,
          (
            disabled ||
            !active
          )
            ? localStyles.disabled
            : null
        ]}
      >
        <LinearGradient
          colors={[
            '#60666A',
            '#343A3E'
          ]}
          style={localStyles.stopButton}
        >
          <Text style={localStyles.stopText}>
            STOP JOG
          </Text>
        </LinearGradient>
      </TouchableOpacity> */}


      <View
        style={[
          localStyles.messageBox,
          enabled
            ? localStyles.messageBoxEnabled
            : null
        ]}
      >
        <Text
          style={[
            localStyles.messageText,
            enabled
              ? localStyles.messageTextEnabled
              : null
          ]}
        >
          {stateText}
        </Text>
      </View>

    </View>
  );
};


const localStyles =
  StyleSheet.create({

    panel: {
      width: '100%',
      padding: 8,
      borderWidth: 1,
      borderColor: '#41494E',
      borderRadius: 8,
      backgroundColor: '#171B1E',
      marginBottom: 8
    },

    heading: {
      color: '#F2F2F2',
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 6,
      letterSpacing: 0.5
    },

    fullWidth: {
      width: '100%'
    },

    enableButton: {
      minHeight: 44,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6
    },

    enableText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center'
    },

    stopButton: {
      minHeight: 42,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 7,
      borderWidth: 1,
      borderColor: '#777D80'
    },

    stopText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700'
    },

    messageBox: {
      minHeight: 58,
      marginTop: 7,
      paddingHorizontal: 6,
      paddingVertical: 6,
      borderRadius: 5,
      backgroundColor: '#101416',
      borderWidth: 1,
      borderColor: '#343B3F',
      alignItems: 'center',
      justifyContent: 'center'
    },

    messageBoxEnabled: {
      borderColor: '#A73B32'
    },

    messageText: {
      color: '#949A9E',
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
      textAlign: 'center'
    },

    messageTextEnabled: {
      color: '#F0D8D5'
    },

    disabled: {
      opacity: 0.35
    }

  });


export default React.memo(ContinuousJogPanel);