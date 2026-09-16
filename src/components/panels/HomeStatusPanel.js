import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { SocketContext } from '../../helpers/SocketContext';


const HomeStatusPanel = () => {

  const socket =
    useContext(
      SocketContext
    );


  /*
   * =====================================================
   * DISPLAY-ONLY HOME STATUS STATE
   * =====================================================
   *
   * This component only listens to existing socket events.
   * It does not send any machine command.
   */
  const [
    actualPosition,
    setActualPosition
  ] =
    useState(
      ''
    );


  const [
    destination,
    setDestination
  ] =
    useState(
      ''
    );


  const [
    driveError,
    setDriveError
  ] =
    useState(
      '0'
    );


  const [
    fault,
    setFault
  ] =
    useState(
      false
    );


  const [
    ioStatus,
    setIoStatus
  ] =
    useState({
      ecs:
        false,

      fin:
        false,

      sol_op:
        false,

      cl:
        false,

      dcl:
        false,

      pot:
        false,

      not:
        false
    });


  const formatPosition =
    useCallback(
      (
        value
      ) => {

        /*
         * No valid backend position data = blank display.
         *
         * Never use 0.000 as a fallback because 0.000 is
         * a genuine machine position and can mislead the operator.
         */
        if (
          value === undefined ||
          value === null ||
          value === ''
        ) {

          return '';
        }


        const numberValue =
          Number(
            value
          );


        if (
          Number.isNaN(
            numberValue
          )
        ) {

          return '';
        }


        return numberValue.toFixed(
          3
        );
      },
      []
    );


  const handlePosition =
    useCallback(
      (
        data
      ) => {

        if (
          data &&
          data.data !==
            undefined
        ) {

          setDestination(
            formatPosition(
              data.data
            )
          );
        }
      },
      [
        formatPosition
      ]
    );


  const handleDestination =
    useCallback(
      (
        data
      ) => {

        if (
          data &&
          data.pos !==
            undefined
        ) {

          setActualPosition(
            formatPosition(
              data.pos
            )
          );
        }
      },
      [
        formatPosition
      ]
    );


  const handleDriveError =
    useCallback(
      (
        data
      ) => {

        if (
          data &&
          data.code !==
            undefined
        ) {

          setDriveError(
            String(
              data.code
            )
          );
        }
      },
      []
    );


  const handleAlarm =
    useCallback(
      (
        data
      ) => {

        if (
          data ===
          'No Alarms'
        ) {

          setFault(
            false
          );

          setDriveError(
            '0'
          );

          return;
        }


        setFault(
          true
        );


        if (
          typeof data ===
          'string'
        ) {

          const match =
            data.match(
              /\d+/
            );


          if (
            match &&
            match[0]
          ) {

            setDriveError(
              match[0]
            );
          }
        }
      },
      []
    );


  const handleIO =
    useCallback(
      (
        data
      ) => {

        if (
          !data ||
          !data.ioStat
        ) {

          return;
        }


        const nextIO = {
          ecs:
            !!data.ioStat.ecs,

          fin:
            !!data.ioStat.fin,

          sol_op:
            !!data.ioStat.sol_op,

          cl:
            !!data.ioStat.cl,

          dcl:
            !!data.ioStat.dcl,

          pot:
            !!data.ioStat.pot,

          not:
            !!data.ioStat.not
        };


        setIoStatus(
          currentIO => {

            if (
              currentIO.ecs === nextIO.ecs &&
              currentIO.fin === nextIO.fin &&
              currentIO.sol_op === nextIO.sol_op &&
              currentIO.cl === nextIO.cl &&
              currentIO.dcl === nextIO.dcl &&
              currentIO.pot === nextIO.pot &&
              currentIO.not === nextIO.not
            ) {

              return currentIO;
            }


            return nextIO;
          }
        );
      },
      []
    );


  useEffect(
    () => {

      socket.on(
        'pos_data',
        handlePosition
      );


      socket.on(
        'destination_position',
        handleDestination
      );


      socket.on(
        'drive_error_code',
        handleDriveError
      );


      socket.on(
        'alarm_error',
        handleAlarm
      );


      socket.on(
        'io_status',
        handleIO
      );


      return () => {

        socket.off(
          'pos_data',
          handlePosition
        );


        socket.off(
          'destination_position',
          handleDestination
        );


        socket.off(
          'drive_error_code',
          handleDriveError
        );


        socket.off(
          'alarm_error',
          handleAlarm
        );


        socket.off(
          'io_status',
          handleIO
        );
      };
    },
    [
      socket,
      handlePosition,
      handleDestination,
      handleDriveError,
      handleAlarm,
      handleIO
    ]
  );


  const ioItems = [

    {
      label:
        'ECS',

      active:
        ioStatus.ecs
    },

    {
      label:
        'FIN',

      active:
        ioStatus.fin
    },

    {
      label:
        'SOL O/P',

      active:
        ioStatus.sol_op
    },

    {
      label:
        'CL',

      active:
        ioStatus.cl
    },

    {
      label:
        'DCL',

      active:
        ioStatus.dcl
    },

    {
      label:
        'POT',

      active:
        ioStatus.pot
    },

    {
      label:
        'NOT',

      active:
        ioStatus.not
    },

    {
      label:
        'FAULT',

      active:
        fault,

      isFault:
        true
    }
  ];


  return (

    <View
      style={
        localStyles.wrapper
      }
    >

      {/*
       * SENIOR-REQUESTED HOME LAYOUT
       */}
      <View style={localStyles.topStatusRow}>

        <LinearGradient
          colors={['#34393D', '#24292D', '#0D0F11']}
          locations={[0, 0.52, 1]}
          style={localStyles.positionCard}
        >
          <Text style={localStyles.label}>ACTUAL POSITION</Text>
          <View style={localStyles.divider} />
          <Text numberOfLines={1} style={localStyles.positionValue}>
            {actualPosition}
          </Text>
          {actualPosition !== '' && (
            <Text style={localStyles.unit}>DEG</Text>
          )}
        </LinearGradient>

        <LinearGradient
          colors={['#34393D', '#24292D', '#0D0F11']}
          locations={[0, 0.52, 1]}
          style={localStyles.positionCard}
        >
          <Text style={localStyles.label}>DESTINATION</Text>
          <View style={localStyles.divider} />
          <Text numberOfLines={1} style={localStyles.positionValue}>
            {destination}
          </Text>
          {destination !== '' && (
            <Text style={localStyles.unit}>DEG</Text>
          )}
        </LinearGradient>

        <View style={localStyles.rightStatusStack}>
          <LinearGradient
            colors={['#34393D', '#24292D', '#0D0F11']}
            locations={[0, 0.52, 1]}
            style={localStyles.axisCardRight}
          >
            <Text style={localStyles.label}>AXIS</Text>
            <Text style={localStyles.axisValue}>B</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#34393D', '#24292D', '#0D0F11']}
            locations={[0, 0.52, 1]}
            style={localStyles.driveCardRight}
          >
            <Text style={localStyles.label}>DRIVE ERROR</Text>
            <Text style={localStyles.driveValue}>{driveError}</Text>
          </LinearGradient>
        </View>

      </View>


      {/*
       * I/O STATUS
       *
       * Only:
       * ECS, FIN, SOL O/P, CL, DCL, POT, NOT, FAULT
       *
       * ALM-IN / ALM-OUT / HOME intentionally omitted.
       */}
      <LinearGradient
        colors={[
          '#303539',
          '#202428',
          '#0C0E10'
        ]}
        locations={[
          0,
          0.55,
          1
        ]}
        style={
          localStyles.ioPanel
        }
      >

        <Text
          style={
            localStyles.ioTitle
          }
        >
          I/O STATUS
        </Text>


        <View
          style={
            localStyles.ioRow
          }
        >

          {
            ioItems.map(
              (
                item
              ) => (

                <LinearGradient
                  key={
                    item.label
                  }
                  colors={[
                    '#353A3E',
                    '#24282C',
                    '#101214'
                  ]}
                  locations={[
                    0,
                    0.55,
                    1
                  ]}
                  style={
                    localStyles.ioItem
                  }
                >

                  <Text
                    numberOfLines={1}
                    style={
                      localStyles.ioLabel
                    }
                  >
                    {item.label}
                  </Text>


                  <View
                    style={[
                      localStyles.lamp,

                      item.active
                        ? (
                            item.isFault
                              ? localStyles.lampFault
                              : localStyles.lampOn
                          )
                        : localStyles.lampOff
                    ]}
                  />

                </LinearGradient>

              )
            )
          }

        </View>

      </LinearGradient>

    </View>
  );
};


const localStyles =
  StyleSheet.create({

    /*
     * =====================================================
     * IMPORTANT:
     *
     * These are LOCAL styles.
     * Nothing is added to global styles.js.
     * =====================================================
     */

    wrapper: {

      position:
        'absolute',

      top:
        74,

      left:
        58,

      right:
        58,

      alignItems:
        'center'
    },


    /*
     * Normal industrial palette:
     * no glow
     * no shiny blue
     * no text shadows
     */
    topStatusRow: {
      width: '92%',
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'center',
      marginBottom: 12,
    },

    label: {
      color: '#FFFFFF',
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '700',
      fontFamily: 'Arimo-Bold',
      textAlign: 'center',
      textTransform: 'uppercase',
    },

    positionCard: {
      flex: 1,
      minWidth: 0,
      height: 184,
      borderColor: '#586168',
      borderWidth: 1,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 14,
      marginRight: 10,
    },

    divider: {
      width: '88%',
      height: 1,
      backgroundColor: '#697178',
      marginTop: 8,
      marginBottom: 8,
    },

    positionValue: {
      color: '#42B7E6',
      fontSize: 46,
      lineHeight: 52,
      fontWeight: '700',
      fontFamily: 'Arimo-Bold',
      textAlign: 'center',
      marginTop: 3,
    },

    unit: {
      color: '#AAB0B3',
      fontSize: 13,
      lineHeight: 16,
      fontWeight: '600',
      fontFamily: 'Arimo-SemiBold',
      textAlign: 'center',
      marginTop: 4,
    },

    rightStatusStack: {
      width: 184,
      height: 184,
      justifyContent: 'space-between',
      alignItems: 'stretch',
    },

    axisCardRight: {
      width: '100%',
      height: 86,
      borderColor: '#586168',
      borderWidth: 1,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },

    axisValue: {
      color: '#42B7E6',
      fontSize: 34,
      lineHeight: 38,
      fontWeight: '700',
      fontFamily: 'Arimo-Bold',
      textAlign: 'center',
      marginTop: 3,
    },

    driveCardRight: {
      width: '100%',
      height: 90,
      borderColor: '#586168',
      borderWidth: 1,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },

    driveValue: {
      color: '#42B7E6',
      fontSize: 28,
      lineHeight: 32,
      fontWeight: '700',
      fontFamily: 'Arimo-Bold',
      textAlign: 'center',
      marginTop: 3,
    },


    ioPanel: {

      width:
        '92%',

      borderColor:
        '#586168',

      borderWidth:
        1,

      borderRadius:
        6,

      paddingTop:
        10,

      paddingHorizontal:
        10,

      paddingBottom:
        12,

      marginTop:
        12
    },


    ioTitle: {

      color:
        '#FFFFFF',

      fontSize:
        16,

      lineHeight:
        20,

      fontWeight:
        '700',

      fontFamily:
        'Arimo-Bold',

      textAlign:
        'left',

      textTransform:
        'uppercase',

      marginBottom:
        9
    },


    ioRow: {

      width:
        '100%',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between'
    },


    ioItem: {

      flex:
        1,

      minWidth:
        0,

      height:
        66,

      marginHorizontal:
        3,

      borderColor:
        '#444C51',

      borderWidth:
        1,

      borderRadius:
        5,

      alignItems:
        'center',

      justifyContent:
        'center'
    },


    ioLabel: {

      color:
        '#FFFFFF',

      fontSize:
        13,

      lineHeight:
        16,

      fontWeight:
        '700',

      fontFamily:
        'Arimo-Bold',

      textAlign:
        'center',

      marginBottom:
        8
    },


    lamp: {

      width:
        17,

      height:
        17,

      borderRadius:
        8.5,

      borderWidth:
        2
    },


    lampOff: {

      backgroundColor:
        '#22272A',

      borderColor:
        '#090A0B'
    },


    lampOn: {

      backgroundColor:
        '#7FF500',

      borderColor:
        '#304A12'
    },


    lampFault: {

      backgroundColor:
        '#F24400',

      borderColor:
        '#5E2412'
    }

  });


export default HomeStatusPanel;
