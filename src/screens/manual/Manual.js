import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

import styles from '../../styles';
import COLORS from '../../colors';
import { SocketContext } from '../../helpers/SocketContext';

import {
  setEmergency,
  setJog
} from '../../redux/ducks/auto';

import Stats from '../../components/Stats';
import api from '../../helpers/Api';

import JogSpeedometer from './JogSpeedometer';
import ContinuousJogPanel from './ContinuousJogPanel';


/*
 * Keep false on production HMI.
 * Prevents console spam from adding load to Chromium.
 */
const DEBUG_MANUAL_JOG = false;

const manualLog = (...args) => {
  if (DEBUG_MANUAL_JOG) {
    console.log(...args);
  }
};


const Manual = ({ navigation }) => {

  const socket =
    useContext(SocketContext);

  const dispatch =
    useDispatch();


  /*
   * ============================================================
   * EXISTING MANUAL MODE STATE
   * ============================================================
   */

  const [mode, setMode] =
    useState('JOG');

  const [position, setPosition] =
    useState(0.1);

  /*
   * Physical arrow contract remains unchanged.
   *
   * LEFT  = 1
   * RIGHT = 0
   *
   * Backend handles motor polarity.
   */
  const [direction, setDirection] =
    useState(1);

  const [motorDir, setMotorDir] =
    useState(1);

  /*
   * Jog feed remains LOCAL frontend state.
   *
   * Machine Parameter gives initial value.
   * Value is sent with jog_mode START.
   */
  const [jogFeed, setJogFeed] =
    useState(1);

  const [jogPressed, setJogPressed] =
    useState(null);

  const [stepPressed, setStepPressed] =
    useState(null);

  const [action, setAction] =
    useState(0);

  const [modal, setModal] =
    useState(false);

  const [moving, setMoving] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [zeroRef, setZeroRef] =
    useState(true);


  const {
    running,
    jog,
    emergency,
    reset,
    zeroref
  } =
    useSelector(
      state => state.auto
    );


  /*
   * ============================================================
   * EXISTING JOG REFERENCES
   * ============================================================
   *
   * These refs describe ACTUAL motion request state.
   *
   * They are used for both:
   *
   * 1. Existing normal hold-to-run jog.
   * 2. New continuous latched jog.
   */

  const jogActiveRef =
    useRef(false);

  const jogDirectionRef =
    useRef(null);


  /*
   * ============================================================
   * NEW CONTINUOUS JOG STATE
   * ============================================================
   */

  const [
    continuousJogEnabled,
    setContinuousJogEnabled
  ] =
    useState(false);

  /*
   * null = stopped
   * 1    = LEFT active
   * 0    = RIGHT active
   */
  const [
    continuousJogDirection,
    setContinuousJogDirection
  ] =
    useState(null);

  /*
   * Refs prevent stale responder callbacks and avoid unnecessary renders.
   */
  const continuousJogEnabledRef =
    useRef(false);

  const continuousJogDirectionRef =
    useRef(null);


  /*
   * ============================================================
   * COMMON SOCKET SEND
   * ============================================================
   */

  const handleSend =
    useCallback(
      (ev, req) => {
        socket.emit(
          ev,
          req
        );
      },
      [socket]
    );


  /*
   * ============================================================
   * JOG FEED
   * ============================================================
   */

  const handleJogFeedChange =
    useCallback(
      (newJogFeed) => {

        const safeJogFeed =
          Number(
            Number(
              newJogFeed
            ).toFixed(6)
          );

        if (
          Number.isNaN(
            safeJogFeed
          ) ||
          safeJogFeed < 0 ||
          safeJogFeed > 20
        ) {
          return;
        }

        setJogFeed(
          currentJogFeed => {

            if (
              currentJogFeed ===
              safeJogFeed
            ) {
              return currentJogFeed;
            }

            return safeJogFeed;
          }
        );
      },
      []
    );


  /*
   * Backend applies motor polarity.
   * Frontend NEVER double-inverts.
   */
  const getActualDirection =
    useCallback(
      (arrowDir) => {
        return arrowDir;
      },
      []
    );


  /*
   * ============================================================
   * NORMAL JOG
   * ============================================================
   *
   * THIS IS YOUR EXISTING BEHAVIOUR.
   *
   * Continuous Jog OFF:
   *
   * finger DOWN = START
   * finger HOLD = keep running
   * finger UP   = STOP
   *
   * This logic is deliberately preserved.
   */

  const startJog =
    useCallback(
      (arrowDir) => {

        if (
          mode !== 'JOG'
        ) {
          return;
        }

        if (
          zeroref ||
          emergency ||
          reset
        ) {
          return;
        }

        /*
         * Normal hold-jog must never start while Continuous Jog mode
         * is enabled.
         */
        if (
          continuousJogEnabledRef.current
        ) {
          return;
        }

        /*
         * Prevent duplicate START packets while finger remains held.
         */
        if (
          jogActiveRef.current
        ) {
          return;
        }

        const actualDir =
          getActualDirection(
            arrowDir
          );

        jogActiveRef.current =
          true;

        jogDirectionRef.current =
          actualDir;

        setJogPressed(
          arrowDir === 1
            ? 'LEFT'
            : 'RIGHT'
        );

        setDirection(
          arrowDir
        );

        manualLog(
          '[MANUAL-JOG] START',
          'motor_dir=',
          motorDir,
          'arrow=',
          arrowDir === 1
            ? 'LEFT'
            : 'RIGHT',
          'sent_dir=',
          actualDir,
          'jog_feed=',
          jogFeed
        );

        /*
         * EXACT existing backend contract.
         */
        handleSend(
          'jog_mode',
          {
            "dir": actualDir,
            "action": 1,
            "jog_feed": jogFeed
          }
        );

        dispatch(
          setJog(true)
        );

        setAction(1);
      },
      [
        mode,
        zeroref,
        emergency,
        reset,
        motorDir,
        jogFeed,
        getActualDirection,
        handleSend,
        dispatch
      ]
    );


  /*
   * ============================================================
   * COMMON JOG STOP
   * ============================================================
   *
   * Used by both:
   *
   * normal hold-to-run jog
   * continuous jog
   */

  const stopJog =
    useCallback(
      (reason = 'UNKNOWN') => {

        if (
          !jogActiveRef.current
        ) {

          setJogPressed(null);

          continuousJogDirectionRef.current =
            null;

          setContinuousJogDirection(
            null
          );

          dispatch(
            setJog(false)
          );

          setAction(0);

          return;
        }

        const actualDir =
          jogDirectionRef.current !== null
            ? jogDirectionRef.current
            : 1;

        jogActiveRef.current =
          false;

        jogDirectionRef.current =
          null;

        continuousJogDirectionRef.current =
          null;

        setContinuousJogDirection(
          null
        );

        setJogPressed(
          null
        );

        manualLog(
          '[MANUAL-JOG] STOP',
          'reason=',
          reason,
          'dir=',
          actualDir
        );

        /*
         * EXACT existing backend STOP contract.
         */
        handleSend(
          'jog_mode',
          {
            "dir": actualDir,
            "action": 0
          }
        );

        dispatch(
          setJog(false)
        );

        setAction(0);
      },
      [
        handleSend,
        dispatch
      ]
    );


  /*
   * ============================================================
   * CONTINUOUS JOG START
   * ============================================================
   *
   * Sends one START only.
   *
   * Finger release does NOT stop it.
   */

  const startContinuousJog =
    useCallback(
      (arrowDir) => {

        if (
          !continuousJogEnabledRef.current
        ) {
          return;
        }

        if (
          mode !== 'JOG'
        ) {
          return;
        }

        if (
          zeroref ||
          emergency ||
          reset
        ) {
          return;
        }

        const actualDir =
          getActualDirection(
            arrowDir
          );

        jogActiveRef.current =
          true;

        jogDirectionRef.current =
          actualDir;

        continuousJogDirectionRef.current =
          arrowDir;

        setContinuousJogDirection(
          arrowDir
        );

        setJogPressed(
          arrowDir === 1
            ? 'LEFT'
            : 'RIGHT'
        );

        setDirection(
          arrowDir
        );

        manualLog(
          '[CONTINUOUS-JOG] START',
          arrowDir === 1
            ? 'LEFT'
            : 'RIGHT',
          'feed=',
          jogFeed
        );

        /*
         * SAME backend START packet as normal jog.
         */
        handleSend(
          'jog_mode',
          {
            "dir": actualDir,
            "action": 1,
            "jog_feed": jogFeed
          }
        );

        dispatch(
          setJog(true)
        );

        setAction(1);
      },
      [
        mode,
        zeroref,
        emergency,
        reset,
        jogFeed,
        getActualDirection,
        handleSend,
        dispatch
      ]
    );


  /*
   * ============================================================
   * CONTINUOUS ARROW TAP
   * ============================================================
   *
   * Example:
   *
   * stopped
   *   tap LEFT
   *   -> start LEFT
   *
   * LEFT running
   *   tap LEFT
   *   -> stop
   *
   * LEFT running
   *   tap RIGHT
   *   -> STOP LEFT
   *   -> START RIGHT
   *
   * RIGHT behaves identically.
   */

  const handleContinuousJogPress =
    useCallback(
      (arrowDir) => {

        if (
          !continuousJogEnabledRef.current
        ) {
          return;
        }

        if (
          mode !== 'JOG' ||
          zeroref ||
          emergency ||
          reset
        ) {
          return;
        }

        const activeArrow =
          continuousJogDirectionRef.current;


        /*
         * SAME ACTIVE ARROW PRESSED AGAIN
         * -> toggle OFF.
         */
        if (
          jogActiveRef.current &&
          activeArrow === arrowDir
        ) {

          stopJog(
            'CONTINUOUS_SAME_ARROW_STOP'
          );

          return;
        }


        /*
         * OPPOSITE ARROW PRESSED
         * -> stop current direction first.
         */
        if (
          jogActiveRef.current &&
          activeArrow !== null &&
          activeArrow !== arrowDir
        ) {

          stopJog(
            'CONTINUOUS_DIRECTION_SWITCH'
          );
        }


        /*
         * Start newly selected direction.
         */
        startContinuousJog(
          arrowDir
        );
      },
      [
        mode,
        zeroref,
        emergency,
        reset,
        stopJog,
        startContinuousJog
      ]
    );


  /*
   * ============================================================
   * CONTINUOUS MODE ENABLE / DISABLE
   * ============================================================
   */

  const disableContinuousJog =
    useCallback(
      (
        reason =
          'CONTINUOUS_MODE_DISABLED'
      ) => {

        if (
          continuousJogEnabledRef.current &&
          jogActiveRef.current
        ) {

          stopJog(
            reason
          );
        }

        continuousJogEnabledRef.current =
          false;

        continuousJogDirectionRef.current =
          null;

        setContinuousJogEnabled(
          false
        );

        setContinuousJogDirection(
          null
        );

        setJogPressed(
          null
        );
      },
      [
        stopJog
      ]
    );


  const toggleContinuousJog =
    useCallback(
      () => {

        if (
          mode !== 'JOG' ||
          zeroref ||
          emergency ||
          reset
        ) {
          return;
        }


        /*
         * Turn Continuous Jog OFF.
         *
         * If motor is running, STOP first.
         */
        if (
          continuousJogEnabledRef.current
        ) {

          disableContinuousJog(
            'CONTINUOUS_TOGGLE_OFF'
          );

          return;
        }


        /*
         * Normal hold-to-run is currently active.
         * Do not allow mode change during a held jog.
         */
        if (
          jogActiveRef.current
        ) {
          return;
        }


        continuousJogEnabledRef.current =
          true;

        continuousJogDirectionRef.current =
          null;

        setContinuousJogEnabled(
          true
        );

        setContinuousJogDirection(
          null
        );

        setJogPressed(
          null
        );

        manualLog(
          '[CONTINUOUS-JOG] MODE ENABLED'
        );
      },
      [
        mode,
        zeroref,
        emergency,
        reset,
        disableContinuousJog
      ]
    );


  /*
   * Dedicated STOP JOG button.
   */
  const handleContinuousStop =
    useCallback(
      () => {

        if (
          !continuousJogEnabledRef.current
        ) {
          return;
        }

        stopJog(
          'CONTINUOUS_STOP_BUTTON'
        );
      },
      [
        stopJog
      ]
    );


  /*
   * ============================================================
   * STEP MODE
   * ============================================================
   *
   * Existing logic preserved.
   */

  const executeStep =
    useCallback(
      (arrowDir) => {

        if (
          mode !== 'STEP'
        ) {
          return;
        }

        if (
          moving
        ) {

          manualLog(
            '[MANUAL-STEP] ignored - movement still active'
          );

          return;
        }

        if (
          zeroref ||
          emergency ||
          reset
        ) {
          return;
        }

        const actualStepDir =
          getActualDirection(
            arrowDir
          );

        const actualStepPosition =
          actualStepDir === 1
            ? position
            : 0 - position;

        setDirection(
          arrowDir
        );

        manualLog(
          '[MANUAL-STEP]',
          'motor_dir=',
          motorDir,
          'arrow=',
          arrowDir === 1
            ? 'LEFT'
            : 'RIGHT',
          'sent_dir=',
          actualStepDir,
          'position=',
          actualStepPosition
        );

        handleSend(
          'step_mode',
          {
            "drive_id": 1,
            "position": actualStepPosition,
            "dir": actualStepDir
          }
        );

        setMoving(
          true
        );
      },
      [
        mode,
        moving,
        zeroref,
        emergency,
        reset,
        motorDir,
        position,
        getActualDirection,
        handleSend
      ]
    );


  /*
   * ============================================================
   * SAFETY STATE
   * ============================================================
   *
   * Emergency / Reset / Zero Ref / leaving JOG:
   *
   * STOP motion and cancel Continuous Jog mode.
   */

  useEffect(
    () => {

      if (
        emergency ||
        reset ||
        zeroref ||
        mode !== 'JOG'
      ) {

        stopJog(
          'SAFETY_STATE'
        );

        continuousJogEnabledRef.current =
          false;

        continuousJogDirectionRef.current =
          null;

        setContinuousJogEnabled(
          false
        );

        setContinuousJogDirection(
          null
        );
      }
    },
    [
      emergency,
      reset,
      zeroref,
      mode,
      stopJog
    ]
  );


  /*
   * Emergency / Reset UI synchronization.
   */
  useEffect(
    () => {

      if (
        emergency ||
        reset
      ) {

        setAction(0);

        setMoving(false);

        setJogPressed(null);

        setStepPressed(null);

        jogActiveRef.current =
          false;

        jogDirectionRef.current =
          null;

        continuousJogEnabledRef.current =
          false;

        continuousJogDirectionRef.current =
          null;

        setContinuousJogEnabled(
          false
        );

        setContinuousJogDirection(
          null
        );

        dispatch(
          setJog(false)
        );
      }
    },
    [
      emergency,
      reset,
      dispatch
    ]
  );


  /*
   * ============================================================
   * GLOBAL RELEASE SAFETY
   * ============================================================
   *
   * NORMAL JOG:
   *
   * mouse release = STOP
   *
   * CONTINUOUS JOG:
   *
   * mouse release = DO NOTHING
   *
   * Browser/window blur ALWAYS stops for safety.
   */

  useEffect(
    () => {

      if (
        typeof window === 'undefined'
      ) {
        return undefined;
      }

      const releaseJogFromMouse =
        () => {

          /*
           * Existing normal hold-to-run safety only.
           *
           * Continuous Jog intentionally ignores finger/mouse release.
           */
          if (
            jogActiveRef.current &&
            !continuousJogEnabledRef.current
          ) {

            stopJog(
              'GLOBAL_MOUSEUP'
            );
          }
        };


      const releaseJogFromBlur =
        () => {

          if (
            jogActiveRef.current
          ) {

            stopJog(
              'WINDOW_BLUR'
            );
          }

          continuousJogEnabledRef.current =
            false;

          continuousJogDirectionRef.current =
            null;

          setContinuousJogEnabled(
            false
          );

          setContinuousJogDirection(
            null
          );
        };


      window.addEventListener(
        'mouseup',
        releaseJogFromMouse
      );

      /*
       * Do NOT add global touchend.
       *
       * Your Waveshare can emit unexpected touch-end behavior
       * during existing normal hold-to-run operation.
       */

      window.addEventListener(
        'blur',
        releaseJogFromBlur
      );


      return () => {

        window.removeEventListener(
          'mouseup',
          releaseJogFromMouse
        );

        window.removeEventListener(
          'blur',
          releaseJogFromBlur
        );

        stopJog(
          'UNMOUNT'
        );

        continuousJogEnabledRef.current =
          false;

        continuousJogDirectionRef.current =
          null;
      };
    },
    [
      stopJog
    ]
  );


  /*
   * ============================================================
   * NAVIGATION BLUR SAFETY
   * ============================================================
   *
   * If operator leaves Manual screen:
   *
   * stop jog
   * cancel continuous mode
   */

  useFocusEffect(
    useCallback(
      () => {

        return () => {

          if (
            jogActiveRef.current
          ) {

            stopJog(
              'MANUAL_SCREEN_BLUR'
            );
          }

          continuousJogEnabledRef.current =
            false;

          continuousJogDirectionRef.current =
            null;

          setContinuousJogEnabled(
            false
          );

          setContinuousJogDirection(
            null
          );
        };
      },
      [
        stopJog
      ]
    )
  );


  /*
   * ============================================================
   * SOCKET DISCONNECT
   * ============================================================
   *
   * Best-effort frontend stop / UI clearing.
   *
   * NOTE:
   * True fail-safe network-loss stopping ultimately requires a
   * backend/drive watchdog because once the socket is physically gone
   * the browser cannot guarantee delivery of a STOP packet.
   */

  useEffect(
    () => {

      const handleSocketDisconnect =
        () => {

          if (
            jogActiveRef.current
          ) {

            stopJog(
              'SOCKET_DISCONNECT'
            );
          }

          continuousJogEnabledRef.current =
            false;

          continuousJogDirectionRef.current =
            null;

          setContinuousJogEnabled(
            false
          );

          setContinuousJogDirection(
            null
          );

          setJogPressed(
            null
          );
        };


      socket.on(
        'disconnect',
        handleSocketDisconnect
      );


      return () => {

        socket.off(
          'disconnect',
          handleSocketDisconnect
        );
      };
    },
    [
      socket,
      stopJog
    ]
  );


  /*
   * ============================================================
   * EXISTING COMPLETION HANDLERS
   * ============================================================
   */

  const handleStep =
    useCallback(
      () => {

        setMoving(
          false
        );
      },
      []
    );


  const handleEnableEmergency =
    useCallback(
      () => {

        dispatch(
          setEmergency(
            false,
            reset,
            zeroref
          )
        );
      },
      [
        dispatch,
        reset,
        zeroref
      ]
    );


  const handleEnableReset =
    useCallback(
      () => {

        dispatch(
          setEmergency(
            false,
            false,
            false
          )
        );
      },
      [
        dispatch
      ]
    );


  const handleEnableZeroref =
    useCallback(
      () => {

        dispatch(
          setEmergency(
            emergency,
            reset,
            false
          )
        );
      },
      [
        dispatch,
        emergency,
        reset
      ]
    );


  useFocusEffect(
    useCallback(
      () => {

        setModal(
          running
        );
      },
      [
        running
      ]
    )
  );


  /*
   * Existing completion listeners.
   */
  useEffect(
    () => {

      socket.on(
        "step_mode_completed",
        handleStep
      );

      socket.on(
        "gotozero_done",
        handleEnableZeroref
      );

      socket.on(
        "emergency_done",
        handleEnableEmergency
      );

      socket.on(
        "reset_done",
        handleEnableReset
      );


      return () => {

        socket.off(
          "step_mode_completed",
          handleStep
        );

        socket.off(
          "gotozero_done",
          handleEnableZeroref
        );

        socket.off(
          "emergency_done",
          handleEnableEmergency
        );

        socket.off(
          "reset_done",
          handleEnableReset
        );
      };
    },
    [
      socket,
      handleStep,
      handleEnableReset,
      handleEnableEmergency,
      handleEnableZeroref
    ]
  );


  /*
   * ============================================================
   * LOAD MACHINE PARAMETERS
   * ============================================================
   */

  const fetchData =
    useCallback(
      () => {

        setLoading(
          true
        );

        api
          .getJSON(
            'dac_params'
          )
          .then(
            async (
              resJSON
            ) => {

              manualLog(
                '[MANUAL] dac_params =',
                resJSON
              );

              setZeroRef(
                true
              );


              const settingsA =
                resJSON &&
                resJSON.resp &&
                resJSON.resp.A
                  ? resJSON.resp.A
                  : (
                      resJSON &&
                      resJSON.A
                        ? resJSON.A
                        : null
                    );


              if (
                settingsA &&
                settingsA.motor_dir !== undefined &&
                settingsA.motor_dir !== null
              ) {

                const loadedMotorDir =
                  Number(
                    settingsA.motor_dir
                  );


                if (
                  loadedMotorDir === 0
                ) {

                  setMotorDir(
                    0
                  );

                  manualLog(
                    '[MANUAL] MOTOR DIR = 0 (-VE)'
                  );

                  manualLog(
                    '[MANUAL] drive polarity handled by backend/YAML'
                  );

                  manualLog(
                    '[MANUAL] frontend arrows remain LEFT=1 RIGHT=0'
                  );

                } else {

                  setMotorDir(
                    1
                  );

                  manualLog(
                    '[MANUAL] MOTOR DIR = 1 (+VE)'
                  );

                  manualLog(
                    '[MANUAL] drive polarity handled by backend/YAML'
                  );

                  manualLog(
                    '[MANUAL] frontend arrows remain LEFT=1 RIGHT=0'
                  );
                }

              } else {

                setMotorDir(
                  1
                );

                console.warn(
                  '[MANUAL] motor_dir missing - defaulting to motor_dir=1'
                );
              }


              if (
                settingsA &&
                settingsA.jog_feed !== undefined &&
                settingsA.jog_feed !== null
              ) {

                const loadedJogFeed =
                  Math.max(
                    0,
                    Math.min(
                      20,
                      Number(
                        settingsA.jog_feed
                      )
                    )
                  );


                if (
                  !Number.isNaN(
                    loadedJogFeed
                  )
                ) {

                  /*
                   * Initial value only.
                   * No extra socket traffic.
                   */
                  setJogFeed(
                    loadedJogFeed
                  );
                }
              }


              setLoading(
                false
              );
            }
          )
          .catch(
            (e) => {

              manualLog(
                '[MANUAL] dac_params error:',
                e
              );

              setLoading(
                false
              );
            }
          );
      },
      []
    );


  useFocusEffect(
    useCallback(
      () => {

        fetchData();
      },
      [
        fetchData
      ]
    )
  );


  /*
   * ============================================================
   * ARROW DISPLAY STATE
   * ============================================================
   */

  const leftArrowActive =
    mode === 'JOG'
      ? jogPressed === 'LEFT'
      : stepPressed === 'LEFT';


  const rightArrowActive =
    mode === 'JOG'
      ? jogPressed === 'RIGHT'
      : stepPressed === 'RIGHT';


  const jogSpeedPercent =
    Math.round(
      (
        jogFeed /
        20
      ) *
      100
    );


  /*
   * Toggle cannot be enabled during normal held-jog.
   *
   * But when Continuous mode itself is active, the toggle remains
   * available so operator can disable it and stop.
   */
  const continuousPanelDisabled =
    mode !== 'JOG' ||
    zeroref ||
    emergency ||
    reset ||
    (
      jog &&
      !continuousJogEnabled
    );


  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <>

      <ImageBackground
        style={styles.imgBg}
        width={width}
        source={
          require(
            '../../img/bg.png'
          )
        }
      >

        <View
          style={styles.containerStart}
        >

          <Stats
            location="MANUAL"
            navigation={navigation}
          />


          <View
            style={[
              styles.rowBetween,
              styles.itemsStart,
              styles.pt15,
              styles.px15,
              styles.flex1
            ]}
          >


            <View
              style={[
                styles.flex3,
                styles.rowCenter,
                styles.itemsStretch
              ]}
            >


              {/* =================================================
                  LEFT ARROW
                  ================================================= */}

              <View
                style={[
                  styles.mr10,
                  styles.manualLeft,
                  {
                    touchAction: 'none',
                    userSelect: 'none'
                  }
                ]}

                onStartShouldSetResponder={
                  () => true
                }

                onMoveShouldSetResponder={
                  () => false
                }

                onResponderGrant={
                  () => {

                    manualLog(
                      '[MANUAL-RESPONDER] LEFT GRANT'
                    );


                    if (
                      mode === 'JOG'
                    ) {

                      /*
                       * NEW CONTINUOUS MODE:
                       *
                       * one tap toggles / switches.
                       */
                      if (
                        continuousJogEnabledRef.current
                      ) {

                        handleContinuousJogPress(
                          1
                        );

                      } else {

                        /*
                         * EXISTING HOLD-TO-RUN.
                         */
                        startJog(
                          1
                        );
                      }

                    } else if (
                      mode === 'STEP'
                    ) {

                      if (
                        !moving &&
                        !zeroref &&
                        !emergency &&
                        !reset
                      ) {

                        setDirection(
                          1
                        );

                        setStepPressed(
                          'LEFT'
                        );
                      }
                    }
                  }
                }


                onResponderRelease={
                  () => {

                    manualLog(
                      '[MANUAL-RESPONDER] LEFT RELEASE'
                    );


                    if (
                      mode === 'JOG'
                    ) {

                      /*
                       * Continuous Jog:
                       * release intentionally does NOTHING.
                       *
                       * Normal Jog:
                       * preserve existing STOP-on-release.
                       */
                      if (
                        !continuousJogEnabledRef.current
                      ) {

                        stopJog(
                          'LEFT_RELEASE'
                        );
                      }

                    } else if (
                      mode === 'STEP'
                    ) {

                      setStepPressed(
                        null
                      );

                      executeStep(
                        1
                      );
                    }
                  }
                }


                onResponderTerminationRequest={
                  () => {

                    /*
                     * Existing normal hold jog must keep responder
                     * until release.
                     */
                    if (
                      jogActiveRef.current &&
                      !continuousJogEnabledRef.current
                    ) {

                      manualLog(
                        '[MANUAL-RESPONDER] LEFT KEEP RESPONDER'
                      );

                      return false;
                    }

                    return true;
                  }
                }


                onResponderTerminate={
                  () => {

                    manualLog(
                      '[MANUAL-RESPONDER] LEFT TERMINATED'
                    );


                    if (
                      mode === 'JOG'
                    ) {

                      /*
                       * Termination is treated as safety event,
                       * even in Continuous mode.
                       */
                      if (
                        jogActiveRef.current
                      ) {

                        stopJog(
                          'LEFT_TERMINATED'
                        );
                      }

                    } else if (
                      mode === 'STEP'
                    ) {

                      setStepPressed(
                        null
                      );
                    }
                  }
                }
              >

                <LinearGradient
                  colors={
                    leftArrowActive
                      ? [
                          COLORS.ctrlActive1,
                          COLORS.ctrlActive2
                        ]
                      : [
                          COLORS.ctrlInactive1,
                          COLORS.ctrlInactive2
                        ]
                  }
                  style={styles.manualInner}
                >

                  <svg
                    className="dirIcon"
                    width="68"
                    height="160"
                    viewBox="0 0 80 196"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                  >

                    <g
                      transform="translate(-109.000000, -33.000000)"
                      fill={
                        leftArrowActive
                          ? "#2891B9"
                          : "#FFFFFF33"
                      }
                    >

                      <path
                        d="M109,61.0740898 L179.093363,33 L189,109.212617 L169.306005,97.5499239 C160.875838,112.352739 158.130953,127.725392 161.071348,143.667884 C164.011744,159.610376 173.321294,173.207619 189,184.459613 L170.541039,229 C138.516464,213.22728 119.072998,189.319536 112.210642,157.276768 C105.348286,125.234001 109.677573,97.1084378 125.198504,72.9000792 L109,61.0740898 Z"
                        id="arrow-l"
                      />

                    </g>

                  </svg>

                </LinearGradient>

              </View>


              {/* =================================================
                  CENTER - SPEED / ZERO REF
                  ================================================= */}

              <View
                style={[
                  styles.itemsCenter,
                  styles.justifyCenter
                ]}
              >

                <View
                  style={{
                    width: 280,
                    minHeight: 280,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}
                >

                  {jog ? (

                    /*
                     * PERFORMANCE:
                     *
                     * Do not keep repainting the SVG speedometer while
                     * table is continuously moving.
                     */
                    <LinearGradient
                      colors={[
                        '#34393D',
                        '#24292D',
                        '#0D0F11'
                      ]}
                      style={{
                        width: 280,
                        minHeight: 300,
                        borderWidth: 1,
                        borderColor: '#3A4145',
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16
                      }}
                    >

                      <Text
                        style={styles.title1}
                      >
                        {
                          continuousJogEnabled
                            ? 'CONTINUOUS JOG ACTIVE'
                            : 'JOG ACTIVE'
                        }
                      </Text>


                      <Text
                        style={[
                          styles.body1,
                          styles.mt20,
                          {
                            color: '#37C1F5',
                            textAlign: 'center'
                          }
                        ]}
                      >
                        SPEED {jogSpeedPercent}%
                      </Text>


                      <Text
                        style={[
                          styles.body3,
                          styles.mt10,
                          {
                            textAlign: 'center'
                          }
                        ]}
                      >
                        {
                          continuousJogEnabled
                            ? 'TAP ACTIVE ARROW AGAIN OR PRESS STOP JOG'
                            : 'RELEASE ARROW TO STOP'
                        }
                      </Text>

                    </LinearGradient>

                  ) : (

                    <JogSpeedometer
                      value={jogFeed}
                      disabled={
                        mode !== 'JOG' ||
                        zeroref ||
                        emergency ||
                        reset
                      }
                      onChange={
                        handleJogFeedChange
                      }
                    />

                  )}

                </View>


                <TouchableOpacity
                  style={[
                    styles.w100p,
                    {
                      opacity:
                        (
                          jog ||
                          !zeroRef ||
                          emergency ||
                          reset ||
                          zeroref
                        )
                          ? 0.3
                          : 1
                    }
                  ]}
                  disabled={
                    jog ||
                    !zeroRef ||
                    emergency ||
                    reset ||
                    zeroref
                  }
                  onPress={
                    () => {

                      handleSend(
                        'goToZero',
                        {}
                      );

                      dispatch(
                        setEmergency(
                          false,
                          false,
                          true
                        )
                      );
                    }
                  }
                >

                  <LinearGradient
                    colors={[
                      COLORS.gray1,
                      COLORS.gray2
                    ]}
                    style={styles.btn}
                  >

                    <Text
                      style={styles.btnTxtRed}
                    >
                      ZERO REF
                    </Text>

                  </LinearGradient>

                </TouchableOpacity>

              </View>


              {/* =================================================
                  RIGHT ARROW
                  ================================================= */}

              <View
                style={[
                  styles.ml10,
                  styles.manualRight,
                  {
                    touchAction: 'none',
                    userSelect: 'none'
                  }
                ]}

                onStartShouldSetResponder={
                  () => true
                }

                onMoveShouldSetResponder={
                  () => false
                }

                onResponderGrant={
                  () => {

                    manualLog(
                      '[MANUAL-RESPONDER] RIGHT GRANT'
                    );


                    if (
                      mode === 'JOG'
                    ) {

                      if (
                        continuousJogEnabledRef.current
                      ) {

                        handleContinuousJogPress(
                          0
                        );

                      } else {

                        startJog(
                          0
                        );
                      }

                    } else if (
                      mode === 'STEP'
                    ) {

                      if (
                        !moving &&
                        !zeroref &&
                        !emergency &&
                        !reset
                      ) {

                        setDirection(
                          0
                        );

                        setStepPressed(
                          'RIGHT'
                        );
                      }
                    }
                  }
                }


                onResponderRelease={
                  () => {

                    manualLog(
                      '[MANUAL-RESPONDER] RIGHT RELEASE'
                    );


                    if (
                      mode === 'JOG'
                    ) {

                      if (
                        !continuousJogEnabledRef.current
                      ) {

                        stopJog(
                          'RIGHT_RELEASE'
                        );
                      }

                    } else if (
                      mode === 'STEP'
                    ) {

                      setStepPressed(
                        null
                      );

                      executeStep(
                        0
                      );
                    }
                  }
                }


                onResponderTerminationRequest={
                  () => {

                    if (
                      jogActiveRef.current &&
                      !continuousJogEnabledRef.current
                    ) {

                      manualLog(
                        '[MANUAL-RESPONDER] RIGHT KEEP RESPONDER'
                      );

                      return false;
                    }

                    return true;
                  }
                }


                onResponderTerminate={
                  () => {

                    manualLog(
                      '[MANUAL-RESPONDER] RIGHT TERMINATED'
                    );


                    if (
                      mode === 'JOG'
                    ) {

                      if (
                        jogActiveRef.current
                      ) {

                        stopJog(
                          'RIGHT_TERMINATED'
                        );
                      }

                    } else if (
                      mode === 'STEP'
                    ) {

                      setStepPressed(
                        null
                      );
                    }
                  }
                }
              >

                <LinearGradient
                  colors={
                    rightArrowActive
                      ? [
                          COLORS.ctrlActive1,
                          COLORS.ctrlActive2
                        ]
                      : [
                          COLORS.ctrlInactive1,
                          COLORS.ctrlInactive2
                        ]
                  }
                  style={styles.manualInner}
                >

                  <svg
                    className="dirIcon"
                    width="68"
                    height="160"
                    viewBox="0 0 80 196"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                  >

                    <g
                      transform="translate(-254.000000, -33.000000)"
                      fill={
                        rightArrowActive
                          ? "#2891B9"
                          : "#FFFFFF33"
                      }
                    >

                      <path
                        d="M254,61.0740898 L324.093363,33 L334,109.212617 L314.306005,97.5499239 C305.875838,112.352739 303.130953,127.725392 306.071348,143.667884 C309.011744,159.610376 318.321294,173.207619 334,184.459613 L315.541039,229 C283.516464,213.22728 264.072998,189.319536 257.210642,157.276768 C250.348286,125.234001 254.677573,97.1084378 270.198504,72.9000792 L254,61.0740898 Z"
                        id="arrow-r"
                        transform="translate(294.000000, 131.000000) scale(-1, 1) translate(-294.000000, -131.000000)"
                      />

                    </g>

                  </svg>

                </LinearGradient>

              </View>

            </View>


            {/* ===================================================
                RIGHT SIDE CONTROL COLUMN
                =================================================== */}

            <View
              style={[
                styles.flex1,
                styles.justifyStart
              ]}
            >


              {/* JOG / STEP */}

              <View
                style={[
                  styles.rowCenter,
                  styles.well,
                  styles.mb10
                ]}
              >

                <TouchableOpacity
                  style={[
                    styles.flex1,
                    {
                      opacity:
                        (
                          zeroref ||
                          reset
                        )
                          ? 0.3
                          : 1
                    }
                  ]}
                  disabled={
                    zeroref ||
                    reset
                  }
                  onPress={
                    () => {

                      setMode(
                        'JOG'
                      );

                      setJogPressed(
                        null
                      );

                      setStepPressed(
                        null
                      );
                    }
                  }
                >

                  <LinearGradient
                    colors={
                      mode === 'JOG'
                        ? [
                            COLORS.green1,
                            COLORS.green2
                          ]
                        : [
                            '#0000',
                            '#0000'
                          ]
                    }
                    style={styles.btn0}
                  >

                    <Text
                      style={styles.btnTxtRed}
                    >
                      JOG
                    </Text>

                  </LinearGradient>

                </TouchableOpacity>


                <TouchableOpacity
                  style={[
                    styles.flex1,
                    {
                      opacity:
                        (
                          zeroref ||
                          reset
                        )
                          ? 0.3
                          : 1
                    }
                  ]}
                  disabled={
                    (
                      mode === 'JOG' &&
                      action === 1
                    ) ||
                    zeroref ||
                    reset
                  }
                  onPress={
                    () => {

                      /*
                       * If Continuous mode was enabled but idle,
                       * switching to STEP cancels it.
                       */
                      disableContinuousJog(
                        'MODE_SWITCH_STEP'
                      );

                      stopJog(
                        'MODE_SWITCH_STEP'
                      );

                      handleSend(
                        'enable_step_mode',
                        {
                          "status": "1"
                        }
                      );

                      setJogPressed(
                        null
                      );

                      setStepPressed(
                        null
                      );

                      setMode(
                        'STEP'
                      );
                    }
                  }
                >

                  <LinearGradient
                    colors={
                      mode === 'STEP'
                        ? [
                            COLORS.green1,
                            COLORS.green2
                          ]
                        : [
                            '#0000',
                            '#0000'
                          ]
                    }
                    style={styles.btn0}
                  >

                    <Text
                      style={styles.btnTxtRed}
                    >
                      STEP
                    </Text>

                  </LinearGradient>

                </TouchableOpacity>

              </View>


              {/* =================================================
                  CONTINUOUS JOG PANEL
                  ================================================= */}

              {
                mode === 'JOG' &&
                <ContinuousJogPanel
                  enabled={
                    continuousJogEnabled
                  }
                  activeDirection={
                    continuousJogDirection
                  }
                  speedPercent={
                    jogSpeedPercent
                  }
                  disabled={
                    continuousPanelDisabled
                  }
                  onToggle={
                    toggleContinuousJog
                  }
                  onStop={
                    handleContinuousStop
                  }
                />
              }


              {/* =================================================
                  EXISTING STEP SELECTION
                  ================================================= */}

              {
                mode === 'STEP' &&
                <>

                  <View
                    style={[
                      styles.rowCenter,
                      styles.well,
                      styles.mb10
                    ]}
                  >

                    <TouchableOpacity
                      disabled={
                        zeroref
                      }
                      style={[
                        styles.flex1,
                        {
                          opacity:
                            zeroref
                              ? 0.3
                              : 1
                        }
                      ]}
                      onPress={
                        () => {

                          setPosition(
                            0.1
                          );
                        }
                      }
                    >

                      <LinearGradient
                        colors={
                          position === 0.1
                            ? [
                                COLORS.green1,
                                COLORS.green2
                              ]
                            : [
                                '#0000',
                                '#0000'
                              ]
                        }
                        style={styles.btn0}
                      >

                        <Text
                          style={styles.btnTxtRed}
                        >
                          0.1
                        </Text>

                      </LinearGradient>

                    </TouchableOpacity>


                    <TouchableOpacity
                      disabled={
                        zeroref
                      }
                      style={[
                        styles.flex1,
                        {
                          opacity:
                            zeroref
                              ? 0.3
                              : 1
                        }
                      ]}
                      onPress={
                        () => {

                          setPosition(
                            0.01
                          );
                        }
                      }
                    >

                      <LinearGradient
                        colors={
                          position === 0.01
                            ? [
                                COLORS.green1,
                                COLORS.green2
                              ]
                            : [
                                '#0000',
                                '#0000'
                              ]
                        }
                        style={styles.btn0}
                      >

                        <Text
                          style={styles.btnTxtRed}
                        >
                          0.01
                        </Text>

                      </LinearGradient>

                    </TouchableOpacity>


                    <TouchableOpacity
                      disabled={
                        zeroref
                      }
                      style={[
                        styles.flex1,
                        {
                          opacity:
                            zeroref
                              ? 0.3
                              : 1
                        }
                      ]}
                      onPress={
                        () => {

                          setPosition(
                            0.001
                          );
                        }
                      }
                    >

                      <LinearGradient
                        colors={
                          position === 0.001
                            ? [
                                COLORS.green1,
                                COLORS.green2
                              ]
                            : [
                                '#0000',
                                '#0000'
                              ]
                        }
                        style={styles.btn0}
                      >

                        <Text
                          style={styles.btnTxtRed}
                        >
                          0.001
                        </Text>

                      </LinearGradient>

                    </TouchableOpacity>

                  </View>

                </>
              }

            </View>

          </View>

        </View>

      </ImageBackground>


      {/* =========================================================
          EXISTING AUTO MODE OVERLAY
          ========================================================= */}

      {
        modal &&

        <View
          style={styles.overlayWrap}
        >

          <View
            style={styles.overlayInner}
          >

            <View
              style={[
                styles.rowCenter,
                styles.mb25
              ]}
            >

              <Ionicons
                name="ios-alert-circle"
                size={20}
                color="#fffa"
                style={styles.mr10}
              />


              <Text
                style={[
                  styles.title1,
                  {
                    textAlign: 'center'
                  }
                ]}
              >

                System is in auto mode. Please stop the program to visit Manual screen.

              </Text>

            </View>


            <View
              style={styles.rowCenter}
            >

              <TouchableOpacity
                style={styles.mr15}
                onPress={
                  () => {

                    navigation.goBack();
                  }
                }
              >

                <LinearGradient
                  colors={[
                    COLORS.blue1,
                    COLORS.blue2
                  ]}
                  style={styles.btn}
                >

                  <Text
                    style={styles.btnTxtRed}
                  >
                    BACK
                  </Text>

                </LinearGradient>

              </TouchableOpacity>


              <TouchableOpacity
                style={{}}
                onPress={
                  () => {

                    navigation.navigate(
                      'AutoScreens',
                      {
                        screen: 'Auto'
                      }
                    );
                  }
                }
              >

                <LinearGradient
                  colors={[
                    COLORS.blue1,
                    COLORS.blue2
                  ]}
                  style={styles.btn}
                >

                  <Text
                    style={styles.btnTxtRed}
                  >
                    AUTO
                  </Text>

                </LinearGradient>

              </TouchableOpacity>

            </View>

          </View>

        </View>
      }

    </>
  );
};


export default Manual;