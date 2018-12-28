const initState = {
    BCACContractAddr: '0xe36df5bb57e80629cfc28a31e5f794071c085eca',
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