import React from 'react';
import { StyleSheet, WebView as RNWebView, 
  View, ActivityIndicator, 
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
        <BCACNewsQuery />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: maxWidth,
    backgroundColor: '#fff',
  },
})
export default withNavigation(BCACNews);
