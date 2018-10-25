export default function(state = {addresses:[]}, action) {
	switch (action.type) {
		case 'WATCHADDRESSES':
			return {
				...state,
				addresses: action.addresses
			};
		case 'WATCH_ADDRESS':
			return {
				...state,
				addresses: action.addresses,
				data: action.data
			}
		case 'UNWATCH_ADDRESS':
			const addresses = state.addresses.addresses.filter(iter=>iter!==action.address)
			return {
				...state,
				addresses: addresses
			}
		default:
			return state;
	}
}