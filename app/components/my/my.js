import React, { Component } from 'react';
import { View, 
	Text, Image, StyleSheet, 
	Dimensions, TouchableHighlight ,
	Animated,
	BackHandler,
	TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { I18n } from '../../../language/i18n';
const screen = Dimensions.get('window');
import Icon from '../../pages/iconSets';

let { width, height } = Dimensions.get('window');

class My extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	constructor(props) {
		super(props);
		this.state = {
			backClickCount: 0
		}
		this.navigate = this.props.navigation.navigate;

		this.springValue = new Animated.Value(100);
		this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);

		//tracker.trackScreenView("MyWallet");
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
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}
	componentDidMount() {
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}
	render() {
		return (
			<View style={styles.myPage}>
				<View style={styles.myTopBan}>
					<View style={styles.myTopBanCon}>
						<TouchableHighlight
							style={styles.myTopBanConItem}
							underlayColor={'transparent'}
							onPress={() => {
								this.navigate('WalletInfo');
							}}
						>
							<View style={styles.center}>
								<Icon name="icon-qianbao-" size={40} color="#fff" />
								<Text style={styles.myTopBanConItemText}>{I18n.t('my.home.walletManagement')}</Text>
							</View>
						</TouchableHighlight>

						<TouchableHighlight
							style={styles.myTopBanConItem}
							underlayColor={'transparent'}
							onPress={() => {
								this.navigate('TransactionRecord');
							}}
						>
							<View style={styles.center}>
								<Icon name="icon-jiaoyijilu" size={40} color="#fff" />
								<Text style={styles.myTopBanConItemText}>{I18n.t('my.home.transactionRecord')}</Text>
							</View>
						</TouchableHighlight>
					</View>
				</View>
				<View style={styles.myColsCon}>
					<View style={styles.myColsConPart}>
						{/* <View style={styles.myColsConPartRow}>
                            <View style={styles.myColsConPartRowLf}>
                                <Image style={styles.iconMsg} source={require('../../assets/images/my/message-icon_2x.png')} />
                            </View>
                            <View style={styles.myColsConPartRowRi}>
                                <Text>消息中心</Text>
                                <View style={styles.myColsConPartRowRi2R}>
                                    <Text style={styles.newMsgFlag}>5</Text>
                                    <Image style={styles.iconArr2R} resizeMode={Image.resizeMode.stretch} source={require('../../assets/images/common/arr2ri.png')} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.myColsConPartRow}>
                            <View style={styles.myColsConPartRowLf}>
                                <Image style={styles.iconLinkman} source={require('../../assets/images/my/contacts-icon_2x.png')} />
                            </View>
                            <View style={styles.myColsConPartRowRi}>
                                <Text>联系人</Text>
                                <View style={styles.myColsConPartRowRi2R}>
                                    <Image style={styles.iconArr2R} resizeMode={Image.resizeMode.stretch} source={require('../../assets/images/common/arr2ri.png')} />
                                </View>
                            </View>
                        </View> */}

						<TouchableHighlight
							onPress={() => {
								this.props.navigation.navigate('SysSet');
							}}
							underlayColor={'#ddd'}
							activeOpacity={0.5}
						>
							<View style={styles.myColsConPartRow}>
								<View style={styles.myColsConPartRowLf}>
									<Icon name="icon-shezhi" size={20} color="#528bf7" />
								</View>
								<View style={[styles.myColsConPartRowRi, styles.noSplitLine]}>
									<Text>{I18n.t('my.home.systemSetting')}</Text>
									<View style={styles.myColsConPartRowRi2R}>
										<Icon name="icon-right" size={15} color="#000" />
									</View>
								</View>
							</View>
						</TouchableHighlight>
					</View>

					<View style={styles.myColsConPart}>
						<TouchableHighlight
							onPress={() => this.props.navigation.navigate('HelperCenter')}
							underlayColor={'#ddd'}
							activeOpacity={0.5}
						>
							<View style={styles.myColsConPartRow}>
								<View style={styles.myColsConPartRowLf}>
									<Icon name="icon-bangzhuzhongxin" size={18} color="#528bf7" />
								</View>
								<View style={[styles.myColsConPartRowRi, styles.bottomLine]}>
									<Text>{I18n.t('my.home.helpCenter._title')}</Text>
									<View style={styles.myColsConPartRowRi2R}>
										<Icon name="icon-right" size={15} color="#000" />
									</View>
								</View>
							</View>
						</TouchableHighlight>
						<TouchableHighlight
							onPress={() => this.props.navigation.navigate('AboutUs')}
							underlayColor={'#ddd'}
							activeOpacity={0.5}
						>
							<View style={styles.myColsConPartRow}>
								<View style={styles.myColsConPartRowLf}>
									<Icon name="icon-guanyuwomen" size={20} color="#528bf7" />
								</View>
								<View style={[styles.myColsConPartRowRi, styles.noSplitLine]}>
									<Text>{I18n.t('my.home.aboutUs._title')}</Text>
									<View style={styles.myColsConPartRowRi2R}>
										<Icon name="icon-right" size={15} color="#000" />
									</View>
								</View>
							</View>
						</TouchableHighlight>
					</View>
				</View>
				<Animated.View style={[styles.animatedView, { transform: [{ translateY: this.springValue }] }]}>
					<Text style={styles.exitTitleText}>{I18n.t('public.doubleReturn')}</Text>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => BackHandler.exitApp()}
					>
						<Text style={styles.exitText}>{I18n.t('public.exit')}</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		);
	}
}

export default withNavigation(My);

const styles = StyleSheet.create({
	myPage: {
		flex: 1,
		backgroundColor: '#F6F6F6'
	},
	myTopBan: {
		padding: 8,
		height: screen.height * 0.2,
		backgroundColor: '#528bf7',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	myTopBanCon: {
		flexDirection: 'row',
		width: screen.width,
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	myTopBanConItem: {
		width: screen.width * 0.35,
		height: 80,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	myTopBanrecicon_1: {
		width: 30,
		height: 32
	},
	myTopBanrecicon: {
		width: 38,
		height: 30
	},
	myTopBanConItemText: {
		color: 'white',
		marginTop: 5,
		textAlign: 'center'
	},
	myColsCon: {},
	myColsConPart: {
		marginBottom: 10,
		backgroundColor: 'white'
	},
	myColsConPartRow: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: 60
	},
	myColsConPartRowLf: {
		width: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	myColsConPartRowRi: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: 10
	},
	bottomLine: {
		borderBottomWidth: 1,
		borderColor: '#eee'
	},
	myColsConPartRowRi2R: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	iconMsg: {
		width: 20,
		height: 17
	},
	iconLinkman: {
		width: 20,
		height: 20,
		resizeMode: 'stretch'
	},
	iconSettings: {
		width: 22,
		height: 21,
		resizeMode: 'stretch'
	},
	iconArr2R: {
		width: 8,
		height: 14
	},
	icon22: {
		width: 35,
		height: 28
	},
	iconHelper: {
		width: 22,
		height: 22
	},
	iconAbout: {
		width: 22,
		height: 22
	},
	newMsgFlag: {
		borderRadius: 10,
		height: 20,
		width: 30,
		textAlign: 'center',
		backgroundColor: 'red',
		fontSize: 13,
		color: 'white',
		lineHeight: 20,
		marginRight: 6
	},
	noSplitLine: {
		borderWidth: 0
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
		width: screen.width * 0.35,
		height: 80,
		justifyContent: 'space-around'
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
