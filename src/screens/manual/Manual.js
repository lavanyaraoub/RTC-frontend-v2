import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

import styles from '../../styles';
import COLORS from '../../colors';
import { SocketContext } from '../../helpers/SocketContext';

import { setEmergency, setJog } from '../../redux/ducks/auto';

import Stats from '../../components/Stats';
import api from '../../helpers/Api';
import JogSpeedometer from './JogSpeedometer';

const Manual = ({ navigation }) => {
  const socket = useContext(SocketContext);

  const [mode, setMode] = useState('JOG');
  const [position, setPosition] = useState(0.1);

  /*
   * Physical arrow identifier:
   * LEFT  = 1
   * RIGHT = 0
   */
  const [direction, setDirection] = useState(1);

  /*
   * Machine Parameter motor_dir:
   *
   * Loaded here for diagnostics/UI visibility only.
   *
   * Direction polarity itself is applied ONCE by the backend
   * using the active drive's reverse/nonreverse configuration.
   *
   * Frontend physical arrow contract always remains:
   * LEFT  = 1
   * RIGHT = 0
   */
  const [motorDir, setMotorDir] = useState(1);

  /*
   * Manual Jog Feed:
   * integer range 0..20, step 1.
   * Sent live with jog_mode START.
   */
  const [jogFeed, setJogFeed] = useState(1);

  /*
   * Temporary arrow highlight states.
   *
   * JOG:
   * blue only while the arrow is physically held.
   *
   * STEP:
   * blue only while the arrow is physically pressed.
   */
  const [jogPressed, setJogPressed] = useState(null);
  const [stepPressed, setStepPressed] = useState(null);

  const [action, setAction] = useState(0);
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const [moving, setMoving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zeroRef, setZeroRef] = useState(true);

  const { running, jog, emergency, reset, zeroref } = useSelector(state => state.auto);

  /*
   * JOG safety refs.
   *
   * jogActiveRef:
   * true only while a hold-to-jog command is active.
   *
   * jogDirectionRef:
   * stores the ACTUAL direction sent to backend so STOP
   * always matches the corresponding START.
   */
  const jogActiveRef = useRef(false);
  const jogDirectionRef = useRef(null);

  /*
   * UI performance only: throttle outbound Jog Feed mirror packets while
   * dragging. The local knob still updates immediately on every valid
   * touch value, and the latest value is always sent as a trailing update.
   */
  const JOG_FEED_MIRROR_INTERVAL_MS = 50;
  const lastJogFeedMirrorAtRef = useRef(0);
  const pendingJogFeedMirrorRef = useRef(null);
  const jogFeedMirrorTimerRef = useRef(null);

  const handleSend = useCallback((ev, req) => {
    socket.emit(ev, req);
  }, [socket]);

  const emitJogFeedMirror = useCallback((value) => {
    const now = Date.now();
    const elapsed = now - lastJogFeedMirrorAtRef.current;

    pendingJogFeedMirrorRef.current = value;

    if (
      lastJogFeedMirrorAtRef.current === 0 ||
      elapsed >= JOG_FEED_MIRROR_INTERVAL_MS
    ) {
      if (jogFeedMirrorTimerRef.current) {
        clearTimeout(jogFeedMirrorTimerRef.current);
        jogFeedMirrorTimerRef.current = null;
      }

      lastJogFeedMirrorAtRef.current = now;
      pendingJogFeedMirrorRef.current = null;

      socket.emit(
        'set_jog_feed',
        {
          jog_feed: value
        }
      );

      return;
    }

    if (!jogFeedMirrorTimerRef.current) {
      const wait = JOG_FEED_MIRROR_INTERVAL_MS - elapsed;

      jogFeedMirrorTimerRef.current = setTimeout(() => {
        jogFeedMirrorTimerRef.current = null;

        const pendingValue = pendingJogFeedMirrorRef.current;
        pendingJogFeedMirrorRef.current = null;

        if (pendingValue === null) {
          return;
        }

        lastJogFeedMirrorAtRef.current = Date.now();

        socket.emit(
          'set_jog_feed',
          {
            jog_feed: pendingValue
          }
        );
      }, wait);
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (jogFeedMirrorTimerRef.current) {
        clearTimeout(jogFeedMirrorTimerRef.current);
        jogFeedMirrorTimerRef.current = null;
      }
    };
  }, []);

  /*
   * =====================================================
   * SHARED JOG FEED SYNC
   * =====================================================
   * Backend mirrors only the selected speed value between
   * connected Manual screens. Motion START/STOP is NOT
   * mirrored and remains local hold-to-run behavior.
   */
  useEffect(() => {
    const handleJogFeedUpdate = (data) => {
      if (
        !data ||
        data.jog_feed === undefined ||
        data.jog_feed === null
      ) {
        return;
      }

      const value = Number(data.jog_feed);

      if (
        Number.isNaN(value) ||
        value < 0 ||
        value > 20
      ) {
        return;
      }

      console.log(
        '[MANUAL-JOG-SYNC] received jog_feed=',
        value
      );

      const nextJogFeed =
        Number(
          value.toFixed(6)
        );

      setJogFeed(currentJogFeed => {
        if (currentJogFeed === nextJogFeed) {
          return currentJogFeed;
        }

        return nextJogFeed;
      });
    };

    socket.on(
      'jog_feed_update',
      handleJogFeedUpdate
    );

    return () => {
      socket.off(
        'jog_feed_update',
        handleJogFeedUpdate
      );
    };
  }, [socket]);

  /*
   * =====================================================
   * GENERIC DRIVE DIRECTION CONTRACT
   * =====================================================
   *
   * The frontend always sends the PHYSICAL arrow identity:
   *
   * LEFT  = 1
   * RIGHT = 0
   *
   * Machine Parameter motor_dir is applied once by the
   * backend/active drive configuration through that drive's
   * reverse/nonreverse operation (0x607E where supported).
   *
   * IMPORTANT:
   * Do NOT invert direction again in the frontend.
   * Doing so causes a double inversion on drives whose
   * 0x607E polarity is already configured by the backend.
   */
  const getActualDirection = useCallback((arrowDir) => {
    return arrowDir;
  }, []);

  /*
   * =====================================================
   * JOG - HOLD ARROW TO RUN
   * =====================================================
   *
   * Finger DOWN  -> START JOG
   * Finger HELD  -> KEEP JOGGING
   * Finger UP    -> STOP JOG
   */
  const startJog = useCallback((arrowDir) => {
    if (mode !== 'JOG') {
      return;
    }

    if (zeroref || emergency || reset) {
      return;
    }

    /*
     * Prevent duplicate START commands.
     */
    if (jogActiveRef.current) {
      return;
    }

    const actualDir = getActualDirection(arrowDir);

    /*
     * Mark active before state updates/socket emit.
     */
    jogActiveRef.current = true;
    jogDirectionRef.current = actualDir;

    /*
     * Highlight the PHYSICAL arrow being held.
     */
    setJogPressed(arrowDir === 1 ? 'LEFT' : 'RIGHT');

    /*
     * Keep the existing physical direction state synchronized.
     */
    setDirection(arrowDir);

    console.log(
      '[MANUAL-JOG] START',
      'motor_dir=', motorDir,
      'arrow=', arrowDir === 1 ? 'LEFT' : 'RIGHT',
      'sent_dir=', actualDir,
      'jog_feed=', jogFeed
    );

    /*
     * Existing jog_mode contract is preserved.
     * Only jog_feed is additionally supplied.
     */
    handleSend(
      'jog_mode',
      {
        "dir": actualDir,
        "action": 1,
        "jog_feed": jogFeed
      }
    );

    dispatch(setJog(true));
    setAction(1);
  }, [
    mode,
    zeroref,
    emergency,
    reset,
    motorDir,
    jogFeed,
    getActualDirection,
    handleSend,
    dispatch
  ]);

  const stopJog = useCallback(() => {
    /*
     * If the local JOG ref is already cleared, still force
     * the UI/Redux JOG state back to STOP.
     *
     * This prevents the JogSpeedometer from remaining
     * disabled/locked until page refresh.
     */
    if (!jogActiveRef.current) {
      setJogPressed(null);
      dispatch(setJog(false));
      setAction(0);
      return;
    }

    const actualDir = jogDirectionRef.current !== null
      ? jogDirectionRef.current
      : 1;

    /*
     * Clear refs/state before socket emit so a second release
     * cannot generate another STOP command.
     */
    jogActiveRef.current = false;
    jogDirectionRef.current = null;
    setJogPressed(null);

    console.log(
      '[MANUAL-JOG] STOP',
      'dir=', actualDir
    );

    /*
     * STOP contract remains unchanged.
     */
    handleSend(
      'jog_mode',
      {
        "dir": actualDir,
        "action": 0
      }
    );

    /*
     * Always clear the frontend JOG state after STOP so the
     * speedometer unlocks immediately.
     */
    dispatch(setJog(false));
    setAction(0);
  }, [handleSend, dispatch]);

  /*
   * =====================================================
   * STEP - PRESS ARROW TO MOVE ONE STEP
   * =====================================================
   *
   * Select 0.1 / 0.01 / 0.001.
   *
   * Then:
   * LEFT arrow release  -> execute one LEFT step
   * RIGHT arrow release -> execute one RIGHT step
   *
   * There is NO MOVE button.
   */
  const executeStep = useCallback((arrowDir) => {
    if (mode !== 'STEP') {
      return;
    }

    /*
     * Do not accept another STEP until the backend sends
     * step_mode_completed for the current movement.
     */
    if (moving) {
      console.log('[MANUAL-STEP] ignored - movement still active');
      return;
    }

    if (zeroref || emergency || reset) {
      return;
    }

    const actualStepDir = getActualDirection(arrowDir);

    const actualStepPosition = actualStepDir === 1
      ? position
      : 0 - position;

    setDirection(arrowDir);

    console.log(
      '[MANUAL-STEP]',
      'motor_dir=', motorDir,
      'arrow=', arrowDir === 1 ? 'LEFT' : 'RIGHT',
      'sent_dir=', actualStepDir,
      'position=', actualStepPosition
    );

    handleSend(
      'step_mode',
      {
        "drive_id": 1,
        "position": actualStepPosition,
        "dir": actualStepDir
      }
    );

    /*
     * Block another STEP until step_mode_completed.
     */
    setMoving(true);
  }, [
    mode,
    moving,
    zeroref,
    emergency,
    reset,
    motorDir,
    position,
    getActualDirection,
    handleSend
  ]);

  /*
   * If JOG becomes unavailable while an arrow is held,
   * command STOP immediately.
   */
  useEffect(() => {
    if (
      emergency ||
      reset ||
      zeroref ||
      mode !== 'JOG'
    ) {
      stopJog();
    }
  }, [
    emergency,
    reset,
    zeroref,
    mode,
    stopJog
  ]);

  /*
   * Emergency/Reset UI synchronization.
   */
  useEffect(() => {
    if (emergency || reset) {
      setAction(0);
      setMoving(false);
      setJogPressed(null);
      setStepPressed(null);

      jogActiveRef.current = false;
      jogDirectionRef.current = null;

      dispatch(setJog(false));
    }
  }, [
    emergency,
    reset,
    dispatch
  ]);

  /*
   * =====================================================
   * GLOBAL RELEASE SAFETY FALLBACK
   * =====================================================
   *
   * Keep:
   * mouseup
   * touchend
   * blur
   *
   * IMPORTANT:
   * touchcancel is deliberately NOT used because the
   * Waveshare touchscreen can fire it during a valid
   * continuous hold and prematurely stop JOG.
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const releaseJog = () => {
      if (jogActiveRef.current) {
        console.log('[MANUAL-JOG] GLOBAL RELEASE');
        stopJog();
      }
    };

    window.addEventListener('mouseup', releaseJog);
    // window.addEventListener('touchend', releaseJog);
    window.addEventListener('blur', releaseJog);

    return () => {
      window.removeEventListener('mouseup', releaseJog);
      // window.removeEventListener('touchend', releaseJog);
      window.removeEventListener('blur', releaseJog);

      stopJog();
    };
  }, [stopJog]);

  const handleStep = useCallback(data => {
    setMoving(false);
  }, []);

  const handleEnableEmergency = () => {
    dispatch(setEmergency(false, reset, zeroref));
  };

  const handleEnableReset = () => {
    dispatch(setEmergency(false, false, false));
  };

  const handleEnableZeroref = () => {
    dispatch(setEmergency(emergency, reset, false));
  };

  useFocusEffect(
    useCallback(() => {
      setModal(running);
    }, [running])
  );

  /*
   * Existing socket event listeners.
   */
  useEffect(() => {
    socket.on("step_mode_completed", handleStep);
    socket.on("gotozero_done", handleEnableZeroref);
    socket.on("emergency_done", handleEnableEmergency);
    socket.on("reset_done", handleEnableReset);

    return () => {
      socket.off("step_mode_completed", handleStep);
      socket.off("gotozero_done", handleEnableZeroref);
      socket.off("emergency_done", handleEnableEmergency);
      socket.off("reset_done", handleEnableReset);
    };
  }, [
    socket,
    handleStep,
    handleEnableReset,
    handleEnableEmergency,
    handleEnableZeroref
  ]);

  /*
   * =====================================================
   * LOAD MACHINE PARAMETERS
   * =====================================================
   *
   * motor_dir:
   * still controls the existing physical direction mapping.
   *
   * jog_feed:
   * used only as the initial Manual-screen speedometer value.
   * Manual speed changes are sent live with jog_mode and are
   * NOT POSTed back to /dac_params.
   */
  const fetchData = async () => {
    setLoading(true);

    api.getJSON('dac_params')
      .then(async (resJSON) => {
        console.log('[MANUAL] dac_params =', resJSON);

        /*
         * Existing behavior retained.
         */
        setZeroRef(true);

        /*
         * Support both response shapes already seen in this frontend:
         *
         * { resp: { A: {...} } }
         * { A: {...} }
         */
        const settingsA =
          resJSON && resJSON.resp && resJSON.resp.A
            ? resJSON.resp.A
            : (
                resJSON && resJSON.A
                  ? resJSON.A
                  : null
              );

        /*
         * Load existing motor_dir.
         */
        if (
          settingsA &&
          settingsA.motor_dir !== undefined &&
          settingsA.motor_dir !== null
        ) {
          const loadedMotorDir = Number(settingsA.motor_dir);

          if (loadedMotorDir === 0) {
            setMotorDir(0);

            console.log('[MANUAL] MOTOR DIR = 0 (-VE)');
            console.log('[MANUAL] drive polarity handled by backend/YAML');
            console.log('[MANUAL] frontend arrows remain LEFT=1 RIGHT=0');
          } else {
            setMotorDir(1);

            console.log('[MANUAL] MOTOR DIR = 1 (+VE)');
            console.log('[MANUAL] drive polarity handled by backend/YAML');
            console.log('[MANUAL] frontend arrows remain LEFT=1 RIGHT=0');
          }
        } else {
          setMotorDir(1);
          console.warn('[MANUAL] motor_dir missing - defaulting to motor_dir=1');
        }

        /*
         * Load existing Machine Parameter Jog Feed only as the
         * initial Manual speedometer value.
         */
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

          if (!Number.isNaN(loadedJogFeed)) {
            setJogFeed(loadedJogFeed);

            /*
             * Seed/refresh the backend shared Jog Feed from the
             * existing Machine Parameter value when Manual opens.
             * This does NOT write back to /dac_params.
             */
            socket.emit(
              'set_jog_feed',
              {
                jog_feed: loadedJogFeed
              }
            );
          }
        }

        setLoading(false);
      })
      .catch((e) => {
        console.log('[MANUAL] dac_params error:', e);
        setLoading(false);
      });
  };

  /*
   * Reload Machine Parameters whenever Manual receives focus.
   */
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  /*
   * Arrow active conditions.
   */
  const leftArrowActive =
    mode === 'JOG'
      ? jogPressed === 'LEFT'
      : stepPressed === 'LEFT';

  const rightArrowActive =
    mode === 'JOG'
      ? jogPressed === 'RIGHT'
      : stepPressed === 'RIGHT';

  return (
    <>
      <ImageBackground
        style={styles.imgBg}
        width={width}
        source={require('../../img/bg.png')}
      >
        <View style={styles.containerStart}>
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
              {/*
               * =================================================
               * LEFT ARROW
               *
               * React Native Responder System is intentionally
               * used instead of TouchableOpacity for the motion
               * arrow itself.
               *
               * JOG:
               * grant   -> START
               * release -> STOP
               *
               * STEP:
               * grant   -> show pressed arrow
               * release -> execute exactly one STEP
               * =================================================
               */}
              <View
                style={[
                  styles.mr10,
                  styles.manualLeft,
                  {
                    touchAction: 'none',
                    userSelect: 'none'
                  }
                ]}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => false}
                onResponderGrant={() => {
                  console.log('[MANUAL-RESPONDER] LEFT GRANT');

                  if (mode === 'JOG') {
                    startJog(1);
                  } else if (mode === 'STEP') {
                    if (
                      !moving &&
                      !zeroref &&
                      !emergency &&
                      !reset
                    ) {
                      setDirection(1);
                      setStepPressed('LEFT');
                    }
                  }
                }}
                onResponderRelease={() => {
                  console.log('[MANUAL-RESPONDER] LEFT RELEASE');

                  if (mode === 'JOG') {
                    stopJog();
                  } else if (mode === 'STEP') {
                    setStepPressed(null);
                    executeStep(1);
                  }
                }}
                onResponderTerminationRequest={() => {
                  /*
                   * Never allow the browser to steal the responder
                   * while a live JOG command is active.
                   */
                  if (jogActiveRef.current) {
                    console.log('[MANUAL-RESPONDER] LEFT KEEP RESPONDER');
                    return false;
                  }

                  return true;
                }}
                onResponderTerminate={() => {
                  console.log('[MANUAL-RESPONDER] LEFT TERMINATED');

                  if (mode === 'JOG') {
                    stopJog();
                  } else if (mode === 'STEP') {
                    setStepPressed(null);
                  }
                }}
              >
                <LinearGradient
                  colors={
                    leftArrowActive
                      ? [COLORS.ctrlActive1, COLORS.ctrlActive2]
                      : [COLORS.ctrlInactive1, COLORS.ctrlInactive2]
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
                      fill={leftArrowActive ? "#2891B9" : "#FFFFFF33"}
                    >
                      <path
                        d="M109,61.0740898 L179.093363,33 L189,109.212617 L169.306005,97.5499239 C160.875838,112.352739 158.130953,127.725392 161.071348,143.667884 C164.011744,159.610376 173.321294,173.207619 189,184.459613 L170.541039,229 C138.516464,213.22728 119.072998,189.319536 112.210642,157.276768 C105.348286,125.234001 109.677573,97.1084378 125.198504,72.9000792 L109,61.0740898 Z"
                        id="arrow-l"
                      />
                    </g>
                  </svg>
                </LinearGradient>
              </View>

              {/*
               * CENTER
               */}
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
                  <JogSpeedometer
                    value={jogFeed}
                    disabled={
                      mode !== 'JOG' ||
                      jog ||
                      zeroref ||
                      emergency ||
                      reset
                    }
                    onChange={(newJogFeed) => {
                      const safeJogFeed =
                        Number(
                          Number(newJogFeed).toFixed(6)
                        );

                      if (
                        !Number.isNaN(safeJogFeed) &&
                        safeJogFeed >= 0 &&
                        safeJogFeed <= 20
                      ) {
                        /*
                         * Update this UI immediately.
                         */
                        setJogFeed(currentJogFeed => {
                          if (currentJogFeed === safeJogFeed) {
                            return currentJogFeed;
                          }

                          return safeJogFeed;
                        });

                        /*
                         * Mirror only the selected speed value to all
                         * connected Manual screens through the backend.
                         * Outbound mirror packets are throttled during drag
                         * to reduce UI/socket load; the final value is kept.
                         */
                        emitJogFeedMirror(safeJogFeed);
                      }
                    }}
                  />
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
                  onPress={() => {
                    handleSend('goToZero', {});
                    dispatch(setEmergency(false, false, true));
                  }}
                >
                  <LinearGradient
                    colors={[
                      COLORS.gray1,
                      COLORS.gray2
                    ]}
                    style={styles.btn}
                  >
                    <Text style={styles.btnTxtRed}>
                      ZERO REF
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/*
               * =================================================
               * RIGHT ARROW
               * =================================================
               */}
              <View
                style={[
                  styles.ml10,
                  styles.manualRight,
                  {
                    touchAction: 'none',
                    userSelect: 'none'
                  }
                ]}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => false}
                onResponderGrant={() => {
                  console.log('[MANUAL-RESPONDER] RIGHT GRANT');

                  if (mode === 'JOG') {
                    startJog(0);
                  } else if (mode === 'STEP') {
                    if (
                      !moving &&
                      !zeroref &&
                      !emergency &&
                      !reset
                    ) {
                      setDirection(0);
                      setStepPressed('RIGHT');
                    }
                  }
                }}
                onResponderRelease={() => {
                  console.log('[MANUAL-RESPONDER] RIGHT RELEASE');

                  if (mode === 'JOG') {
                    stopJog();
                  } else if (mode === 'STEP') {
                    setStepPressed(null);
                    executeStep(0);
                  }
                }}
                onResponderTerminationRequest={() => {
                  if (jogActiveRef.current) {
                    console.log('[MANUAL-RESPONDER] RIGHT KEEP RESPONDER');
                    return false;
                  }

                  return true;
                }}
                onResponderTerminate={() => {
                  console.log('[MANUAL-RESPONDER] RIGHT TERMINATED');

                  if (mode === 'JOG') {
                    stopJog();
                  } else if (mode === 'STEP') {
                    setStepPressed(null);
                  }
                }}
              >
                <LinearGradient
                  colors={
                    rightArrowActive
                      ? [COLORS.ctrlActive1, COLORS.ctrlActive2]
                      : [COLORS.ctrlInactive1, COLORS.ctrlInactive2]
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
                      fill={rightArrowActive ? "#2891B9" : "#FFFFFF33"}
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

            <View
              style={[
                styles.flex1,
                styles.justifyStart
              ]}
            >
              {/*
               * =================================================
               * JOG / STEP SELECTOR
               * =================================================
               */}
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
                  onPress={() => {
                    setMode('JOG');
                    setJogPressed(null);
                    setStepPressed(null);
                  }}
                >
                  <LinearGradient
                    colors={
                      mode === 'JOG'
                        ? [COLORS.green1, COLORS.green2]
                        : ['#0000', '#0000']
                    }
                    style={styles.btn0}
                  >
                    <Text style={styles.btnTxtRed}>
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
                  onPress={() => {
                    /*
                     * Ensure a possible JOG is stopped before switching.
                     */
                    stopJog();

                    handleSend(
                      'enable_step_mode',
                      {
                        "status": "1"
                      }
                    );

                    setJogPressed(null);
                    setStepPressed(null);
                    setMode('STEP');
                  }}
                >
                  <LinearGradient
                    colors={
                      mode === 'STEP'
                        ? [COLORS.green1, COLORS.green2]
                        : ['#0000', '#0000']
                    }
                    style={styles.btn0}
                  >
                    <Text style={styles.btnTxtRed}>
                      STEP
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/*
               * =================================================
               * STEP MODE
               * =================================================
               *
               * Select increment only.
               *
               * MOVE button is intentionally removed.
               *
               * Press/release LEFT or RIGHT arrow to execute
               * one STEP directly.
               * =================================================
               */}
              {mode === 'STEP' &&
                <>
                  <View
                    style={[
                      styles.rowCenter,
                      styles.well,
                      styles.mb10
                    ]}
                  >
                    <TouchableOpacity
                      disabled={zeroref}
                      style={[
                        styles.flex1,
                        {
                          opacity:
                            zeroref
                              ? 0.3
                              : 1
                        }
                      ]}
                      onPress={() => {
                        setPosition(0.1);
                      }}
                    >
                      <LinearGradient
                        colors={
                          position === 0.1
                            ? [COLORS.green1, COLORS.green2]
                            : ['#0000', '#0000']
                        }
                        style={styles.btn0}
                      >
                        <Text style={styles.btnTxtRed}>
                          0.1
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={zeroref}
                      style={[
                        styles.flex1,
                        {
                          opacity:
                            zeroref
                              ? 0.3
                              : 1
                        }
                      ]}
                      onPress={() => {
                        setPosition(0.01);
                      }}
                    >
                      <LinearGradient
                        colors={
                          position === 0.01
                            ? [COLORS.green1, COLORS.green2]
                            : ['#0000', '#0000']
                        }
                        style={styles.btn0}
                      >
                        <Text style={styles.btnTxtRed}>
                          0.01
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={zeroref}
                      style={[
                        styles.flex1,
                        {
                          opacity:
                            zeroref
                              ? 0.3
                              : 1
                        }
                      ]}
                      onPress={() => {
                        setPosition(0.001);
                      }}
                    >
                      <LinearGradient
                        colors={
                          position === 0.001
                            ? [COLORS.green1, COLORS.green2]
                            : ['#0000', '#0000']
                        }
                        style={styles.btn0}
                      >
                        <Text style={styles.btnTxtRed}>
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

      {modal &&
        <View style={styles.overlayWrap}>
          <View style={styles.overlayInner}>
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

            <View style={styles.rowCenter}>
              <TouchableOpacity
                style={styles.mr15}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <LinearGradient
                  colors={[
                    COLORS.blue1,
                    COLORS.blue2
                  ]}
                  style={styles.btn}
                >
                  <Text style={styles.btnTxtRed}>
                    BACK
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{}}
                onPress={() => {
                  navigation.navigate(
                    'AutoScreens',
                    {
                      screen: 'Auto'
                    }
                  );
                }}
              >
                <LinearGradient
                  colors={[
                    COLORS.blue1,
                    COLORS.blue2
                  ]}
                  style={styles.btn}
                >
                  <Text style={styles.btnTxtRed}>
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
