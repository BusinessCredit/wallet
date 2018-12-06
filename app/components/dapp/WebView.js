import React from 'react';
import { StyleSheet, WebView as RNWebView, 
  View, ActivityIndicator, 
  Dimensions, Platform, Share,
  TouchableHighlight, Image,
  BackHandler
 } from 'react-native';
import { withNavigation, Header } from 'react-navigation';
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

class WebView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      uri: "",
      title: "",
      canGoBack: false,
    };
    this.webView = {
      ref: null,
      onBackPress: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title,
    headerRight: (
			<TouchableHighlight
				underlayColor={'transparent'}
				onPress={() => {
					Share.share({
            message: navigation.state.params.title 
              + "想要和您分享一个链接: \n" 
              + navigation.state.params.currentUrl,
            title: navigation.state.params.currentUrlTitle
          })
				}}
			>
        <MaterialCommunityIcon style={{
          marginRight: 10
        }} name="share-variant" size={20} color="black" />
			</TouchableHighlight>
		)
  });

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      uri: params.uri,
      title: params.title
    });
  }

  onAndroidBackPress = () => {
    if (this.state.canGoBack && this.webView.ref) {
      this.webView.onBackPress = true;
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  hideSpinner() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <RNWebView
          //onLoad={() => this.hideSpinner()}
          style={styles.webview}
          source={{ uri: this.state.uri }}
          ref={(webView) => { 
            this.webView.ref = webView; 
          }}
          onNavigationStateChange={(navState) => {
            if(this.webView.onBackPress === true && navState.url === "about:blank")
              this.props.navigation.goBack()
            this.setState({
              canGoBack: navState.canGoBack
            })
            this.props.navigation.setParams(
              {
                currentUrl : navState.url,
                currentUrlTitle : navState.currentUrlTitle
              }
            )
            this.webView.onBackPress = false
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: maxWidth,
    //height: maxHeight - Header.HEIGHT
  },
  webview: {
    flex: 1,
    //marginTop: 20,
    //backgroundColor: '#528bf7'
  },
  loading: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-around"
  }
})
export default withNavigation(WebView);
