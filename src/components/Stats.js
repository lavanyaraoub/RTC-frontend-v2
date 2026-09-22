import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles';
import * as Animatable from 'react-native-animatable';
import COLORS from '../colors';
import { SocketContext } from '../helpers/SocketContext';
import { setEmergency } from '../redux/ducks/auto';


/*
 * Position traffic can arrive much faster than the display can physically
 * paint. Keep that hot path inside this small child component.
 *
 * - no periodic timer
 * - no background polling
 * - no hidden-screen position listener
 * - at most one position render per browser animation frame
 */
const LivePositionMetrics = React.memo(() => {
    const socket = useContext(SocketContext);
    const { jog } = useSelector(state => state.auto);

    const [position, setPosition] = React.useState({
        pos: '',
        dest: ''
    });

    const latestPosRef = useRef('');
    const latestDestRef = useRef('');
    const frameRef = useRef(null);
    const lastPaintAtRef = useRef(0);

    /*
     * HMI DISPLAY THROTTLE ONLY.
     *
     * Machine control / EtherCAT / backend polling remain unchanged.
     *
     * During continuous JOG, position changes nonstop. Updating the
     * React/Chromium display for every packet heats the Pi.
     *
     * jog=true  -> max 4 FPS, one update every 250 ms
     * jog=false -> max 12 FPS, one update every 80 ms
     */
    const getMinPaintInterval = useCallback(() => {
        return jog ? 250 : 80;
    }, [jog]);

    const flushPosition = useCallback(() => {
        if (frameRef.current !== null) {
            return;
        }

        const paint = (timestamp) => {
            const minInterval = getMinPaintInterval();
            const elapsed = timestamp - lastPaintAtRef.current;

            if (elapsed < minInterval) {
                frameRef.current = requestAnimationFrame(paint);
                return;
            }

            frameRef.current = null;
            lastPaintAtRef.current = timestamp;

            const nextPos = latestPosRef.current;
            const nextDest = latestDestRef.current;

            setPosition(current => {
                if (
                    current.pos === nextPos &&
                    current.dest === nextDest
                ) {
                    return current;
                }

                return {
                    pos: nextPos,
                    dest: nextDest
                };
            });
        };

        frameRef.current = requestAnimationFrame(paint);
    }, [getMinPaintInterval]);

    const handlePos = useCallback(data => {
        if (
            !data ||
            data.data === undefined
        ) {
            return;
        }

        latestPosRef.current = data.data;
        flushPosition();
    }, [flushPosition]);

    const handleDest = useCallback(data => {
        if (
            !data ||
            data.pos === undefined
        ) {
            return;
        }

        latestDestRef.current = data.pos;
        flushPosition();
    }, [flushPosition]);

    useFocusEffect(
        useCallback(() => {
            socket.on("pos_data", handlePos);
            socket.on("destination_position", handleDest);

            return () => {
                socket.off("pos_data", handlePos);
                socket.off("destination_position", handleDest);

                if (frameRef.current !== null) {
                    cancelAnimationFrame(frameRef.current);
                    frameRef.current = null;
                }
            };
        }, [socket, handlePos, handleDest])
    );

    return (
        <View style={styles.stats3}>
            <View style={styles.statsPositionColumn}>
                <View style={styles.statsMetricValueSlot}>
                    <View style={styles.statsPositionValueBox}>
                        <Text style={styles.statsPositionValueText}>
                            {position.dest}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={1}
                    style={styles.statsMetricLabel}
                >
                    ACTUAL POSITION
                </Text>
            </View>

            <View style={styles.statsPositionDivider} />

            <View style={styles.statsPositionColumn}>
                <View style={styles.statsMetricValueSlot}>
                    <View style={styles.statsPositionValueBox}>
                        <Text style={styles.statsPositionValueText}>
                            {position.pos}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={1}
                    style={styles.statsMetricLabel}
                >
                    DESTINATION
                </Text>
            </View>
        </View>
    );
});


const Stats = ({ navigation, location }) => {
    const socket = useContext(SocketContext);
    const { emergency, reset, zeroref } = useSelector(state => state.auto);

    const [action, setAction] = React.useState(0);
    const [error, setError] = React.useState(false);
    const [status, setStatus] = React.useState(false);
    const [fault, setFault] = React.useState(false);
    const [msg, setMsg] = React.useState('No Errors');

    /*
     * I/O remains event-driven exactly as before.
     * React only receives a new object if at least one bit changed.
     */
    const [ioStatus, setIoStatus] = React.useState({
        ecs: false,
        fin: false,
        sol_op: false,
        cl: false,
        dcl: false,
        alm_in: false,
        alm_out: false,
        home: false,
        pot: false,
        not: false
    });

    const [driveError, setDriveError] = React.useState('0');

    const dispatch = useDispatch();

    const errorRef = useRef(error);
    const statusRef = useRef(status);
    const emergencyRef = useRef(emergency);
    const resetRef = useRef(reset);
    const zerorefRef = useRef(zeroref);
    const lastAlarmRef = useRef(null);

    errorRef.current = error;
    statusRef.current = status;
    emergencyRef.current = emergency;
    resetRef.current = reset;
    zerorefRef.current = zeroref;

    const handleAlarm = useCallback(data => {
        /*
         * Repeated identical alarm packets do not need to repaint the HMI.
         */
        if (lastAlarmRef.current === data) {
            return;
        }

        lastAlarmRef.current = data;

        if (data == 'No Alarms') {
            setError(false);
            setFault(false);
            setMsg(data);
            setDriveError('0');
        }
        else {
            setMsg(data);
            setFault(true);

            const errorCode =
                typeof data === 'string'
                    ? (data.match(/\d+/) || ['0'])
                    : ['0'];

            setDriveError(errorCode[0]);

            if (!errorRef.current && !statusRef.current) {
                setError(true);
            }
        }
    }, []);

    const handleIO = useCallback(data => {
        if (!data || !data.ioStat) {
            return;
        }

        const nextIO = {
            ecs: data.ioStat.ecs,
            fin: data.ioStat.fin,
            sol_op: data.ioStat.sol_op,
            cl: data.ioStat.cl,
            dcl: data.ioStat.dcl,
            alm_in: data.ioStat.alm_in,
            alm_out: data.ioStat.alm_out,
            home: data.ioStat.home,
            pot: data.ioStat.pot,
            not: data.ioStat.not
        };

        setIoStatus(currentIO => {
            if (
                currentIO.ecs === nextIO.ecs &&
                currentIO.fin === nextIO.fin &&
                currentIO.sol_op === nextIO.sol_op &&
                currentIO.cl === nextIO.cl &&
                currentIO.dcl === nextIO.dcl &&
                currentIO.alm_in === nextIO.alm_in &&
                currentIO.alm_out === nextIO.alm_out &&
                currentIO.home === nextIO.home &&
                currentIO.pot === nextIO.pot &&
                currentIO.not === nextIO.not
            ) {
                return currentIO;
            }

            return nextIO;
        });
    }, []);

    const handleDriveError = useCallback(data => {
        if (
            !data ||
            data.code === undefined
        ) {
            return;
        }

        const nextCode = String(data.code);

        setDriveError(current => {
            if (current === nextCode) {
                return current;
            }

            return nextCode;
        });
    }, []);

    const handleAlarmState = useCallback(data => {
        if (!data) {
            return;
        }
    
        if (data.alarm !== undefined) {
            handleAlarm(data.alarm);
        }
    
        if (data.code !== undefined) {
            handleDriveError({ code: data.code });
        }
    }, [
        handleAlarm,
        handleDriveError
    ]);

    const handleSend = useCallback((ev, req) => {
        socket.emit(ev, req);
    }, [socket]);

    const handleEnableEmergency = useCallback(() => {
        dispatch(setEmergency(false, resetRef.current, zerorefRef.current));
    }, [dispatch]);

    const handleEnableReset = useCallback(() => {
        dispatch(setEmergency(false, false, false));
    }, [dispatch]);

    const handleEnableZeroref = useCallback(() => {
        dispatch(setEmergency(emergencyRef.current, resetRef.current, false));
    }, [dispatch]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setError(false);
                setStatus(false);
            };
        }, [])
    );

    /*
     * Heavy DISPLAY listeners are active only for the currently visible
     * screen. Hidden Manual/Auto/Program/Settings screens no longer consume
     * continuous I/O/alarm/drive-error packets.
     *
     * driver_status was removed here because ethercatA was never rendered.
     */
    useFocusEffect(
        useCallback(() => {
            socket.on("alarm_error", handleAlarm);
            socket.on("alarm_state", handleAlarmState);
            socket.on("io_status", handleIO);
            socket.on("drive_error_code", handleDriveError);
    
            socket.emit("get_current_alarm");
    
            return () => {
                socket.off("alarm_error", handleAlarm);
                socket.off("alarm_state", handleAlarmState);
                socket.off("io_status", handleIO);
                socket.off("drive_error_code", handleDriveError);
            };
        }, [
            socket,
            handleAlarm,
            handleAlarmState,
            handleIO,
            handleDriveError
        ])
    );

    /*
     * Keep rare command-completion events mounted as before so safety/UI
     * synchronization is not dependent on a position/display optimization.
     */
    useEffect(() => {
        socket.on("gotozero_done", handleEnableZeroref);
        socket.on("emergency_done", handleEnableEmergency);
        socket.on("reset_done", handleEnableReset);

        return () => {
            socket.off("gotozero_done", handleEnableZeroref);
            socket.off("emergency_done", handleEnableEmergency);
            socket.off("reset_done", handleEnableReset);
        };
    }, [
        socket,
        handleEnableZeroref,
        handleEnableEmergency,
        handleEnableReset
    ]);

    return (
        <>
            <LinearGradient
                colors={['#2d2c2d', '#000']}
                style={styles.statsWrap}
            >
                <View style={styles.stats1}>
                    {location == 'MANUAL' && <Image source={require('../img/home/manual.png')} style={styles.icnStatMain} />}
                    {location == 'PROGRAM' && <Image source={require('../img/home/program.png')} style={styles.icnStatMain} />}
                    {location == 'AUTO' && <Image source={require('../img/home/auto.png')} style={styles.icnStatMain} />}
                    {location == 'SETTINGS' && <Image source={require('../img/home/settings.png')} style={styles.icnStatMain} />}

                    <Text style={[styles.title1, styles.mt5]}>
                        {location}
                    </Text>
                </View>

                <View style={styles.stats2}>
                    <View style={styles.statsMetricColumn}>
                        <View style={styles.statsMetricValueSlot}>
                            <View style={styles.statsAxisValueBox}>
                                <Text style={styles.statsAxisValueText}>
                                    B
                                </Text>
                            </View>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={styles.statsMetricLabel}
                        >
                            AXIS
                        </Text>
                    </View>
                </View>

                <LivePositionMetrics />

                <View style={styles.statsDrive}>
                    <View style={styles.statsMetricColumn}>
                        <View style={styles.statsMetricValueSlot}>
                            <View style={styles.statsDriveValueBox}>
                                <Text style={styles.statsDriveValueText}>
                                    {driveError}
                                </Text>
                            </View>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={styles.statsMetricLabel}
                        >
                            DRIVE ERROR
                        </Text>
                    </View>
                </View>

                <View style={styles.stats4}>
                    <TouchableOpacity
                        onPress={() => {
                            if (status) {
                                setStatus(false);
                            }
                            setError(!error);
                        }}
                        style={styles.statsStatusColumn}
                    >
                        <View style={styles.statsMetricValueSlot}>
                            <View style={fault ? styles.statusRed : styles.statusGreen} />
                        </View>

                        <Text
                            numberOfLines={1}
                            style={styles.statsMetricLabel}
                        >
                            FAULT
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (error) {
                                setError(false);
                            }
                            setStatus(!status);
                        }}
                        style={styles.statsStatusColumn}
                    >
                        <View style={styles.statsMetricValueSlot}>
                            <View style={styles.statusGreen} />
                        </View>

                        <Text
                            numberOfLines={1}
                            style={styles.statsMetricLabel}
                        >
                            I/O
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.stats5}>
                    <TouchableOpacity
                        style={[
                            styles.mb5,
                            {
                                opacity:
                                    emergency || reset
                                        ? 0.5
                                        : 1
                            }
                        ]}
                        disabled={emergency || reset}
                        onPress={() => {
                            handleSend(
                                'emergency',
                                {
                                    "action":
                                        action == 0
                                            ? 1
                                            : 0
                                }
                            );

                            setAction(
                                action == 0
                                    ? 1
                                    : 0
                            );

                            dispatch(
                                setEmergency(
                                    true,
                                    false,
                                    true
                                )
                            );
                        }}
                    >
                        <LinearGradient
                            colors={[
                                COLORS.red1,
                                COLORS.red2
                            ]}
                            style={styles.btnStat}
                        >
                            <Ionicons
                                name="warning"
                                size={20}
                                color="#fffa"
                                style={styles.mr10}
                            />

                            <Text style={styles.btnTxtRed}>
                                EMERGENCY
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            opacity:
                                reset
                                    ? 0.5
                                    : 1
                        }}
                        disabled={reset}
                        onPress={() => {
                            handleSend(
                                'reset',
                                {
                                    "status": "clear"
                                }
                            );

                            dispatch(
                                setEmergency(
                                    true,
                                    true,
                                    true
                                )
                            );
                        }}
                    >
                        <LinearGradient
                            colors={[
                                COLORS.blue1,
                                COLORS.blue2
                            ]}
                            style={styles.btnStat}
                        >
                            <Ionicons
                                name="ios-sync-outline"
                                size={20}
                                color="#fffa"
                                style={styles.mr10}
                            />

                            <Text style={styles.btnTxtRed}>
                                RESET
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {status &&
                <Animatable.View style={styles.modalWrap} animation="slideInUp" duration={300}>
                    <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.w100p}>
                        <View style={styles.modalInner}>
                            <View style={styles.modalHeader}>
                                <View style={styles.row0Start}>
                                    <Text style={styles.body1}>I/O STATUS</Text>
                                </View>
                                <TouchableOpacity style={[styles.pl20, styles.py15]} onPress={() => { setStatus(false); }}>
                                    <Ionicons name="ios-close" size={20} color="#fffa" style={styles.mr10} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <View style={styles.rowBetween}>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>ECS</Text>
                                        <View style={ioStatus.ecs === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>FIN</Text>
                                        <View style={ioStatus.fin === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>SOL O/P</Text>
                                        <View style={ioStatus.sol_op === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>CL</Text>
                                        <View style={ioStatus.cl === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>DCL</Text>
                                        <View style={ioStatus.dcl === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>ALM-IN</Text>
                                        <View style={ioStatus.alm_in === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>ALM-OUT</Text>
                                        <View style={ioStatus.alm_out === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>HOME</Text>
                                        <View style={ioStatus.home === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>POT</Text>
                                        <View style={ioStatus.pot === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                    <View style={styles.itemsCenter}>
                                        <Text style={[styles.body1, styles.mb20]}>NOT</Text>
                                        <View style={ioStatus.not === true ? styles.statusGreen : styles.statusNone} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animatable.View>}

            {error &&
                <Animatable.View style={styles.modalWrap} animation="slideInUp" duration={300}>
                    <LinearGradient colors={[COLORS.modal1, COLORS.modal2]} style={styles.w100p}>
                        <View style={styles.modalInner}>
                            <View style={styles.modalHeader}>
                                <View style={styles.row0Start}>
                                    <Ionicons name="notifications-outline" size={20} color="#fffa" style={styles.mr10} />
                                    <Text style={styles.body1}>ALARM STATUS</Text>
                                </View>
                                <TouchableOpacity style={[styles.pl20, styles.py15]} onPress={() => { setError(false); }}>
                                    <Ionicons name="ios-close" size={20} color="#fffa" style={styles.mr10} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <View style={styles.rowBetween}>
                                    <Text style={[styles.body1, styles.mr20]}>
                                        ALARMS/ ERRORS
                                    </Text>
                                    <View style={styles.alarmBg}>
                                        <Text style={styles.body3}>
                                            {msg}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animatable.View>}
        </>
    );
};

export default React.memo(Stats);
