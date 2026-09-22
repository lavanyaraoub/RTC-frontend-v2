import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Svg, {
  Line,
  Circle,
  Text as SvgText
} from 'react-native-svg';


const SIZE = 220;
const CENTER_X = 110;
const CENTER_Y = 110;
const ARC_RADIUS = 73;
const START_ANGLE = 140;
const END_ANGLE = 400;

const MIN = 0;
const MAX = 20;

/*
 * 0.0, 0.2, 0.4 ... 19.8, 20.0 = 101 valid values.
 */
const POINTS = 101;
const STEP = (MAX - MIN) / (POINTS - 1);

/*
 * Visual bars only. Kept at the existing 48 segments so the appearance
 * remains unchanged.
 */
const SEGMENTS = 48;

const getPercentage = value => (value / MAX) * 100;

const clamp = value => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return MIN;
  }

  const limited = Math.max(MIN, Math.min(MAX, numberValue));
  const pointIndex = Math.round((limited - MIN) / STEP);
  const normalized = MIN + pointIndex * STEP;

  return Number(normalized.toFixed(6));
};

const pointAtAngle = (angle, radius) => {
  const rad = (angle * Math.PI) / 180;

  return {
    x: CENTER_X + radius * Math.cos(rad),
    y: CENTER_Y + radius * Math.sin(rad)
  };
};


const JogSpeedometer = ({
  value = 1,
  onChange,
  disabled = false
}) => {
  /*
   * IMPORTANT PERFORMANCE CHANGE
   * ----------------------------
   * The parent Manual screen is NOT updated while the finger moves.
   *
   * While dragging:
   *   - only this small speedometer component redraws
   *   - no websocket jog-feed mirror is triggered
   *
   * On finger release:
   *   - onChange(finalValue) is called ONCE
   *   - if the value did not change, nothing is sent
   */
  const committedValue = clamp(value);

  const [previewValue, setPreviewValue] = useState(committedValue);
  const [dragging, setDragging] = useState(false);

  const latestPreviewRef = useRef(committedValue);
  const paintFrameRef = useRef(null);
  const lastPaintTimeRef = useRef(0);

  /*
   * Cap gauge repaint work to roughly 30 FPS while dragging.
   * This uses animation frames, not a repeating timer.
   */
  const paintPreview = () => {
    if (paintFrameRef.current !== null) {
      return;
    }

    const paint = timestamp => {
      const elapsed = timestamp - lastPaintTimeRef.current;

      if (elapsed < 30) {
        paintFrameRef.current = requestAnimationFrame(paint);
        return;
      }

      paintFrameRef.current = null;
      lastPaintTimeRef.current = timestamp;

      const next = latestPreviewRef.current;

      setPreviewValue(current => {
        if (current === next) {
          return current;
        }

        return next;
      });
    };

    paintFrameRef.current = requestAnimationFrame(paint);
  };

  const cancelPendingPaint = () => {
    if (paintFrameRef.current !== null) {
      cancelAnimationFrame(paintFrameRef.current);
      paintFrameRef.current = null;
    }
  };

  useEffect(() => {
    /*
     * Backend/parent may change Jog Feed (for example shared sync).
     * Follow that value only when the operator is not actively dragging.
     */
    if (!dragging) {
      latestPreviewRef.current = committedValue;

      setPreviewValue(current => {
        if (current === committedValue) {
          return current;
        }

        return committedValue;
      });
    }
  }, [committedValue, dragging]);

  useEffect(() => {
    return () => {
      cancelPendingPaint();
    };
  }, []);


  const segments = useMemo(() => {
    const result = [];

    for (let i = 0; i < SEGMENTS; i++) {
      const progress = i / (SEGMENTS - 1);
      const angle =
        START_ANGLE +
        progress * (END_ANGLE - START_ANGLE);

      const segmentValue =
        MIN +
        progress * (MAX - MIN);

      const outer = pointAtAngle(angle, ARC_RADIUS);
      const inner = pointAtAngle(angle, ARC_RADIUS - 15);

      result.push({
        key: i,
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y,
        value: segmentValue
      });
    }

    return result;
  }, []);


  const displayValue = dragging
    ? previewValue
    : committedValue;

  const valueProgress =
    (displayValue - MIN) /
    (MAX - MIN);

  const knobAngle =
    START_ANGLE +
    valueProgress *
      (END_ANGLE - START_ANGLE);

  const knob =
    pointAtAngle(
      knobAngle,
      ARC_RADIUS - 4
    );


  const setLocalPreview = newValue => {
    if (disabled) {
      return;
    }

    const next = clamp(newValue);

    /*
     * Touchscreens generate many duplicate move events inside the same
     * quantized 0.2 Jog Feed point. Ignore them completely.
     */
    if (next === latestPreviewRef.current) {
      return;
    }

    latestPreviewRef.current = next;
    paintPreview();
  };


  const valueFromTouch = event => {
    if (disabled) {
      return null;
    }

    const {
      locationX,
      locationY
    } = event.nativeEvent;

    const dx = locationX - CENTER_X;
    const dy = locationY - CENTER_Y;

    let angle =
      Math.atan2(dy, dx) *
      180 /
      Math.PI;

    if (angle < 0) {
      angle += 360;
    }

    const END_SNAP_DEGREES = 12;

    if (
      angle >= START_ANGLE - END_SNAP_DEGREES &&
      angle < START_ANGLE
    ) {
      angle = START_ANGLE;
    }

    if (angle < START_ANGLE) {
      angle += 360;
    }

    if (
      angle > END_ANGLE &&
      angle <= END_ANGLE + END_SNAP_DEGREES
    ) {
      angle = END_ANGLE;
    }

    if (
      angle < START_ANGLE ||
      angle > END_ANGLE
    ) {
      return null;
    }

    const progress =
      (angle - START_ANGLE) /
      (END_ANGLE - START_ANGLE);

    let rawValue =
      MIN +
      progress * (MAX - MIN);

    if (progress <= 0.015) {
      rawValue = MIN;
    }

    if (progress >= 0.985) {
      rawValue = MAX;
    }

    return clamp(rawValue);
  };


  const updateFromTouch = event => {
    const next = valueFromTouch(event);

    if (next === null) {
      return;
    }

    setLocalPreview(next);
  };


  const beginDrag = event => {
    if (disabled) {
      return;
    }

    latestPreviewRef.current = committedValue;
    setPreviewValue(committedValue);
    setDragging(true);

    updateFromTouch(event);
  };


  const commitDrag = () => {
    if (disabled) {
      return;
    }

    cancelPendingPaint();

    const finalValue = latestPreviewRef.current;

    setPreviewValue(current => {
      if (current === finalValue) {
        return current;
      }

      return finalValue;
    });

    setDragging(false);

    /*
     * CRITICAL:
     * Only notify Manual/backend if the operator actually selected a
     * different value. This produces ONE parent update / ONE socket mirror.
     */
    if (
      finalValue !== committedValue &&
      onChange
    ) {
      onChange(finalValue);
    }
  };


  const cancelDrag = () => {
    cancelPendingPaint();

    latestPreviewRef.current = committedValue;
    setPreviewValue(committedValue);
    setDragging(false);
  };


  const commitDiscreteValue = newValue => {
    if (disabled) {
      return;
    }

    const next = clamp(newValue);

    if (next === committedValue) {
      return;
    }

    latestPreviewRef.current = next;
    setPreviewValue(next);

    if (onChange) {
      onChange(next);
    }
  };


  const majorValues = [
    0,
    5,
    10,
    15,
    20
  ];


  return (
    <LinearGradient
      colors={[
        '#34393D',
        '#24292D',
        '#0D0F11'
      ]}
      locations={[
        0,
        0.52,
        1
      ]}
      style={[
        localStyles.container,
        disabled
          ? localStyles.disabled
          : null
      ]}
    >
      <Text style={localStyles.title}>
        JOG FEED
      </Text>

      <View
        style={{
          width: SIZE,
          height: 175,
          touchAction: 'none',
          userSelect: 'none'
        }}
        onStartShouldSetResponder={() => {
          return !disabled;
        }}
        onMoveShouldSetResponder={() => {
          return !disabled;
        }}
        onResponderGrant={beginDrag}
        onResponderMove={updateFromTouch}
        onResponderRelease={commitDrag}
        onResponderTerminate={cancelDrag}
      >
        <Svg
          width={SIZE}
          height={190}
        >
          {segments.map(segment => (
            <Line
              key={segment.key}
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
              stroke={
                segment.value <= displayValue
                  ? '#2891B9'
                  : '#666A6D'
              }
              strokeWidth={5}
              strokeLinecap="round"
            />
          ))}

          {majorValues.map(tickValue => {
            const progress =
              (tickValue - MIN) /
              (MAX - MIN);

            const angle =
              START_ANGLE +
              progress *
                (END_ANGLE - START_ANGLE);

            const tick =
              pointAtAngle(
                angle,
                ARC_RADIUS + 18
              );

            const displayTick =
              Math.round(
                (tickValue / MAX) * 100
              );

            return (
              <SvgText
                key={tickValue}
                x={tick.x}
                y={tick.y}
                fill="#E8E8E8"
                fontSize="15"
                fontWeight="700"
                textAnchor="middle"
              >
                {displayTick}
              </SvgText>
            );
          })}

          <Circle
            cx={knob.x}
            cy={knob.y}
            r={13}
            fill="#FFFFFF"
            stroke="#E53935"
            strokeWidth={5}
          />

          <SvgText
            x={CENTER_X}
            y={116}
            fill="#FFFFFF"
            fontSize="36"
            fontWeight="600"
            textAnchor="middle"
          >
            {getPercentage(displayValue).toFixed(0)}%
          </SvgText>

          <SvgText
            x={CENTER_X}
            y={132}
            fill="#37C1F5"
            fontSize="16"
            fontWeight="700"
            textAnchor="middle"
          >
            {' '}
          </SvgText>
        </Svg>
      </View>

      <View style={localStyles.scaleControlGap} />

      <View style={localStyles.controls}>
        <TouchableOpacity
          disabled={
            disabled ||
            displayValue <= MIN
          }
          onPress={() => {
            commitDiscreteValue(
              displayValue - STEP
            );
          }}
          style={[
            localStyles.button,
            (
              disabled ||
              displayValue <= MIN
            )
              ? localStyles.buttonDisabled
              : null
          ]}
        >
          <Text style={localStyles.buttonText}>
            −
          </Text>
        </TouchableOpacity>

        <View style={localStyles.valueBox}>
          <Text style={localStyles.valueText}>
            {getPercentage(displayValue).toFixed(0)}%
          </Text>
        </View>

        <TouchableOpacity
          disabled={
            disabled ||
            displayValue >= MAX
          }
          onPress={() => {
            commitDiscreteValue(
              displayValue + STEP
            );
          }}
          style={[
            localStyles.button,
            (
              disabled ||
              displayValue >= MAX
            )
              ? localStyles.buttonDisabled
              : null
          ]}
        >
          <Text style={localStyles.buttonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={localStyles.rangeText}>
        <Text style={localStyles.rangeAccent}>
          RANGE:
        </Text>

        {' 0 - 100% SPEED SCALE'}
      </Text>

      {disabled && (
        <Text style={localStyles.lockText}>
          SPEED LOCKED WHILE JOGGING
        </Text>
      )}
    </LinearGradient>
  );
};


const localStyles =
  StyleSheet.create({
    container: {
      width: 280,
      minHeight: 300,
      borderWidth: 1,
      borderColor: '#3A4145',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 14,
      paddingBottom: 16,
      boxShadow:
        'inset 0 0 0 1px rgba(255,255,255,0.025), 0 3px 10px rgba(0,0,0,0.35)'
    },

    disabled: {
      opacity: 0.55
    },

    title: {
      color: '#F4F4F4',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginBottom: 7
    },

    titleAccent: {
      width: 80,
      height: 2,
      borderRadius: 2,
      backgroundColor: '#2891B9',
      marginBottom: 0
    },

    scaleControlGap: {
      height: 24
    },

    controls: {
      width: 210,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },

    button: {
      width: 58,
      height: 52,
      borderRadius: 7,
      backgroundColor: '#252B2F',
      borderWidth: 1,
      borderColor: '#2891B9',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow:
        'inset 0 1px 1px rgba(255,255,255,0.08), 0 2px 5px rgba(0,0,0,0.35)'
    },

    buttonDisabled: {
      opacity: 0.35
    },

    buttonText: {
      color: '#F6F6F6',
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 24
    },

    valueBox: {
      width: 82,
      height: 40,
      borderRadius: 7,
      backgroundColor: '#0C1114',
      borderWidth: 1,
      borderColor: '#566066',
      alignItems: 'center',
      justifyContent: 'center'
    },

    valueText: {
      color: '#28A9EE',
      fontSize: 21,
      fontWeight: '600',
      letterSpacing: 0.3
    },

    rangeText: {
      color: '#D1D4D6',
      fontSize: 12,
      fontWeight: '500',
      marginTop: 8,
      letterSpacing: 0.25
    },

    rangeAccent: {
      color: '#37C1F5',
      fontWeight: '700'
    },

    lockText: {
      color: '#D8D8D8',
      fontSize: 10,
      fontWeight: '700',
      marginTop: 7
    }
  });


export default React.memo(JogSpeedometer);
