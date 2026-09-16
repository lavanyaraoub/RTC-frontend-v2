import React, { useMemo, useRef, useEffect } from 'react';

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


const JogSpeedometer = ({
  value = 1,
  onChange,
  disabled = false
}) => {

  /*
   * =====================================================
   * VISUAL SIZE
   * =====================================================
   *
   * Designed specifically for the center area between the
   * existing LEFT / RIGHT arrows.
   *
   * Logic is unchanged.
   */
  const SIZE = 220;

  const CENTER_X = 110;
  const CENTER_Y = 110;

  const ARC_RADIUS = 73;

  const START_ANGLE = 140;
  const END_ANGLE = 400;


  /*
   * =====================================================
   * JOG SPEED - 100 POINT RESOLUTION
   * =====================================================
   *
   * Exactly 100 selectable speed points:
   *
   * Point 1   = 0.00
   * Point 100 = 20.00
   *
   * STEP:
   *
   * (20 - 0) / (100 - 1)
   *
   * IMPORTANT:
   *
   * SEGMENTS controls visual bars only.
   * POINTS controls selectable speed resolution.
   */
  const MIN = 0;
  const MAX = 20;

  const POINTS = 101;

  const STEP =
    (MAX - MIN) /
    (POINTS - 1);

  const SEGMENTS = 48;

  /* DISPLAY ONLY - convert 0..20 to 0..100% */
  const getPercentage = (value) =>
    (value / MAX) * 100;


  /*
   * Keep the latest selected value available
   * during touch/drag operations.
   */
  const latestValueRef =
    useRef(
      Number(value) || MIN
    );


  /*
   * =====================================================
   * NORMALIZE TO EXACTLY 100 VALID POINTS
   * =====================================================
   */
  const clamp = (v) => {

    const num =
      Number(v);


    if (
      Number.isNaN(num)
    ) {

      return MIN;
    }


    const limited =
      Math.max(
        MIN,
        Math.min(
          MAX,
          num
        )
      );


    const pointIndex =
      Math.round(
        (limited - MIN) /
        STEP
      );


    const normalized =
      MIN +
      pointIndex *
      STEP;


    return Number(
      normalized.toFixed(6)
    );
  };


  const safeValue =
    clamp(
      value
    );


  useEffect(
    () => {

      latestValueRef.current =
        safeValue;

    },
    [
      safeValue
    ]
  );


  /*
   * Convert an angle/radius into SVG coordinates.
   */
  const pointAtAngle = (
    angle,
    radius
  ) => {

    const rad =
      (
        angle *
        Math.PI
      ) /
      180;


    return {

      x:
        CENTER_X +
        radius *
        Math.cos(rad),

      y:
        CENTER_Y +
        radius *
        Math.sin(rad)
    };
  };


  /*
   * =====================================================
   * VISUAL ARC
   * =====================================================
   *
   * Selected portion:
   * BLUE
   *
   * Remaining portion:
   * GREY
   *
   * Same industrial color family as the Manual screen.
   */
  const segments =
    useMemo(
      () => {

        const result = [];


        for (
          let i = 0;
          i < SEGMENTS;
          i++
        ) {

          const progress =
            i /
            (
              SEGMENTS - 1
            );


          const angle =
            START_ANGLE +
            progress *
            (
              END_ANGLE -
              START_ANGLE
            );


          const segmentValue =
            MIN +
            progress *
            (
              MAX -
              MIN
            );


          const outer =
            pointAtAngle(
              angle,
              ARC_RADIUS
            );


          const inner =
            pointAtAngle(
              angle,
              ARC_RADIUS - 15
            );


          result.push({

            key:
              i,

            x1:
              inner.x,

            y1:
              inner.y,

            x2:
              outer.x,

            y2:
              outer.y,

            value:
              segmentValue
          });
        }


        return result;

      },
      []
    );


  /*
   * Current knob position.
   */
  const valueProgress =
    (
      safeValue -
      MIN
    ) /
    (
      MAX -
      MIN
    );


  const knobAngle =
    START_ANGLE +
    valueProgress *
    (
      END_ANGLE -
      START_ANGLE
    );


  const knob =
    pointAtAngle(
      knobAngle,
      ARC_RADIUS - 4
    );


  /*
   * Update current Jog Feed.
   */
  const updateValue = (
    newValue
  ) => {

    if (
      disabled
    ) {

      return;
    }


    const next =
      clamp(
        newValue
      );


    latestValueRef.current =
      next;


    if (
      onChange
    ) {

      onChange(
        next
      );
    }
  };


  /*
   * Convert touch position on the radial gauge
   * into one of the 100 valid Jog Feed points.
   */
  const updateFromTouch = (
    event
  ) => {

    if (
      disabled
    ) {

      return;
    }


    const {
      locationX,
      locationY
    } =
      event.nativeEvent;


    const dx =
      locationX -
      CENTER_X;


    const dy =
      locationY -
      CENTER_Y;


    let angle =
      Math.atan2(
        dy,
        dx
      ) *
      180 /
      Math.PI;


    if (
      angle < 0
    ) {

      angle += 360;
    }


    /*
     * =====================================================
     * RADIAL END-POINT SNAP
     * =====================================================
     *
     * Real touchscreens do not always report the exact
     * end angle while dragging.
     *
     * Near MIN:
     * snap to START_ANGLE -> exact 0.00
     *
     * Near MAX:
     * snap to END_ANGLE -> exact 20.00
     */
    const END_SNAP_DEGREES =
      12;


    /*
     * MINIMUM / ZERO END
     *
     * START_ANGLE = 140 degrees.
     *
     * If the finger lands slightly before the start
     * because of touchscreen noise, snap it to 140
     * instead of rejecting the touch.
     */
    if (
      angle >=
        START_ANGLE -
        END_SNAP_DEGREES &&
      angle <
        START_ANGLE
    ) {

      angle =
        START_ANGLE;
    }


    /*
     * Convert the lower angle range into the extended
     * 360..400 degree portion of the radial scale.
     */
    if (
      angle <
      START_ANGLE
    ) {

      angle += 360;
    }


    /*
     * MAXIMUM END
     *
     * END_ANGLE = 400 degrees, which corresponds
     * to 40 degrees in normal atan2 output.
     */
    if (
      angle >
        END_ANGLE &&
      angle <=
        END_ANGLE +
        END_SNAP_DEGREES
    ) {

      angle =
        END_ANGLE;
    }


    if (
      angle <
      START_ANGLE ||
      angle >
      END_ANGLE
    ) {

      return;
    }


    const progress =
      (
        angle -
        START_ANGLE
      ) /
      (
        END_ANGLE -
        START_ANGLE
      );


    let rawValue =
      MIN +
      progress *
      (
        MAX -
        MIN
      );


    /*
     * Guarantee exact end values.
     *
     * This prevents the slider from stopping at
     * 0.20 / 0.40 / 0.60 when the operator is
     * clearly dragging into the zero end zone.
     */
    if (
      progress <=
      0.015
    ) {

      rawValue =
        MIN;
    }


    if (
      progress >=
      0.985
    ) {

      rawValue =
        MAX;
    }


    updateValue(
      rawValue
    );
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

      {/*
       * Header inspired by the supplied industrial reference.
       */}
      <Text
        style={
          localStyles.title
        }
      >
        JOG FEED
      </Text>

      {/* <View
        style={
          localStyles.titleAccent
        }
      /> */}


      <View

        style={{
          width:
            SIZE,

          height:
            175,

          touchAction:
            'none',

          userSelect:
            'none'
        }}

        onStartShouldSetResponder={() => {

          return !disabled;
        }}

        onMoveShouldSetResponder={() => {

          return !disabled;
        }}

        onResponderGrant={
          updateFromTouch
        }

        onResponderMove={
          updateFromTouch
        }
      >

        <Svg
          width={
            SIZE
          }
          height={
            190
          }
        >

          {segments.map(
            segment => (

              <Line

                key={
                  segment.key
                }

                x1={
                  segment.x1
                }

                y1={
                  segment.y1
                }

                x2={
                  segment.x2
                }

                y2={
                  segment.y2
                }

                stroke={
                  segment.value <=
                  safeValue
                    ? '#2891B9'
                    : '#666A6D'
                }

                strokeWidth={
                  5
                }

                strokeLinecap="round"
              />

            )
          )}


          {majorValues.map(
            tickValue => {

              const progress =
                (
                  tickValue -
                  MIN
                ) /
                (
                  MAX -
                  MIN
                );


              const angle =
                START_ANGLE +
                progress *
                (
                  END_ANGLE -
                  START_ANGLE
                );


              const tick =
                pointAtAngle(
                  angle,
                  ARC_RADIUS + 18
                );


              /*
              * UI DISPLAY ONLY
              *
              * Internal scale remains 0..20.
              * Display scale becomes 0..100.
              *
              * 0  -> 0
              * 5  -> 25
              * 10 -> 50
              * 15 -> 75
              * 20 -> 100
              */
              const displayTick =
                Math.round(
                  (
                    tickValue /
                    MAX
                  ) *
                  100
                );


              return (

                <SvgText

                  key={
                    tickValue
                  }

                  x={
                    tick.x
                  }

                  y={
                    tick.y
                  }

                  fill="#E8E8E8"

                  fontSize="15"

                  fontWeight="700"

                  textAnchor="middle"
                >

                  {displayTick}

                </SvgText>

              );
            }
          )}

          {/*
           * White center with RED outline, retained exactly
           * from the working design language.
           */}
          <Circle

            cx={
              knob.x
            }

            cy={
              knob.y
            }

            r={
              13
            }

            fill="#FFFFFF"

            stroke="#E53935"

            strokeWidth={
              5
            }
          />


          <SvgText

            x={
              CENTER_X
            }

            y={
              116
            }

            fill="#FFFFFF"

            fontSize="36"

            fontWeight="600"

            textAnchor="middle"
          >

            {getPercentage(safeValue).toFixed(0)}%

          </SvgText>


          <SvgText

            x={
              CENTER_X
            }

            y={
              132
            }

            fill="#37C1F5"

            fontSize="16"

            fontWeight="700"

            textAnchor="middle"
          >

            

          </SvgText>

        </Svg>

      </View>


      {/*
       * =================================================
       * LARGE CLEAR GAP BETWEEN RADIAL SCALE AND CONTROLS
       * =================================================
       *
       * This is intentionally generous for touchscreen use.
       */}
      <View
        style={
          localStyles.scaleControlGap
        }
      />


      <View
        style={
          localStyles.controls
        }
      >

        <TouchableOpacity

          disabled={
            disabled ||
            safeValue <=
            MIN
          }

          onPress={() => {

            updateValue(
              safeValue -
              STEP
            );
          }}

          style={[
            localStyles.button,

            (
              disabled ||
              safeValue <=
              MIN
            )
              ? localStyles.buttonDisabled
              : null
          ]}
        >

          <Text
            style={
              localStyles.buttonText
            }
          >
            −
          </Text>

        </TouchableOpacity>


        <View
          style={
            localStyles.valueBox
          }
        >

          <Text
            style={
              localStyles.valueText
            }
          >
            {getPercentage(safeValue).toFixed(0)}%
          </Text>

        </View>


        <TouchableOpacity

          disabled={
            disabled ||
            safeValue >=
            MAX
          }

          onPress={() => {

            updateValue(
              safeValue +
              STEP
            );
          }}

          style={[
            localStyles.button,

            (
              disabled ||
              safeValue >=
              MAX
            )
              ? localStyles.buttonDisabled
              : null
          ]}
        >

          <Text
            style={
              localStyles.buttonText
            }
          >
            +
          </Text>

        </TouchableOpacity>

      </View>


      <Text
        style={
          localStyles.rangeText
        }
      >
        <Text
          style={
            localStyles.rangeAccent
          }
        >
          RANGE:
        </Text>

        {' 0 - 100% SPEED SCALE'}
      </Text>


      {disabled && (

        <Text
          style={
            localStyles.lockText
          }
        >
          SPEED LOCKED WHILE JOGGING
        </Text>

      )}

    </LinearGradient>
  );
};


const localStyles =
  StyleSheet.create({

    container: {

      width:
        280,

      minHeight:
        300,

      borderWidth:
        1,

      borderColor:
        '#3A4145',

      borderRadius:
        10,

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      paddingTop:
        14,

      paddingBottom:
        16,

      /*
       * Web-compatible subtle industrial panel depth.
       */
      boxShadow:
        'inset 0 0 0 1px rgba(255,255,255,0.025), 0 3px 10px rgba(0,0,0,0.35)'
    },


    disabled: {

      opacity:
        0.55
    },


    title: {

      color:
        '#F4F4F4',

      fontSize:
        18,

      fontWeight:
        '700',

      letterSpacing:
        0.8,

      marginBottom:
        7
    },


    titleAccent: {

      width:
        80,

      height:
        2,

      borderRadius:
        2,

      backgroundColor:
        '#2891B9',

      marginBottom:
        0
    },


    /*
     * Deliberately larger gap requested by user.
     */
    scaleControlGap: {

      height:
        24
    },


    controls: {

      width:
        210,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between'
    },


    button: {

      width:
        58,

      height:
        52,

      borderRadius:
        7,

      backgroundColor:
        '#252B2F',

      borderWidth:
        1,

      borderColor:
        '#2891B9',

      alignItems:
        'center',

      justifyContent:
        'center',

      boxShadow:
        'inset 0 1px 1px rgba(255,255,255,0.08), 0 2px 5px rgba(0,0,0,0.35)'
    },


    buttonDisabled: {

      opacity:
        0.35
    },


    buttonText: {

      color:
        '#F6F6F6',

      fontSize:
        22,

      fontWeight:
        '600',

      lineHeight:
        24
    },


    valueBox: {

      width:
        82,

      height:
        40,

      borderRadius:
        7,

      backgroundColor:
        '#0C1114',

      borderWidth:
        1,

      borderColor:
        '#566066',

      alignItems:
        'center',

      justifyContent:
        'center'
    },


    valueText: {

      color:
        '#28A9EE',

      fontSize:
        21,

      fontWeight:
        '600',

      letterSpacing:
        0.3
    },


    rangeText: {

      color:
        '#D1D4D6',

      fontSize:
        12,

      fontWeight:
        '500',

      marginTop:
        8,

      letterSpacing:
        0.25
    },


    rangeAccent: {

      color:
        '#37C1F5',

      fontWeight:
        '700'
    },


    lockText: {

      color:
        '#D8D8D8',

      fontSize:
        10,

      fontWeight:
        '700',

      marginTop:
        7
    }

  });


export default JogSpeedometer;
