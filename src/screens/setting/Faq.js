import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
const {width, height} = Dimensions.get('window');

import styles from '../../styles';
import api from '../../helpers/Api';
import COLORS from '../../colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Faq = ({navigation}) => {

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async() => {
    setLoading(true);
    api.getJSON('faq').then(async(resJSON) => {
      setFaqs(resJSON.resp);
      setLoading(false);
    })
    .catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }

  React.useEffect(()=>{
    fetchData();
  }, []); 

  return (
    <ImageBackground style={styles.imgBg} width={width} source={require('../../img/bg.png')}>
      <View style={styles.containerStart}>
        <View style={[styles.rowBetween, styles.itemsStretch, styles.pt50, styles.px20, styles.flex1 ]}>
          <View style={[styles.flex3, styles.pr20, ]}>
            <View style={[styles.flex1, styles.mb30]}>
              <LinearGradient colors={[COLORS.wTitle1, '#000']} style={[styles.widgetTitleWrap, styles.row0Start, styles.py10, styles.pl20]}>
                <Ionicons name="ios-folder-open-sharp" size={15} color="#fffa" style={styles.mr10} />
                <Text style={styles.title1}>FAQ</Text>
              </LinearGradient>
              <ScrollView style={[styles.widgetBody, styles.flex1, styles.p20, styles.bg1]}>
                {faqs.map((faq, faqIdx)=>(
                  <View key={faqIdx} style={[styles.mb20]}>
                    <TouchableOpacity onPress={()=>{ 
                      let temp = JSON.parse(JSON.stringify(faqs));
                      temp[faqIdx].open = !temp[faqIdx].open;
                      setFaqs(temp);
                     }} style={styles.faqQn}>
                      <Text style={styles.body1}>{faq.question}</Text>
                      <Ionicons name={faq.open ? "chevron-up" : "chevron-down"} size={24} color="#fff4" />
                    </TouchableOpacity>
                    { faq.open &&
                    <View style={styles.faqAns}>
                      <Text style={styles.body3}>{faq.answer}</Text>
                    </View>}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={[styles.flex1, styles.justifyStart]}>
            <View style={[styles.rowCols, styles.well, styles.mb10]}>
              <TouchableOpacity style={styles.flex1} onPress={()=>{ 
                navigation.navigate('AboutScreens', {screen: 'Help'});
              }}>
                <LinearGradient colors={['#0000', '#0000']} style={styles.btnFull}>
                    <Text style={styles.btnTxtRed}>SUPPORT</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity disabled style={styles.flex1}>
                <LinearGradient colors={[COLORS.green1, COLORS.green2]} style={styles.btnFull}>
                    <Text style={styles.btnTxtRed}>FAQ</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Faq;




