'use strict'
import { StyleSheet, Dimensions, } from 'react-native';
const { width, height } = Dimensions.get('window');
//* ===MODIFIED CODE start === */
const inputStyle = {
  backgroundColor: '#1C1C1E',
  color: 'white',
  borderWidth: 1,
  borderColor: '#555',
  borderRadius: 5,
  paddingHorizontal: 15,
  paddingVertical: 10,
  textAlign: 'center',
  fontSize: 16,
  marginBottom: 10, // Adds space between the input and the button
};
//* ===MODIFIED CODE end=== */


const styles = StyleSheet.create({
    textArea: {
        width: "100%",
        //color: "#ffff",
        borderColor: "#ffff",
        borderWidth: 1,
        height: "100%",
        backgroundColor: "#ffff",
        padding: 10,
        marginTop: "1rem"
    },
    // Header
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0,
    },
    headerLeft: {
        paddingRight: 15,
    },
    headerCenter: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fffe',
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        marginLeft: 15,
    },
    headerRight: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 25,
    },
    gradientHeaderRight: {
        height: 32,
        width: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2f2f2f',
    },
    txtWsStatus: {
        color: '#fff8',
        fontSize: 13,
        // textTransform: 'uppercase',
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
        marginLeft: 10,
    },

    // Boxes
    imgBg: {
        flex: 1,
    },
    containerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    containerStretch: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    containerStart: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },


    // Home page

    logoHome: {
        height: height / 3.5,
        width: height / 3.5,
        marginBottom: height / 9,
        resizeMode: 'contain',
    },
    btnHome: {
        flex: 1,
        marginHorizontal: 8,
        elevation: 15,
        borderRadius: 8,
        borderColor: '#000a',
        borderWidth: 1,
    },
    gradientHome: {
        paddingVertical: height * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    btnTxtHome: {
        color: '#fffd',
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },
    icnHome: {
        height: height / 11,
        width: height / 11,
        resizeMode: 'contain',
        marginBottom: height / 32,
    },
    saveButton: {
        color: '#ffff',
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },

    // Stats
    /*
     * =========================================================
     * 7-INCH 1024 x 600 HMI HEADER
     * =========================================================
     *
     * All metric blocks use the same structure:
     *
     * VALUE / STATUS
     * HEADER
     *
     * statsMetricValueSlot has a FIXED height so AXIS,
     * ACTUAL POSITION, DESTINATION, DRIVE ERROR, FAULT and I/O
     * labels automatically sit on one exact baseline.
     */
    statsWrap: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        /*
         * Recommended for 1024 x 600.
         * Increase to 18/20 only if you want a taller band.
         */
        paddingVertical: 8,

        // minHeight: 118,
    },

    stats1: {
        flex: 2.2,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#fff1',
        borderRightWidth: 1,
    },

    icnStatMain: {
        /*
         * ~32 px on a 1024 px wide display.
         */
        height: width / 32,
        width: width / 32,
        resizeMode: 'contain',
        marginBottom: 5,
    },

    stats2: {
        flex: 1.55,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#fff1',
        borderRightWidth: 1,
    },

    stats3: {
        flex: 4.9,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderRightColor: '#fff1',
        borderRightWidth: 1,
    },

    statsDrive: {
        flex: 1.9,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#fff1',
        borderRightWidth: 1,
    },

    stats4: {
        flex: 1.9,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
        borderRightColor: '#fff1',
        borderRightWidth: 1,
    },

    stats5: {
        flex: 3.25,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },

    /*
     * Every normal metric uses this column.
     */
    statsMetricColumn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /*
     * CRITICAL ALIGNMENT VALUE.
     *
     * Every value/status occupies exactly 42 px vertically.
     * Therefore every heading starts at the same Y position.
     */
    statsMetricValueSlot: {
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /*
     * Common heading style for:
     * AXIS
     * ACTUAL POSITION
     * DESTINATION
     * DRIVE ERROR
     * FAULT
     * I/O
     *
     * 13 px is intentionally chosen for the real 1024 x 600 HMI.
     * It is readable while allowing ACTUAL POSITION to remain
     * on one line without crowding adjacent columns.
     */
    statsMetricLabel: {
        color: '#fffc',
        fontSize: 13,
        lineHeight: 15,
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: '#000',
        textShadowRadius: 1,
        marginTop: 7,
    },

    /*
     * AXIS B
     */
    statsAxisValueBox: {
        backgroundColor: '#16191a',
        minWidth: 42,
        height: 30,
        paddingHorizontal: 6,
        borderRadius: 4,
        elevation: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statsAxisValueText: {
        color: '#37c1f5',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },

    /*
     * ACTUAL POSITION / DESTINATION
     */
    statsPositionColumn: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },

    statsPositionValueBox: {
        backgroundColor: '#16191a',
        width: 110,
        maxWidth: '95%',
        height: 32,
        paddingHorizontal: 5,
        borderRadius: 5,
        elevation: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statsPositionValueText: {
        color: '#37c1f5',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },

    statsPositionDivider: {
        width: 1,
        height: 48,
        backgroundColor: '#888',
        marginHorizontal: 5,
    },

    /*
     * DRIVE ERROR
     */
    statsDriveValueBox: {
        backgroundColor: '#16191a',
        minWidth: 72,
        height: 32,
        paddingHorizontal: 8,
        borderRadius: 5,
        elevation: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statsDriveValueText: {
        color: '#37c1f5',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },

    /*
     * FAULT / I-O
     */
    statsStatusColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
    },

    statusGreen: {
        width: 18,
        height: 18,
        backgroundColor: '#7ff500',
        borderColor: '#000c',
        borderWidth: 4,
        borderRadius: 5,
    },

    statusRed: {
        width: 18,
        height: 18,
        backgroundColor: '#f24400',
        borderColor: '#000c',
        borderWidth: 4,
        borderRadius: 5,
    },

    statusNone: {
        width: 18,
        height: 18,
        borderRadius: 5,
        backgroundColor: '#16181A',
    },

    /*
     * Existing generic text boxes retained for screens that may
     * still use them elsewhere.
     */
    bgText0: {
        backgroundColor: '#16191a',
        paddingHorizontal: 5,
        elevation: 17,
    },

    bgText1: {
        backgroundColor: '#16191a',
        width: 120,
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
        elevation: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },

    txtStatsInactive: {
        color: '#fff4',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
        textAlign: 'center',
    },

    txtStatsActive: {
        color: '#37c1f5',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
        textAlign: 'center',
    },

    // Manual

    logoManual: {
        height: height / 3,
        width: height / 3,
        resizeMode: 'contain',
    },
    icnSm: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
    manualMain: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    // Keypad

    keypadWrap: {
        backgroundColor: '#b4b9bd',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderColor: '#000a',
        borderWidth: 1,
        elevation: 3,
        marginVertical: 10,
        // [{backgroundColor: '#b4b9bd', borderRadius: 10,}, styles.py10, styles.px5]
    },
    editorWrap: {
        borderColor: '#0003',
        borderWidth: 1,
        backgroundColor: '#fff1',
        flex: 1,
    },
    well: {
        backgroundColor: '#0005',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
    },

    // Settings

    btnSettings: {
        width: '40%',
        marginHorizontal: 10,
        elevation: 15,
        borderRadius: 8,
        borderColor: '#000a',
        borderWidth: 1,
    },
    btnTxtSettings: {
        color: '#fffb',
        fontSize: 14,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },
    gradientSettings: {
        height: 180,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },





    // Rows
    row0Center: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowCenter: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowCols: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    row0Between: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowBetween: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowBetweenTop: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    rowFStart: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    row0Start: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    row0End: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    cols: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingBottom: 30,
    },



    // Buttons

    btn: {
        height: 50,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        // borderColor: '#0005',
        // borderWidth: 7,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    btnStat: {
        height: 45,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        // borderColor: '#0005',
        // borderWidth: 7,
        marginBottom: 4,
        display: 'flex',
        flexDirection: 'row',
    },
    btn0: {
        height: 45,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
    },
    btnFull: {
        height: 45,
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
    },
    btnTxtRed: {
        color: '#fffc',
        fontSize: 13,
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: '#000',
        // textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 1
    },
    btnKey: {
        // backgroundColor: '#343536',
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
        height: 48,
    },
    gradKey: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },


    // Typography
    title1: {
        color: '#fffc',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
        // textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: '#000',
        // textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 1
    },
    titleStat1: {
        color: '#fffc',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
        // textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: '#000',
        // textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 1
    },
    subtitle1: {
        color: '#fffc',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        textAlign: 'center',
    },
    subtitle2: {
        color: '#fffa',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        textAlign: 'center',
    },
    subtitleLeft1: {
        color: '#fffc',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
    },
    body1: {
        color: '#fff7',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
    },
    muted1: {
        color: '#fff3',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
    },
    body2: {
        color: '#fff9',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Arimo-SemiBold',
    },
    body3: {
        color: '#fff9',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        lineHeight: 20,
    },
    code1: {
        color: '#fffc',
        fontSize: 17,
        fontWeight: '600',
        fontFamily: 'Arimo-Semibold',
        lineHeight: 20,
    },
    codeLine1: {
        color: '#fff6',
        fontSize: 17,
        fontWeight: '600',
        fontFamily: 'Arimo-Semibold',
        lineHeight: 20,
    },
    textLeft: {
        textAlign: 'left'
    },
    textCenter: {
        textAlign: 'center'
    },
    textRight: {
        textAlign: 'right'
    },
    settingVal: {
        color: '#fffc',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        textAlign: 'center',
        backgroundColor: '#0006',
        paddingVertical: 3,
        width: '40%',
        marginLeft: '30%',
        marginTop: 10,
    },
    settingVal2: {
        color: '#fffc',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        textAlign: 'center',
        backgroundColor: '#0006',
        paddingVertical: 3,
        paddingLeft: 20,
        paddingRight: 40,
        borderRadius: 5,
    },
    settingVal3: {
        color: '#fffc',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        textAlign: 'center',
        backgroundColor: '#0006',
        paddingVertical: 3,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    setting2Val: {
        color: '#fffc',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
        textAlign: 'center',
        // backgroundColor: '#0006',
        paddingVertical: 3,
        width: '40%',
        marginLeft: '30%',
        marginTop: 10,
    },


    // Margins 

    mb5: {
        marginBottom: 5,
    },
    mb10: {
        marginBottom: 10,
    },
    mb15: {
        marginBottom: 15,
    },
    mb20: {
        marginBottom: 20,
    },
    mb25: {
        marginBottom: 25,
    },
    mb30: {
        marginBottom: 30,
    },
    mb40: {
        marginBottom: 40,
    },
    mb50: {
        marginBottom: 50,
    },
    mb60: {
        marginBottom: 60,
    },
    mb100: {
        marginBottom: 100,
    },

    mt5: {
        marginTop: 5,
    },
    mt10: {
        marginTop: 10,
    },
    mt15: {
        marginTop: 15,
    },
    mt20: {
        marginTop: 20,
    },
    mt25: {
        marginTop: 25,
    },
    mt30: {
        marginTop: 30,
    },
    mt40: {
        marginTop: 40,
    },
    mt50: {
        marginTop: 50,
    },
    mt60: {
        marginTop: 60,
    },
    mt100: {
        marginTop: 100,
    },

    ml5: {
        marginLeft: 5,
    },
    ml10: {
        marginLeft: 10,
    },
    ml15: {
        marginLeft: 15,
    },
    ml20: {
        marginLeft: 20,
    },
    ml25: {
        marginLeft: 25,
    },
    ml30: {
        marginLeft: 30,
    },
    ml40: {
        marginLeft: 40,
    },
    ml50: {
        marginLeft: 50,
    },
    ml60: {
        marginLeft: 60,
    },
    ml100: {
        marginLeft: 100,
    },

    mr5: {
        marginRight: 5,
    },
    mr10: {
        marginRight: 10,
    },
    mr15: {
        marginRight: 15,
    },
    mr20: {
        marginRight: 20,
    },
    mr25: {
        marginRight: 25,
    },
    mr30: {
        marginRight: 30,
    },
    mr40: {
        marginRight: 40,
    },
    mr50: {
        marginRight: 50,
    },
    mr60: {
        marginRight: 60,
    },
    mr100: {
        marginRight: 100,
    },

    mx5: {
        marginHorizontal: 5,
    },
    mx10: {
        marginHorizontal: 10,
    },
    mx15: {
        marginHorizontal: 15,
    },
    mx20: {
        marginHorizontal: 20,
    },
    mx25: {
        marginHorizontal: 25,
    },
    mx30: {
        marginHorizontal: 30,
    },
    mx40: {
        marginHorizontal: 40,
    },
    mx50: {
        marginHorizontal: 50,
    },
    mx60: {
        marginHorizontal: 60,
    },
    mx100: {
        marginHorizontal: 100,
    },

    my5: {
        marginVertical: 5,
    },
    my10: {
        marginVertical: 10,
    },
    my15: {
        marginVertical: 15,
    },
    my20: {
        marginVertical: 20,
    },
    my25: {
        marginVertical: 25,
    },
    my30: {
        marginVertical: 30,
    },
    my40: {
        marginVertical: 40,
    },
    my50: {
        marginVertical: 50,
    },
    my60: {
        marginVertical: 60,
    },
    my100: {
        marginVertical: 100,
    },

    m5: {
        margin: 5,
    },
    m10: {
        margin: 10,
    },
    m15: {
        margin: 15,
    },
    m20: {
        margin: 20,
    },
    m25: {
        margin: 25,
    },
    m30: {
        margin: 30,
    },
    m40: {
        margin: 40,
    },
    m50: {
        margin: 50,
    },
    m60: {
        margin: 60,
    },
    m100: {
        margin: 100,
    },

    // Paddings

    pb5: {
        paddingBottom: 5,
    },
    pb10: {
        paddingBottom: 10,
    },
    pb15: {
        paddingBottom: 15,
    },
    pb20: {
        paddingBottom: 20,
    },
    pb25: {
        paddingBottom: 25,
    },
    pb30: {
        paddingBottom: 30,
    },
    pb40: {
        paddingBottom: 40,
    },
    pb50: {
        paddingBottom: 50,
    },
    pb60: {
        paddingBottom: 60,
    },
    pb100: {
        paddingBottom: 100,
    },

    pt5: {
        paddingTop: 5,
    },
    pt10: {
        paddingTop: 10,
    },
    pt15: {
        paddingTop: 15,
    },
    pt20: {
        paddingTop: 20,
    },
    pt25: {
        paddingTop: 25,
    },
    pt30: {
        paddingTop: 30,
    },
    pt40: {
        paddingTop: 40,
    },
    pt50: {
        paddingTop: 50,
    },
    pt60: {
        paddingTop: 60,
    },
    pt70: {
        paddingTop: 70,
    },
    pt80: {
        paddingTop: 80,
    },
    pt100: {
        paddingTop: 100,
    },

    pl5: {
        paddingLeft: 5,
    },
    pl10: {
        paddingLeft: 10,
    },
    pl15: {
        paddingLeft: 15,
    },
    pl20: {
        paddingLeft: 20,
    },
    pl25: {
        paddingLeft: 25,
    },
    pl30: {
        paddingLeft: 30,
    },
    pl40: {
        paddingLeft: 40,
    },
    pl50: {
        paddingLeft: 50,
    },
    pl60: {
        paddingLeft: 60,
    },
    pl100: {
        paddingLeft: 100,
    },

    pr5: {
        paddingRight: 5,
    },
    pr10: {
        paddingRight: 10,
    },
    pr15: {
        paddingRight: 15,
    },
    pr20: {
        paddingRight: 20,
    },
    pr25: {
        paddingRight: 25,
    },
    pr30: {
        paddingRight: 30,
    },
    pr40: {
        paddingRight: 40,
    },
    pr50: {
        paddingRight: 50,
    },
    pr60: {
        paddingRight: 60,
    },
    pr100: {
        paddingRight: 100,
    },

    px5: {
        paddingHorizontal: 5,
    },
    px10: {
        paddingHorizontal: 10,
    },
    px15: {
        paddingHorizontal: 15,
    },
    px20: {
        paddingHorizontal: 20,
    },
    px25: {
        paddingHorizontal: 25,
    },
    px30: {
        paddingHorizontal: 30,
    },
    px40: {
        paddingHorizontal: 40,
    },
    px50: {
        paddingHorizontal: 50,
    },
    px60: {
        paddingHorizontal: 60,
    },
    px100: {
        paddingHorizontal: 100,
    },

    py5: {
        paddingVertical: 5,
    },
    py10: {
        paddingVertical: 10,
    },
    py15: {
        paddingVertical: 15,
    },
    py20: {
        paddingVertical: 20,
    },
    py25: {
        paddingVertical: 25,
    },
    py30: {
        paddingVertical: 30,
    },
    py40: {
        paddingVertical: 40,
    },
    py50: {
        paddingVertical: 50,
    },
    py60: {
        paddingVertical: 60,
    },
    py100: {
        paddingVertical: 100,
    },

    p5: {
        padding: 5,
    },
    p10: {
        padding: 10,
    },
    p15: {
        padding: 15,
    },
    p20: {
        padding: 20,
    },
    p25: {
        padding: 25,
    },
    p30: {
        padding: 30,
    },
    p40: {
        padding: 40,
    },
    p50: {
        padding: 50,
    },
    p60: {
        padding: 60,
    },
    p100: {
        padding: 100,
    },


    // Flex

    dFlex: {
        display: 'flex',
    },

    flexRow: {
        flexDirection: 'row',
    },
    flexCol: {
        flexDirection: 'column',
    },

    justifyCenter: {
        justifyContent: 'center',
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    justifyStart: {
        justifyContent: 'flex-start',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },

    itemsCenter: {
        alignItems: 'center',
    },
    itemsStart: {
        alignItems: 'flex-start',
    },
    itemsEnd: {
        alignItems: 'flex-end',
    },
    itemsStretch: {
        alignItems: 'stretch',
    },

    selfCenter: {
        alignSelf: 'center',
    },
    selfStart: {
        alignSelf: 'flex-start',
    },
    selfEnd: {
        alignSelf: 'flex-end',
    },

    flex1: {
        flex: 1,
    },

    flex2: {
        flex: 2,
    },

    flex3: {
        flex: 3,
    },

    flex4: {
        flex: 4,
    },

    flex5: {
        flex: 5,
    },

    flex6: {
        flex: 6,
    },

    flex7: {
        flex: 7,
    },

    flex8: {
        flex: 8,
    },

    flex9: {
        flex: 9,
    },

    flex10: {
        flex: 10,
    },


    // Width

    w25p: {
        width: '25%',
    },
    w50p: {
        width: '50%',
    },
    w75p: {
        width: '75%',
    },
    w100p: {
        width: '100%',
    },


    // Borders (Debug)

    border1: {
        borderColor: 'red',
        borderWidth: 1,
    },
    border2: {
        borderColor: 'blue',
        borderWidth: 1,
    },
    border3: {
        borderColor: '#fff1',
        borderWidth: 1,
    },


    // Heights

    h5: {
        height: 5,
    },
    h10: {
        height: 10,
    },
    h15: {
        height: 15,
    },
    h20: {
        height: 20,
    },
    h25: {
        height: 25,
    },
    h30: {
        height: 30,
    },
    h40: {
        height: 40,
    },
    h50: {
        height: 50,
    },
    h60: {
        height: 60,
    },
    h80: {
        height: 80,
    },
    h100: {
        height: 100,
    },
    h40p: {
        height: '40%',
    },


    // Inputs

    input1: {
        borderColor: '#0008',
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 15,
        paddingVertical: 5,
        color: '#fffa',
        backgroundColor: '#fff1',
    },
    input2: {
        borderColor: '#0008',
        borderWidth: 1,
        height: 45,
        paddingHorizontal: 15,
        paddingVertical: 5,
        color: '#fffa',
        backgroundColor: '#0005',
    },
    notepadInput: {
        borderColor: '#ffff',
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 15,
        paddingVertical: 5,
        //color: '#fffa',
        backgroundColor: '#ffff',
        width: "100%"
    },

    // Widget
    widgetTitleWrap: {
        backgroundColor: '#131313',
    },


    // Table
    oddRow: {
        backgroundColor: '#ffffff07',
    },
    evenRow: {
        backgroundColor: '#00000007',
    },
    codeRow: {
        height: 45,
    },


    // Borders
    bR1: {
        borderRightColor: '#fff1',
        borderRightWidth: 1,
    },


    // Settings

    icnSetting: {
        height: height / 10,
        width: height / 10,
        resizeMode: 'contain',
        marginBottom: 12,
    },

    loadingWrap: {
        paddingVertical: 60,
        backgroundColor: '#ffffff07',
    },

    emptyWrap: {
        paddingVertical: 30,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff07',
    },
    emptyTxt: {
        color: '#fff5',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Arimo-Medium',
    },
    settingBlock: {
        flex: 1,
        borderColor: '#fff2',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    settingsCol: {
        flex: 1,
        borderColor: '#fff3',
        borderWidth: 1,
        marginHorizontal: 2,
    },
    headers: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 2,
    },
    headerGroup: {
        display: 'flex',
        flexDirection: 'row',
    },
    headerCol: {
        flex: 1,
        backgroundColor: '#545454',
        paddingVertical: 10,
        display: 'flex',
        justifyContent: 'center',
        borderColor: '#0003',
        borderWidth: 1,
    },
    dataGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        flex: 1,
    },
    dataCol: {
        flex: 1,
        backgroundColor: '#fff1',
        paddingVertical: 10,
        borderColor: '#0003',
        borderWidth: 1,
    },
    data2Col: {
        flex: 1,
        backgroundColor: '#fff1',
        marginTop: 10,
        marginHorizontal: 10,
        borderColor: '#0003',
        borderWidth: 1,
    },
    data3Col: {
        flex: 1,
        backgroundColor: '#fff1',
        borderColor: '#0004',
        borderWidth: 1,
        margin: 1,
        borderRadius: 5,
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // overflow: 'hidden',
    },
    data4Col: {
        flex: 1,
        // backgroundColor: '#fff1',
        borderColor: '#0002',
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // overflow: 'hidden',
    },
    helpBlock: {
        flex: 1,
        borderColor: '#fff2',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 30,
    },

    dirIcon: {
        width: 100,
        height: '50vh',
    },
    manualLeft: {
        marginBottom: 60,
        justifyContent: 'center',
        marginRight: 50,
        borderRadius: 20,
        // height: '100%',
    },
    manualRight: {
        marginBottom: 60,
        justifyContent: 'center',
        marginLeft: 50,
        borderRadius: 20,
        // height: '100%',
    },
    manualInner: {
        borderColor: '#0006',
        borderWidth: 1,
        paddingHorizontal: 20,
        // justifyContent: 'center',
        borderRadius: 20,
        height: '100%',
        justifyContent: 'center',
    },

    drawerItem: {
        flex: 1,
        borderBottomColor: '#0005',
        borderBottomWidth: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icnDrawer: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    drawerLabel: {
        color: '#fff4',
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },
    drawerActiveLabel: {
        color: '#fffa',
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontFamily: 'Arimo-Bold',
        textAlign: 'center',
    },
    gradDrawerItem: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg1: {
        backgroundColor: '#fff1',
    },
    faqQn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomColor: '#fff2',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqAns: {
        paddingTop: 12,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },

    modalWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 0,
    },
    modalInner: {
        width: '100%',
        alignItems: 'center',
    },
    modalHeader: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingVertical: 15,
        paddingLeft: 30,
        paddingRight: 20,
        borderBottomColor: '#fff2',
        borderBottomWidth: 1,
    },
    modalBody: {
        width: '100%',
        paddingHorizontal: 60,
        paddingVertical: 30,
    },
    alarmBg: {
        backgroundColor: '#17181A',
        flex: 1,
        padding: 20,
    },

    toastWrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 99,
        backgroundColor: '#000b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toastInner: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

    overlayWrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 99,
        backgroundColor: '#000e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayInner: {
        // paddingHorizontal: 30,
        // paddingVertical: 20,
        borderRadius: 10,
        // alignItems: 'center',
        width: '90%',
    },
    dropdown: {
        top: 60,
        position: "absolute",
        right: "100px",
        backgroundColor: "#0b0b0b",
        padding: 10,
        width: "10%",
        borderRadius: 6,
        zIndex: 99
    },
    dropdownhot: {
        top: 60,
        position: "absolute",
        right: "150px",
        backgroundColor: "#0b0b0b",
        padding: 10,
        width: "10%",
        borderRadius: 6,
        zIndex: 99
    },
    dropdownElement: {
        marginTop: 10,
        marginBottom: 10
    },
    WifiSettings: {
        top: 0,
        position: "absolute",
        right: 0,
        left: 0,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#3d3d3d",
        padding: 20,
        width: "90%",
        borderRadius: 6,
        zIndex: 99,
        height: "100%"
    },
    button: {
        borderWidth: 1,
        backgroundColor: "#ffff",
        color: "black",
        padding: 10,
        borderRadius: 5
    },
    inputWifi: {
        borderColor: '#0008',
        borderWidth: 1,
        height: 35,
        paddingHorizontal: 15,
        paddingVertical: 3,
        color: 'black',
        backgroundColor: '#ffff',
        width: "100%"
    },
    inputHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },

    //* ===MODIFIED CODE start === */
    inputContainer: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 10,
        alignItems: 'center',
},
    inputText: {
        color: 'white',
        fontSize: 16,
    },
    placeholderText: {
        color: '#888',
        fontSize: 16,
    },
    //* ===MODIFIED CODE end === */
    loading: {
        top: "30%",
        position: "absolute",
        right: 0,
        left: 0,
        marginLeft: "auto",
        marginRight: "auto",
        //backgroundColor: "#3d3d3d",
        padding: 20,
        width: "40%",
        borderRadius: 6,
        zIndex: 99
    }

});




export default styles;
