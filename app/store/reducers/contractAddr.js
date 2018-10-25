const initState = {
    BCACContractAddr: '0x87d6303da6886515cbe242aeb43132216310b150',
}

export default function (state = initState, action) {
    switch (action.type) {
        case 'CONTRACTADDR':
            return {
                ...state,
                BCACContractAddr: action.BCACContractAddr
            }
        default:
            return state
    }
}