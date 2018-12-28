import React from 'react';
import {
  StyleSheet, WebView as RNWebView,
  View, ActivityIndicator,
  Dimensions, Platform, Share,
  TouchableHighlight,
  BackHandler,
  Text, Image, Alert, ScrollView,
} from 'react-native';
import { Input, Slider, Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import { I18n } from '../../../language/i18n';

//import actions from '../../store/action/walletInfo';
import { connect } from 'react-redux';

import WebViewAndroid from 'react-native-webview-android'
import { withNavigation, Header } from 'react-navigation';
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Loading from 'react-native-whc-loading';

import webview_sendTransaction from '../../utils/sendTransaction'

const screen = Dimensions.get('window');
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

      fromAddr: '',
      toAddress: '',
      amount: '0',
      data: '',
      keystoreV3: null,
      password: null,
      gas: 25200,
      gasPrice: 17000000000,
    };
    this.webView = {
      ref: null,
      onBackPress: false,
    }
    this.onMessage = this.onMessage.bind(this)
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

    storage.load({ key: 'walletInfo' }).then((res) => {
      this.setState({
        fromAddr: res.walletAddress,
        keystoreV3: res.keystoreV3
      });
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

  __parse_payload(data) {
    return {
      data: data.data,
      from: data.from,
      to: data.to,
      value: data.value ? data.value : '0',

      gas: parseInt(data.gas),
      gasPrice: parseInt(data.gasPrice)
    }
  }

  __process_eth_sendTransaction(params) {
    //assert(this.state.fromAddr === params.from)
    this.refs.transferDetail.open()
    this.setState({
      gas: params.gas,
      gasPrice: params.gasPrice,

      fromAddr: params.from,
      toAddress: params.to,

      amount: params.value,
      data: params.data
    })
  }

  __sendTransaction() {
    webview_sendTransaction(
      this.state.fromAddr,
      this.state.toAddress,
      this.state.amount,
      this.state.data,
      this.state.password,
      this.state.keystoreV3,
      this.state.gas.toString(),
      this.state.gasPrice.toString(),
      (err, tx) => {
        console.log(err)
        console.log(tx)
        if (err) {
          this.refs.loading.close();
          setTimeout(() => {
            Alert.alert(I18n.t('public.transactionFailed'), err.message);
            // Alert.alert(null, '发布交易失败，请稍后重试！');
          }, 100);
          console.log(err);
        } else {
          this.refs.loading.close();
          setTimeout(() => {
            // 发布交易成功！
            Alert.alert(
              I18n.t('public.transactionSuccess'),
              'txhash: ' + tx,
              [
                {
                  text: "OK",
                  onPress: () => {
                    this.props.navigation.navigate('Home');
                  }
                },
                {
                  text: "Copy TxHash",
                  onPress: () => {
                    this._setClipboardContent(tx);
                    this.props.navigation.navigate('Home');
                  }
                }
              ]
            );
          }, 100);
          console.log(tx, '=======');
        }
      }
    )
  }

  __generate_pay_modal() {
    return (
      <Modal
        style={styles.modal}
        position={'bottom'}
        coverScreen={true}
        ref={'transferDetail'}
        isOpen={this.state.pay_processing}
        swipeArea={20}
      >
        <ScrollView>
          <View style={styles.paymentDetails_title}>
            {/* <Text>支付详情</Text> */}
            <Text>{I18n.t('public.payDetail')}</Text>
          </View>
          {/* 订单信息 */}
          <Detail
            key_k={I18n.t('assets.currency.orderInformation')}
            val={I18n.t('assets.currency.transfer')}
            style={styles.marginLeft_20}
          />
          <Detail
            key_k={I18n.t('assets.transfer.transferInAddress')} //"转入地址"
            val={this.state.toAddress.replace(this.state.toAddress.slice('10', '25'), '......')}
            style={styles.marginLeft_20}
          />
          <Detail
            key_k={I18n.t('assets.transfer.transferOutAddress')} //"转出地址"
            val={this.state.fromAddr.replace(this.state.fromAddr.slice('10', '25'), '......')}
            style={styles.marginLeft_20}
          />
          <Detail
            key_k={I18n.t('assets.currency.transferFee')} //"矿工费用"
            val={
              '≈ Gas(' +
              this.state.gas +
              ') * Gas Price(' +
              web3.utils.fromWei(this.state.gasPrice.toString(), 'Gwei') +
              'gwei)'
            }
            style={styles.paymentDetails_item_gasPOramount}
          />
          {/* 金额 */}
          <Detail
            key_k={I18n.t('assets.currency.transferCount')}
            val={this.state.amount}
            style={styles.paymentDetails_item_gasPOramount}
          />
          <View style={styles.next}>
            <Button
              title={I18n.t('public.next')}
              // title="下一步"
              buttonStyle={styles.buttonStyle}
              onPress={() => {
                this.refs.transferPwd.open();
              }}
            />
          </View>
          <Modal
            style={styles.modal}
            coverScreen={true}
            position={'bottom'}
            ref={'transferPwd'}
            isOpen={this.state.huhu}
            swipeArea={20}
          >
            <ScrollView>
              <View style={styles.paymentDetails_title}>
                <Text>{I18n.t('public.verifyPwd')}</Text>
              </View>
              <Input
                placeholder={I18n.t('public.inputPwd')} //"请输入你的密码"
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
                inputContainerStyle={[styles.inputContainerStyle, styles.pwdStyle]}
              />
              <View style={styles.pwdNext}>
                <Button
                  title={I18n.t('public.next')} //"下一步"
                  buttonStyle={styles.buttonStyle}
                  onPress={() => {
                    this.refs.transferDetail.close();
                    this.refs.transferPwd.close();
                    setTimeout(() => {
                      this.refs.loading.show();
                      if (!this.state.password) {
                        this.refs.loading.close();
                        setTimeout(() => {
                          // Alert.alert(null, '请输入密码');
                          Alert.alert(null, I18n.t('public.inputPwd'));
                        }, 100);
                      } else {
                        setTimeout(() => {
                          try {
                            web3.eth.accounts.decrypt(
                              this.state.keystoreV3,
                              this.state.password
                            );
                            this.__sendTransaction();
                            this.setState({
                              password: null
                            });
                          } catch (error) {
                            this.refs.loading.close();
                            setTimeout(() => {
                              this.setState(
                                {
                                  password: null
                                },
                                () => {
                                  Alert.alert(null, I18n.t('public.wrongPwd'));
                                  // Alert.alert(null, '密码错误,请重新输入');
                                }
                              );
                            }, 100);
                          }
                        }, 100);
                      }
                    }, 1000);
                  }}
                />
              </View>
            </ScrollView>
          </Modal>
        </ScrollView>
      </Modal>
    )
  }

  onMessage(event) {
    const webViewData = JSON.parse(event.nativeEvent.data)
    const params = this.__parse_payload(webViewData.data.params[0])

    this.__process_eth_sendTransaction(params)
  }

  render() {
    let NewWebView = RNWebView
    if (Platform.OS === 'android') {
      NewWebView = WebViewAndroid
    }
    var address = this.props.walletInfo.wallet_address
    return (
      <View style={styles.container}>
        <NewWebView
          //onLoad={() => this.hideSpinner()}
          style={styles.webview}
          source={{ uri: this.state.uri }}
          ref={(webView) => {
            this.webView.ref = webView;
          }}
          onNavigationStateChange={(navState) => {
            if (this.webView.onBackPress === true && navState.url === "about:blank")
              this.props.navigation.goBack()
            this.setState({
              canGoBack: navState.canGoBack
            })
            this.props.navigation.setParams(
              {
                currentUrl: navState.url,
                currentUrlTitle: navState.currentUrlTitle
              }
            )
            this.webView.onBackPress = false
          }}
          injectedJavaScript={
            `
//information query provider
let web3Provider = new Web3.providers.HttpProvider("https://mainnet.infura.io");

var BCACPayInjectProvider = function(){};
BCACPayInjectProvider.prototype.prepareRequest = function (async) {
  return web3Provider.prepareRequest(async);
};

BCACPayInjectProvider.prototype.send = function (payload) {
  var result = null
  console.log(payload)
  switch (payload.method) {
    case 'eth_accounts':
      result = web3.eth.defaultAccount ? [web3.eth.defaultAccount] : []
      break
    default:
      alert("error, un-support function " + payload.method)
      break
  }

  return {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    result: result,
  }
};

BCACPayInjectProvider.prototype.sendAsync = function (payload, callback) {
  var result = {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    result: result,
  }
  console.log(payload)
  switch (payload.method) {

    case 'eth_accounts':
      result.result = web3.eth.defaultAccount ? [web3.eth.defaultAccount] : []
      callback(null, result)
      break

    case 'eth_xxx':
      alert("error, un-support function " + payload.method)
      callback("error", null)
      break

    case 'eth_sendTransaction':
      window.postMessage(JSON.stringify({data: payload}))
      break
    
    default:
      web3Provider.sendAsync(payload, callback)
      break
  }
};

BCACPayInjectProvider.prototype.isConnected = function () {
  return true
};

var web3 = new Web3(new BCACPayInjectProvider);
web3.eth.defaultAccount = '${address}'
alert(web3.eth.defaultAccount);
            `
          }
          onMessage={this.onMessage}
        />
        <Loading ref="loading" />
        {this.__generate_pay_modal()}
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
  },
  modal: {
    height: screen.height * 0.6
  },
  paymentDetails_title: {
    width: screen.width,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#c8c7cc' //  支付详情分割线
  },
  marginLeft_20: {
    marginLeft: 20
  },
  paymentDetails_item: {
    marginLeft: 10,
    marginRight: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8f8f94'
  },
  borderRadius: {
    borderRadius: 50
  },
  paymentDetails_item_key: {
    color: '#8f8f94'
  },
  paymentDetails_item_gasPOramount: {
    flex: 1,
    color: '#000',
    textAlign: 'right'
  },
  pwdStyle: {
    marginTop: 30,
    width: screen.width,
    borderBottomWidth: 1,
    borderBottomColor: '#8f8f94'
  },
  pwdNext: {
    alignItems: 'center',
    marginTop: 100
  }
})

class Detail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.paymentDetails_item}>
        <Text style={styles.paymentDetails_item_key}>{this.props.key_k}</Text>
        <Text style={[styles.paymentDetails_item_key, this.props.style]}>{this.props.val}</Text>
      </View>
    );
  }
}

export default withNavigation(connect(state => state)(WebView));
