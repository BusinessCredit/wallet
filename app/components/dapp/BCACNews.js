import React from 'react';
import {
  StyleSheet, WebView as RNWebView,
  View, Text,
  Dimensions, Platform, Share,
  TouchableHighlight, Image,
  BackHandler
} from 'react-native';

import WebViewAndroid from 'react-native-webview-android'
import { withNavigation, Header } from 'react-navigation';
import BCACNewsQuery from './BCACNewsQuery';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

class BCACNews extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>

          </Text>
        </View>
        <BCACNewsQuery />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: maxWidth,
    backgroundColor: 'white',
  },
  header: {
    height: 1,
    backgroundColor: '#528bf7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#528bf7',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.4,
  },
})
export default withNavigation(BCACNews);
