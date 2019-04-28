import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	ScrollView,
	RefreshControl,
	TouchableHighlight,
	Modal,
	Linking,
	Animated,
	BackHandler,
	TouchableOpacity,
	Platform
} from 'react-native';

import { connect } from 'react-redux';
import actions from '../../store/action/walletInfo';
import getBalance from '../../utils/addTokens';
import iterface from '../../utils/iterface';
import { I18n } from '../../../language/i18n';
import { checkVersion } from '../../api/index';
import versionCompare from '../../utils/versionCompare'

import { withNavigation } from 'react-navigation'

import { readStorage, writeStorage } from '../../db/db'
var DeviceInfo = require('react-native-device-info');

class CurrencyList extends Component {
	currencyDetail(title, balance) {
		this.props.navigate('CurrencyDetail', {
			title: title,
			balance: balance
		});
	}

	render() {
		return (
			<TouchableHighlight
				underlayColor={'transparent'}
				onPress={() => this.currencyDetail(this.props.item.currency_name, this.props.item.balance)}
			>
				<View style={styles.currency_list}>
					<View style={styles.currency_left}>
						<View>
							<TouchableHighlight style={styles.currency_logo}>
								<Image style={styles.currency_logo_item} source={this.props.item.logo_url} />
							</TouchableHighlight>
						</View>
						<View style={styles.marginLeft}>
							<Text>{this.props.item.currency_name}</Text>
						</View>
					</View>
					<View>
						<Text style={styles.alignRight}>{this.props.item.balance}</Text>
						<Text style={[styles.alignRight, styles.currency]} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

let { width, height } = Dimensions.get('window');

class Assets extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	constructor(props) {
		super(props);
		this.navigate = this.props.navigation.navigate;
		this.state = {
			walletName: ' ',
			walletAddress: ' ',
			eth_balance: 0,
			bcac_balance: 0,
			//daec_balance: 0,
			lock_num: 0,
			newVersion: '--',
			modalVisible: false,
			isRefreshing: true,
			backClickCount: 0
		};

		this.asset = {
			eth_balance: 0,
			bcac_balance: 0,
			//daec_balance: 0,
		}
		this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
		this.springValue = new Animated.Value(100);
		//tracker.trackScreenView("MyAsset");
	}

	_spring() {
		this.setState({ backClickCount: 1 }, () => {
			Animated.sequence([
				Animated.spring(
					this.springValue,
					{
						toValue: -.15 * height,
						friction: 5,
						duration: 300,
						useNativeDriver: true,
					}
				),
				Animated.timing(
					this.springValue,
					{
						toValue: 100,
						duration: 300,
						useNativeDriver: true,
					}
				),
			]).start(() => {
				this.setState({ backClickCount: 0 });
			});
		});
	}
	onBackButtonPressAndroid = () => {
		this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
		return true;
	};
	componentWillUnmount() {
		//this._remove_jpush && this._remove_jpush()
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	show(num) {
		num += '';
		num = num.replace(/[^0-9|\.]/g, '');
		if (/^0+/) {
			num = num.replace(/^0+/, '');
		}
		if (!/\./.test(num)) {
			num += '.00000';
		}
		if (/^\./.test(num)) {
			num = '0' + num;
		}
		num += '00000';
		num = num.match(/\d+\.\d{5}/)[0];
		return num;
	}

	//When refresh balance, ensure db get refresh also
	getAllBalance() {
		this.setState({
			isRefreshing: true
		});

		web3.eth.getBalance(this.state.walletAddress).then((res) => {
			let eth_balance = this.show(web3.utils.fromWei(res, 'ether'));
			this.setState({ eth_balance });
			this.asset = {
				...this.asset,
				eth_balance: eth_balance
			}
			writeStorage("asset", this.asset, e => console.log(e))
		});
		getBalance(
			iterface,
			this.state.walletAddress,
			store.getState().contractAddr.BCACContractAddr,
			(bcac_balance) => {
				bcac_balance = this.show(bcac_balance);
				this.setState({ bcac_balance });

				this.asset = {
					...this.asset,
					bcac_balance: bcac_balance
				}
				writeStorage("asset", this.asset, e => console.log(e))
			}
		);

		this.updateWalletName();

		setTimeout(() => {
			this.setState({
				isRefreshing: false
			});
		}, 1000);
	}

	// _jpush_event_openNotification(){
	// 	//new event only, nav to that page
	// 	this.props.navigation.navigate(
	// 		"BCACNEWS"
	// 	)
	// }

	// _init_jpush() {
	// 	if (Platform.OS === 'android') {
	// 		JPushModule.initPush()
	// 		JPushModule.notifyJSDidLoad(resultCode => {
	// 			if (resultCode === 0) {
	// 			}
	// 		})
	// 	} else {
	// 		JPushModule.setupPush()
	// 	}

	// 	this.receiveCustomMsgListener = map => {
	// 		this.setState({
	// 			pushMsg: map.content
	// 		})
	// 		console.log('extras: ' + map.extras)
	// 	}

	// 	JPushModule.addReceiveCustomMsgListener(this.receiveCustomMsgListener)
	// 	this.receiveNotificationListener = map => {
	// 		console.log('alertContent: ' + map.alertContent)
	// 		console.log('extras: ' + map.extras)
	// 	}
	// 	JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)

	// 	this.openNotificationListener = map => {
	// 		console.log('Opening notification!')
	// 		console.log('map.extra: ' + map.extras)
	// 		this._jpush_event_openNotification()
	// 	}
	// 	JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)

	// 	this.getRegistrationIdListener = registrationId => {
	// 		console.log('Device register succeed, registrationId ' + registrationId)
	// 	}
	// 	JPushModule.addGetRegistrationIdListener(this.getRegistrationIdListener)
	// }

	// _remove_jpush(){
	// 	JPushModule.removeReceiveCustomMsgListener(this.receiveCustomMsgListener)
	// 	JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener)
	// 	JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
	// 	JPushModule.removeGetRegistrationIdListener(this.getRegistrationIdListener)
	// 	console.log('Will clear all notifications')
	// 	JPushModule.clearAllNotifications()
	// }

	componentDidMount() {
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);

		//this._init_jpush()
		storage
			.load({
				key: 'walletInfo'
			})
			.then((walletInfo) => {
				let walletAddress = walletInfo.walletAddress;
				this.setState(
					{
						walletAddress: walletAddress
					},
					() => {
						//this.getAllBalance();
					}
				);
			})
			.catch((x) => {
				console.log(x);
			});

		// Get asset value from storage at first, refresh when user scroll down
		readStorage("asset",
			(res) => {
				this.setState({
					eth_balance: res.eth_balance,
					bcac_balance: res.bcac_balance,
					//daec_balance: res.daec_balance,
					isRefreshing: false
				});

				this.asset = {
					eth_balance: res.eth_balance,
					bcac_balance: res.bcac_balance,
					//daec_balance: res.daec_balance,
				}
			},
			(e) => {
				console.log(e)
				this.getAllBalance()
			}
		)

		this.updateWalletName();

		// this.setState({
		// 	currentVersion: DeviceInfo.default.getVersion()
		// });

		checkVersion()
			.then((result) => {
				return result.data;
			})
			.then((resVersion) => {
				console.log(resVersion)
				const latest = resVersion.latest
				const current = DeviceInfo.default.getVersion()
				console.log("latest version: " + latest)
				console.log("current version: " + current)
				console.log(versionCompare(latest, current))

				if (versionCompare(latest, current) > 0) {
					storage
						.load({
							key: 'localLanguage'
						})
						.then((res) => {
							res.localLanguage && res.localLanguage.includes('zh') ?
								this.setState({
									modalVisible: true,
									newVersion: latest,
									releaseLog: resVersion.note["zh"]
								})
								:
								this.setState({
									modalVisible: true,
									newVersion: latest,
									releaseLog: resVersion.note["en"]
								})
						}).catch((e) => {
							DeviceInfo.default.getDeviceLocale().includes('zh') ?
								this.setState({
									modalVisible: true,
									newVersion: latest,
									releaseLog: resVersion.note["zh"]
								})
								:
								this.setState({
									modalVisible: true,
									newVersion: latest,
									releaseLog: resVersion.note["en"]
								})
						})
				}
				// this.setState({
				// 	newVersion: res.latest,
				// 	modalVisible: true
				// });
				// let ver_new = res.version.replace(/\./g, '');
				// if (ver_new > this.state.currentVersion) {
				// 	this.setState({ modalVisible: true });
				// }
			})
			.catch((x) => {
				console.log(x);
			});;
	}

	updateWalletName() {
		storage
			.load({
				key: 'walletName'
			})
			.then((res) => {
				let walletName = res.walletName;
				this.setState({
					walletName: walletName
				});
			})
			.catch((x) => {
				console.log('没有发现钱包名称');
			});
	}

	componentWillUpdate() {
		this.props.walletInfo({
			wallet_address: this.state.walletAddress,
			eth_banlance: this.state.eth_balance,
			bcac_balance: this.state.bcac_balance,
			//daec_balance: this.state.daec_balance,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.navigation.state.params && nextProps.navigation.state.params.refresh) {
			this.getAllBalance()
		}
	}
	render() {
		const currencyData = [
			{
				currency_name: 'ETH',
				balance: this.state.eth_balance,
				logo_url: require('../../assets/images/currency_logo/eth_logo.png')
			},
			{
				currency_name: 'BCAC',
				balance: this.state.bcac_balance,
				logo_url: require('../../assets/images/currency_logo/bcac_logo.png')
			},
			// {
			// 	currency_name: 'DAEC',
			// 	balance: this.state.daec_balance,
			// 	logo_url: require('../../assets/images/currency_logo/daec_logo.png')
			// }
		];
		return (
			<View style={styles.container}>
				<View style={styles.walletInfo}>
					<View style={styles.walletInfo_item}>
						<TouchableHighlight
							underlayColor={'transparent'}
							onPress={() => this.props.navigation.navigate('WalletInfo')}
						>
							<Image style={styles.avatar} source={require('../../assets/images/asset/head_2x.png')} />
						</TouchableHighlight>
						<Text style={styles.walletName}>{this.state.walletName}</Text>
						<TouchableHighlight
							underlayColor={'transparent'}
							onPress={() => this.props.navigation.navigate('Receipt')}
						>
							<View style={styles.walletAddress}>
								<Text style={styles.walletAddress_item}>
									{this.state.walletAddress.replace(
										this.state.walletAddress.slice('9', '35'),
										'......'
									)}
								</Text>
								<Image
									style={styles.addressErcode}
									source={require('../../assets/images/asset/ercode_2x.png')}
								/>
							</View>
						</TouchableHighlight>
					</View>
				</View>
				<View style={styles.addCurrency}>
					<View style={styles.addCurrency_item}>
						<View>
							<Text style={styles.currency_text}>{I18n.t('assets.totalAssets')}</Text>
							<Text>{this.state.eth_balance}</Text>
						</View>
						{/* <TouchableHighlight style={styles.currency_item}>
							<Text style={styles.currency_item_text}>新增币种</Text>
						</TouchableHighlight> */}
					</View>
				</View>

				<ScrollView
					style={styles.scrollview}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={() => {
								this.getAllBalance();
							}}
							tintColor="#BABEBA"
							title="Loading..."
							titleColor="#9FA3A0"
						/>
					}
				>
					{currencyData.map((item, index) => {
						return <CurrencyList item={item} index={index} key={index} navigate={this.navigate} />;
					})}
				</ScrollView>
				<Animated.View style={[styles.animatedView, { transform: [{ translateY: this.springValue }] }]}>
					<Text style={styles.exitTitleText}>{I18n.t('public.doubleReturn')}</Text>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => BackHandler.exitApp()}
					>
						<Text style={styles.exitText}>{I18n.t('public.exit')}</Text>
					</TouchableOpacity>
				</Animated.View>

				<Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false });
					}}
				>
					<View style={styles.modalCon}>
						<View style={styles.modal}>
							<Text style={styles.modalTitle}>{I18n.t('my.version._newVersion')} {this.state.newVersion} {I18n.t('my.version._version')}</Text>
							<Text style={styles.modalText}>
								{this.state.releaseLog}
							</Text>
							<View style={styles.modalBottomBtn}>
								<View>
									<Text
										style={styles.modalBottomBtnNoText}
										onPress={() => {
											this.setState({
												modalVisible: false
											});
										}}
									>
										{I18n.t('my.version.noEscalation')}
									</Text>
								</View>
								<View>
									<Text
										style={styles.modalBottomBtnYesText}
										onPress={() => {
											Linking.openURL('https://download.bcachain.org').catch((err) =>
												console.error('An error occurred', err)
											);
										}}
									>
										{I18n.t('my.version.upgradeNow')}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export default withNavigation(connect((state) => state.walletInfo, actions)(Assets));

const styles = StyleSheet.create({
	marginLeft: {
		marginLeft: 20
	},
	alignRight: {
		textAlign: 'right'
	},
	container: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height - 50,
		backgroundColor: '#fff'
	},
	walletInfo: {
		height: 230,
		backgroundColor: '#528bf7'
		// borderBottomLeftRadius: 10,
		// borderBottomRightRadius: 10
	},
	walletInfo_item: {
		flex: 1,
		marginTop: 20,
		height: 210,
		alignItems: 'center',
		justifyContent: 'center'
	},
	avatar: {
		width: 70,
		height: 70,
		marginBottom: 10
	},
	walletName: {
		color: '#fff',
		fontSize: 18,
		marginBottom: 10
	},
	walletAddress: {
		flexDirection: 'row'
	},
	addressErcode: {
		width: 15,
		height: 15,
		marginLeft: 5
	},
	walletAddress_item: {
		color: '#fff',
		fontSize: 12
	},
	//新增币种
	addCurrency: {
		alignItems: 'center',
		marginTop: -30
	},
	addCurrency_item: {
		borderRadius: 8,
		height: 80,
		padding: 30,
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		width: Dimensions.get('window').width * 0.85,
		shadowColor: '#938670',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 0,
			height: 2
		}
	},
	currency_text: {
		color: '#ccc',
		fontSize: 12
	},
	currency_item: {
		width: 80,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#528bf7'
	},
	currency_item_text: {
		color: '#fff'
	},
	//币种列表
	currency_list: {
		height: 80,
		marginTop: 5,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	currency_left: {
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	currency_logo: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 50,
		padding: 8
	},
	currency_logo_item: {
		width: 40,
		height: 40
	},
	currency: {
		color: '#ccc'
	},
	// version
	modalCon: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal: {
		backgroundColor: 'white',
		width: 260,
		borderRadius: 10
	},
	modalTitle: {
		fontSize: 16,
		color: '#222',
		lineHeight: 50,
		height: 50,
		textAlign: 'center',
		paddingLeft: 15,
		paddingRight: 15
	},
	modalText: {
		fontSize: 12,
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 20,
		lineHeight: 20,
		textAlign: 'left',
	},
	versionText: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 20
	},
	modalBottomBtn: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderTopWidth: 1,
		borderColor: '#eee',
		alignItems: 'center',
		height: 50
	},
	modalBottomBtnNoText: {
		color: 'rgb(0,118,255)',
		fontSize: 16,
		textAlign: 'center'
	},
	modalBottomBtnYesText: {
		color: 'rgb(254,56,36)',
		fontSize: 16,
		textAlign: 'center'
	},
	animatedView: {
		width,
		backgroundColor: "#528bf7",
		elevation: 2,
		position: "absolute",
		bottom: 0,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	exitTitleText: {
		textAlign: "center",
		color: "#ffffff",
		marginRight: 10,
	},
	exitText: {
		color: "#e5933a",
		paddingHorizontal: 10,
		paddingVertical: 3
	}
});
