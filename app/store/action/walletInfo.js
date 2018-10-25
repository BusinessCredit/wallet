let actions = {
    walletInfo(option) {
        return function (dispatch, getState) {
            dispatch({
                type: 'WALLETINFO',
                eth_banlance: option.eth_banlance,
                bcac_balance: option.bcac_balance,
                wallet_address: option.wallet_address
            })
        }
    }
}

export default actions