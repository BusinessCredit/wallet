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
				<Text style={{ lineHeight: 30, fontSize: 20 }}>{show(this.props.record.value / 1e18)}</Text>
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
			result => result.value / 10 ** 18
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


const mock_data = {
	data: {
		result: [
			{ "blockNumber": "6483522", "timeStamp": "1539099613", "hash": "0xa3a938a6677792ed76875db445b1dcdc7d147e99e1cfe9b44b7e226101adb0c2", "nonce": "543", "blockHash": "0x0ea2e7fb7e649e3f05f2370d9b512cf604e9682d7f41ff87002009e91e594743", "from": "0xbd54a30efb06644a8ec71cdd5415e2563d5643f0", "contractAddress": "0xe36df5bb57e80629cfc28a31e5f794071c085eca", "to": "0x87d6303da6886515cbe242aeb43132216310b150", "value": "21460171416737305000000000", "tokenName": "", "tokenSymbol": "", "tokenDecimal": "", "transactionIndex": "39", "gas": "6612388", "gasPrice": "9000000000", "gasUsed": "36752", "cumulativeGasUsed": "1340126", "input": "0xa9059cbb00000000000000000000000087d6303da6886515cbe242aeb43132216310b15000000000000000000000000000000000000000000011c05e393da56a0179ba00", "confirmations": "47364" },
			{ "blockNumber": "6483507", "timeStamp": "1539099391", "hash": "0x5574a185d5b190a5318c7aa5816552918a7a4957ac3f65f374e7eaf2c2784b9d", "nonce": "51", "blockHash": "0xef2ab21c72791481d970ac1d4a335f822a652f72c434f5c7d818ed3348934a64", "from": "0x18a744e4564601a5241c910aa0cd69aee82287a8", "contractAddress": "0xe36df5bb57e80629cfc28a31e5f794071c085eca", "to": "0xbd54a30efb06644a8ec71cdd5415e2563d5643f0", "value": "15000000000000000000000000", "tokenName": "", "tokenSymbol": "", "tokenDecimal": "", "transactionIndex": "40", "gas": "54936", "gasPrice": "8000000000", "gasUsed": "36624", "cumulativeGasUsed": "1531550", "input": "0xa9059cbb000000000000000000000000bd54a30efb06644a8ec71cdd5415e2563d5643f00000000000000000000000000000000000000000000c685fa11e01ec6f000000", "confirmations": "47379" },
			{ "blockNumber": "6483253", "timeStamp": "1539095652", "hash": "0xff4ed78b30ceff9320942d48776194dcb56b5c1fcee0bc64fa0429c0cdd303cd", "nonce": "527", "blockHash": "0xbf1007478d4e139e59f6c3824951515ba08c9f00d0867c23ada85db8cdfa0a60", "from": "0xbd54a30efb06644a8ec71cdd5415e2563d5643f0", "contractAddress": "0xe36df5bb57e80629cfc28a31e5f794071c085eca", "to": "0x87d6303da6886515cbe242aeb43132216310b150", "value": "6892768333336248000000000", "tokenName": "", "tokenSymbol": "", "tokenDecimal": "", "transactionIndex": "6", "gas": "6612388", "gasPrice": "9000000000", "gasUsed": "36752", "cumulativeGasUsed": "308140", "input": "0xa9059cbb00000000000000000000000087d6303da6886515cbe242aeb43132216310b15000000000000000000000000000000000000000000005b399b856a588d44d3000", "confirmations": "47633" },
			{ "blockNumber": "6483106", "timeStamp": "1539093714", "hash": "0x19461275e0d91bfa5f6222a11ec8d3810c6d2fb5efef0d7c2247d18aeef233d0", "nonce": "506", "blockHash": "0x664c5439945b25479dc0a70c04abf04ab9b8c8c3348f2fe8019ad2b7909140f1", "from": "0xbd54a30efb06644a8ec71cdd5415e2563d5643f0", "contractAddress": "0xe36df5bb57e80629cfc28a31e5f794071c085eca", "to": "0x87d6303da6886515cbe242aeb43132216310b150", "value": "9674355833334758000000000", "tokenName": "", "tokenSymbol": "", "tokenDecimal": "", "transactionIndex": "3", "gas": "6612388", "gasPrice": "9000000000", "gasUsed": "36688", "cumulativeGasUsed": "403553", "input": "0xa9059cbb00000000000000000000000087d6303da6886515cbe242aeb43132216310b15000000000000000000000000000000000000000000008009fe16eabfbff7f7c00", "confirmations": "47780" }
		]
	}
}