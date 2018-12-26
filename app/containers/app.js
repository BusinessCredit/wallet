import React from 'react';
import { I18n } from '../../language/i18n'; // 多国语言支持
import { StyleSheet, Text, AsyncStorage } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation'; // 页面切换 路由导航组件
// import { host } from '../utils/config';

//TabBar 底部栏位页面
import Splash from '../pages/Splash'; // app开屏画面
import Assets from '../components/asset/asset'; // 底部：资产
import My_item from '../components/my/my'; //底部： 我的

//Router
import Guide from '../guide/guide'; //没有本地存储的钱包时进入的引导页：引导用户去选择创建钱包或导入钱包
import CurrencyDetail from '../components/asset/currencyDetail'; //  资产 -> 币种详情页
import Transfer from '../components/asset/transfer'; // 资产 -> 币种详情 -> 转账页
import Receipt from '../components/asset/receipt'; // 资产 -> 币种详情 -> 收款页
import CreateWallet from '../components/my/wallet/createWallet'; // 创建钱包：新建1个本地钱包
import ImportWallet from '../components/my/wallet/importWallet'; // 导入钱包
import WalletInfo from '../components/asset/walletInfo'; // 我的 -> 钱包管理（账户信息页）
import ExportMnemonic from '../components/asset/exportMnemonic'; //导出助记词
import ExportKeystore from '../components/asset/exportKeystore'; //导出keystore
import AboutUs from '../components/my/aboutus';
import UserPolicy from '../components/my/userpolicy';
import Versions from '../components/my/versions';
import SysSet from '../components/my/sysset';
import HelperCenter from '../components/my/helpercenter';
import ContactUs from '../components/my/contactus';
import SysLanguage from '../components/my/sysLanguage';
import TransactionRecord from '../components/my/transactionRecord';
import KnowledgePoint from '../components/my/knowledgePoint';
import WebSetting from '../components/my/webSetting';
import QRscanner from '../components/public/QRscanner';

import LockToken from '../components/lock-token/lock-token'
import WatchAddress from '../components/lock-token/watchAddress'
import DAPPPage from '../components/dapp/DAPP'
import NewsPage from '../components/dapp/News'
import BCACNewsPage from '../components/dapp/BCACNews'
import WebView from '../components/dapp/WebView'
import NewsContent from '../components/dapp/NewsContent'

//rely
import Storage from 'react-native-storage';
import Icon from '../pages/iconSets';
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

//lock-pattern


const storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true
});
global.storage = storage;

storage
	.load({
		key: 'token'
	})
	.then((res) => {
		store.dispatch({
			type: 'TOKEN',
			token: res.token
		});
	})
	.catch((e) => {
		console.log(e);
	});

storage
	.load({
		key: 'localLanguage'
	})
	.then((res) => {
		I18n.locale = res.localLanguage;
	})
	.catch((e) => {
		console.log(e, '首次获取系统语言');
	});

const Web3 = require('web3');

function check(host) {
	if (host.includes('ropsten')) {
		store.dispatch({
			type: 'CONTRACTADDR',
		});
	} else if(host.includes('rinkeby')){
		store.dispatch({
			type: 'CONTRACTADDR',
			BCACContractAddr: '0x87d6303da6886515cbe242aeb43132216310b150',
		});
	}else {
		store.dispatch({
			type: 'CONTRACTADDR',
			BCACContractAddr: '0xe36df5bb57e80629cfc28a31e5f794071c085eca',
		});
	}
	global.host = host;
	const web3 = new Web3(new Web3.providers.HttpProvider(host));
	global.web3 = web3;
}

storage
	.load({
		key: 'webHost'
	})
	.then(({ webHost }) => {
		check(webHost);
	})
	.catch((e) => {
		check('https://mainnet.infura.io/');
	});

const My = createStackNavigator({
	My: {
		screen: My_item,
		navigationOptions: () => ({
			title: I18n.t('tab.my'),
			headerBackTitle: null,
			headerStyle: {
				backgroundColor: '#528bf7',
				borderBottomWidth: 0
			},
			headerTitleStyle: {
				color: '#fff',
				fontSize: 18
			},
			headerTintColor: '#000'
		})
	}
});

const DappTopBarPage = createMaterialTopTabNavigator(
	{
		DAPP: {
			screen: DAPPPage,
			navigationOptions: {
				tabBarLabel: ({ tintColor, focused }) => (
					<Text style={{ height: 30, color: tintColor, fontSize: 16, textAlign: 'center' }}>去中心应用</Text>
				)
			}
		},
		BCACNEWS: {
			screen: BCACNewsPage,
			navigationOptions: {
				tabBarLabel: ({ tintColor, focused }) => (
					<Text style={{ height: 30, color: tintColor, fontSize: 16, textAlign: 'center' }}>商信链新闻</Text>
				)
			}
		},
		// NEWS: {
		// 	screen: NewsPage,
		// 	navigationOptions: {
		// 		tabBarLabel: ({ tintColor, focused }) => (
		// 			<Text style={{ height: 30, color: tintColor, fontSize: 16, textAlign: 'center' }}>链新闻</Text>
		// 		)
		// 	}
		// },
		// FASTNEWS: {

		// },
		// MARKET: {

		// }
	},
	{
		lazy: true,
		animationEnabled: true,
		backBehavior: true,
		tabBarOptions: {
			activeTintColor: '#3e9ce9',
			inactiveTintColor: '#999999',
			showIcon: true,
			style: {
				backgroundColor: '#fff'
			},
			indicatorStyle: {
				opacity: 0
			},
			tabStyle: {
				padding: 0
			}
		}
	}
)
const TabBarPage = createBottomTabNavigator(
	{
		Assets: {
			screen: Assets,
			navigationOptions: {
				tabBarLabel: ({ tintColor, focused }) => (
					<Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>{I18n.t('tab.assets')}</Text>
				),
				tabBarIcon: ({ focused, tintColor }) => <Icon name="icon-zichan" size={30} color={tintColor} />
			}
		},
		Dapp: {
			screen: DappTopBarPage,
			navigationOptions: {
				tabBarLabel: ({ tintColor, focused }) => (
					<Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>{I18n.t('tab.dapp')}</Text>
				),
				tabBarIcon: ({ focused, tintColor }) => <MaterialCommunityIcon name="lock-pattern" size={22} color={tintColor} />
			}
		},
		My: {
			screen: My,
			navigationOptions: {
				tabBarLabel: ({ tintColor, focused }) => (
					<Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>{I18n.t('tab.my')}</Text>
				),
				tabBarIcon: ({ focused, tintColor }) => <Icon name="icon-geren" size={30} color={tintColor} />
			}
		}
	},
	{
		lazy: true,
		animationEnabled: true,
		backBehavior: Assets,
		tabBarPosition: 'bottom',
		tabBarOptions: {
			activeTintColor: '#3e9ce9',
			inactiveTintColor: '#999999',
			showIcon: true,
			style: {
				backgroundColor: '#fff'
			},
			indicatorStyle: {
				opacity: 0
			},
			tabStyle: {
				padding: 0
			}
		}
	}
);

const App = createStackNavigator(
	{
		Splash: { screen: Splash },
		Home: {
			screen: TabBarPage,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		},
		Guide: {
			screen: Guide,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		},
		//DAPP: {screen: DAPPPage}, //all dapp
		WebView: {screen: WebView}, //self webview
		LockToken: {screen: LockToken},
		NewsContent: {screen: NewsContent},
		CurrencyDetail: CurrencyDetail,
		Transfer: Transfer,
		Receipt: {
			screen: Receipt,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('assets.currency.receipt')}</Text>
			}
		},
		CreateWallet: {
			screen: CreateWallet,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('wallet.creatWallet')}</Text>
			}
		},
		ImportWallet: {
			screen: ImportWallet,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('guide.importWallet')}</Text>
			}
		},
		WalletInfo: {
			screen: WalletInfo,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('assets.walletInfo.title')}</Text>
			}
		},
		ExportMnemonic: {
			screen: ExportMnemonic,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('assets.walletInfo.exportMnemonic')}</Text>
			}
		},
		ExportKeystore: {
			screen: ExportKeystore,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('assets.walletInfo.exportKeystore')}</Text>
			}
		},
		AboutUs: {
			screen: AboutUs,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.home.aboutUs._title')}</Text>
			}
		},
		UserPolicy: {
			screen: UserPolicy,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.home.aboutUs.useAgreement')}</Text>
			}
		},
		Versions: {
			screen: Versions,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.home.Versions._title')}</Text>
			}
		},
		HelperCenter: {
			screen: HelperCenter,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.home.helpCenter._title')}</Text>
			}
		},
		ContactUs,
		SysSet: {
			screen: SysSet,
			navigationOptions: {
				headerTitle: () => <Text> {I18n.t('my.sysSetting._title')}</Text>
			}
		},
		WatchAddress: {
			screen: WatchAddress,
			navigationOptions: {
				headerTitle: () => <Text> {I18n.t('lock.watchAddress.addressManager')}</Text>
			}
		},
		SysLanguage: {
			screen: SysLanguage,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.sysSetting.language.multi_language')} </Text>
			}
		},
		TransactionRecord: {
			screen: TransactionRecord,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.home.transactionRecord')} </Text>
			}
		},
		KnowledgePoint,
		WebSetting: {
			screen: WebSetting,
			navigationOptions: {
				headerTitle: () => <Text>{I18n.t('my.webHost')} </Text>
			}
		},
		QRscanner: {
			screen: QRscanner,
			navigationOptions: {
				headerTitle: () => <Text>扫描</Text>
			}
		}
	},
	{
		// initialRouteName: 'Guide',
		headerMode: 'screen',
		navigationOptions: {
			headerStyle: {
				backgroundColor: '#fff'
			},
			headerTitleStyle: {
				color: '#000',
				fontSize: 18
			},
			headerTintColor: '#000'
		}
	}
);

export default App;
