import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { getERC20TransactionRecord } from '../../api/index';
import { I18n } from '../../../language/i18n';
import actions from '../../store/action/lockToken';
import Icon from '../../pages/iconSets';

function show(num) {
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
	num = num.match(/\d+\.\d{4}/)[0];
	return num;
}

class Recording extends Component {
	render() {
		const timestamp_utc = new Date(this.props.record.timeStamp * 1000)
		return (
			<View style={styles.recordDetail_item}>
				<Text style={{ lineHeight: 30, fontSize: 20 }}>{show(web3.utils.fromWei(this.props.record.value, 'ether'))}</Text>
				<Text style={{ lineHeight: 15, fontSize: 12, alignSelf: "flex-end" }}>{timestamp_utc.toUTCString()}</Text>
			</View>
		);
	}
}

class LockRecord extends Component {
	render() {
		return (
			<View>
				<View style={styles.recordDetail}>
					<View>
						<Icon name="icon-shouru" size={50} color="#528bf7" />
					</View>
					<Recording record={this.props.data.item} />
				</View>
			</View>
		);
	}
}

class LockToken extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recordData: [],
			lock_num: 0,
			refreshing: false,
		};
		this.navigate = this.props.navigation.navigate;
		//this.addresses = [store.getState().walletInfo.wallet_address]
	}
	static navigationOptions = ({ navigation }) => ({
		headerTitle: I18n.t('lock.lock') , // 转账
	});
	onRefresh() {
		storage
			.load({
				key: 'watchLockTokenAddress'
			})
			.then(({ watchLockTokenAddress }) => {
				this.props.watchAddress([this.props.walletInfo.wallet_address, ...watchLockTokenAddress])
			})
	}

	componentDidMount() {
		this.onRefresh()
	}

	render() {
		const addresses = this.props.lockToken.addresses
		const recordData = addresses.map(
			(address) => this.props.lockToken.data[address]
		).reduce(
			(a, b) => [...a, ...b], []
		)

		const lock_num = recordData.map(
			result => web3.utils.fromWei(result.value, 'ether') //result.value / 10 ** 18
		).reduce(
			(a, b) => a + b, 0
		)

		return (
			<View style={styles.container}>
				<View style={styles.lockInfo}>
					<Text style={[styles.color_fff, styles.lock_num]}>
						{I18n.t('public.lockedWarehouse')} {show(lock_num)}
					</Text>
				</View>

				<View style={styles.record}>
					<Text style={styles.record_title}>{I18n.t('lock.lockTransferRecord')}</Text>
					{recordData.length >= 1 ? (
						<FlatList
							onRefresh={() => {
								this.setState({ refreshing: true, recordData: [] })
								this.onRefresh()
							}}
							refreshing={this.state.refreshing}
							style={styles.marginTop_20}
							data={recordData}
							renderItem={(item, index) => <LockRecord data={item} key={index} />}
							keyExtractor={(item, index) => index.toString()}
						/>
					) : (
							<Text>~</Text>
						)}
				</View>

				{
					<View style={styles.bottom_fun}>
						<Text
							style={[styles.bottom_fun_item, styles.bottom_fun_item_transfer]}
							onPress={() => {
								this.navigate('Transfer', {
									navigate: this.navigate,
									currencyName: "BCAC",
									toAddress: "0xC77d060a64E832Fdc81285292a7886ED418Df868"
								});
							}}
						>
							{I18n.t('lock.lockToken')}
						</Text>
						<Text
							style={[styles.bottom_fun_item, styles.bottom_fun_item_receipt]}
							onPress={() => {
								this.navigate('WatchAddress');
							}}
						>
							{I18n.t('lock.watchAddress.addressManager')}
						</Text>
					</View>
				}
			</View>
		);
	}
}



export default connect((state) => state, actions)(LockToken);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	account_mobile: {
		height: 100,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	account_baseInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	lockInfo: {
		height: 150,
		backgroundColor: '#528bf7',
		alignItems: 'center',
		justifyContent: 'center'
	},
	color_fff: {
		color: '#fff'
	},
	lock_num: {
		marginTop: 20,
		fontSize: 20
	},
	record: {
		padding: 20,
		position: 'absolute',
		top: 150,
		bottom: 50,
		left: 0,
		right: 0
	},
	record_title: {
		margin: 10
	},
	recordDetail: {
		height: 75,
		flexDirection: 'row',
		alignItems: 'center'
	},
	record_icon: {
		width: 50,
		height: 50
	},
	recordDetail_item: {
		flex: 1,
		height: 75,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		display: "flex",
		flexDirection: "column",
	},
	bottom_fun: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'transparent'
	},
	bottom_fun_item: {
		flex: 1,
		height: 50,
		color: '#fff',
		lineHeight: 50,
		textAlign: 'center',
		width: Dimensions.get('window').width / 2
	},
	bottom_fun_item_transfer: {
		backgroundColor: '#35ccbf'
	},
	bottom_fun_item_receipt: {
		backgroundColor: '#528bf7'
	}
});