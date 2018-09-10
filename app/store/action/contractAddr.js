let actions = {
    contractAddr(option) {
        return function (dispatch, getState) {
            dispatch({
                type: 'CONTRACTADDR',
                // TRUEContractAddr: option.trueContractAddr,
                // TTRContractAddr: option.ttrContractAddr,
                BCACContractAddr: option.BCACContractAddr
            })
        }
    }
}

export default actions