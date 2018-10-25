import React, { Component } from 'react';
import { StyleSheet, WebView, View, ActivityIndicator } from 'react-native';


class NodeWebView extends Component {

  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  hideSpinner() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.visible && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
          />
        )}
        <WebView
          onLoad={() => this.hideSpinner()}
          style={styles.webview}
          source={{ uri: "http://node.taoyl.vip" }}
        />
      </View>
    );
  }

  // render() {
  //   return (
  //     <WebView
  //       source={{uri: 'https://github.com/facebook/react-native'}}
  //       style={{marginTop: 20}}
  //     />
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  webview: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#528bf7'
  },
  loading: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-around"
  }
})
export default NodeWebView
//export default connect((state) => state.walletInfo, actions)(NodeWebView);