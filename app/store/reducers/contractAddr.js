const initState = {
    // TRUEContractAddr: '0xa4d17ab1ee0efdd23edc2869e7ba96b89eecf9ab',
    // TTRContractAddr: '0xf2bb016e8c9c8975654dcd62f318323a8a79d48e',
    BCACContractAddr: '0x87d6303da6886515cbe242aeb43132216310b150',
}

export default function (state = initState, action) {
    switch (action.type) {
        case 'CONTRACTADDR':
            return {
                ...state,
                // TRUEContractAddr: action.TRUEContractAddr,
                // TTRContractAddr: action.TTRContractAddr,
                BCACContractAddr: action.BCACContractAddr
            }
        default:
            return state
    }
}