const initState = {
	eth_banlance: 0,
	bcac_balance: 0,
	wallet_address: null
};

export default function(state = initState, action) {
	switch (action.type) {
		case 'WALLETINFO':
			return {
				...state,
				eth_banlance: action.eth_banlance,
				bcac_balance: action.bcac_balance,
				wallet_address: action.wallet_address
			};
		default:
			return state;
	}
}
