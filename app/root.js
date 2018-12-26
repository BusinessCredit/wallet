import React from 'react';
import { Provider } from 'react-redux';
import store from './store/index';
import App from './containers/app';
import { //Platform, 
	Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
 } from 'react-native';
 import JPushModule from 'jpush-react-native'

require('ErrorUtils').setGlobalHandler(function (err) {
	alert(err, 'global error');
});

// const Root = () => (
// 	<Provider store={store}>
// 		<App />
// 	</Provider>
// );

// export default Root;

export default class Root extends React.Component {
  
  onSendLocalMessage(){
    var currentDate = new Date()
    JPushModule.sendLocalNotification({
      buildId: 1,
      id: 5,
      content: 'content' + currentDate.getTime(),
      extra: { key1: 'value1', key2: 'value2' },
      fireTime: currentDate.getTime(),
      badge: 8,
      subtitle: 'subtitle',
      title: 'title' + currentDate.getTime()
    })
  }

	componentDidMount() {		
		if (Platform.OS === 'android') {
			JPushModule.initPush()
			JPushModule.getInfo(map => {
				this.setState({
					appkey: map.myAppKey,
					imei: map.myImei,
					package: map.myPackageName,
					deviceId: map.myDeviceId,
					version: map.myVersion
				})
			})
			JPushModule.notifyJSDidLoad(resultCode => {
				if (resultCode === 0) {
				}
			})
		} else {
			JPushModule.setupPush()
		}

		this.receiveCustomMsgListener = map => {
			this.setState({
				pushMsg: map.content
			})
			console.log('extras: ' + map.extras)
		}

		JPushModule.addReceiveCustomMsgListener(this.receiveCustomMsgListener)
		this.receiveNotificationListener = map => {
			console.log('alertContent: ' + map.alertContent)
			console.log('extras: ' + map.extras)
		}
		JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)

		this.openNotificationListener = map => {
			console.log('Opening notification!')
			console.log('map.extra: ' + map.extras)
			this.jumpSecondActivity()
		}
		JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)

		this.getRegistrationIdListener = registrationId => {
			console.log('Device register succeed, registrationId ' + registrationId)
		}
		JPushModule.addGetRegistrationIdListener(this.getRegistrationIdListener)
	}

	componentWillUnmount() {
		JPushModule.removeReceiveCustomMsgListener(this.receiveCustomMsgListener)
		JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener)
		JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
		JPushModule.removeGetRegistrationIdListener(this.getRegistrationIdListener)
		console.log('Will clear all notifications')
		JPushModule.clearAllNotifications()
	}

	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		)
	}
}