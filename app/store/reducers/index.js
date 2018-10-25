import { combineReducers } from 'redux';
import walletInfo from './walletInfo';
import contractAddr from './contractAddr';
//import lockAccount from './lockAccount';
import lockToken from './lockToken'
const reducers = combineReducers({
	walletInfo,
	contractAddr,
	//lockAccount,
	lockToken
});

export default reducers;
