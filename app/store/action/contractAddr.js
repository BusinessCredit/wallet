let actions = {
    contractAddr(option) {
        return function (dispatch, getState) {
            dispatch({
                type: 'CONTRACTADDR',
                BCACContractAddr: option.BCACContractAddr
            })
        }
    }
}

export default actions