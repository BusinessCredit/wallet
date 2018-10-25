import { getERC20TransactionRecord } from '../../api/index';

let actions = {
  addWatchAddresses(addresses) {
    return function (dispatch) {
      dispatch({
        type: 'WATCHADDRESSES',
        addresses: addresses
      })
    }
  },

  unwatchAddress(address) {
    return function (dispatch) {
      dispatch(
        {
          type: 'UNWATCH_ADDRESS',
          address: address
        }
      )
    }
  },

  watchAddress(addresses) {
    return function (dispatch) {

      const promiseList = []
      addresses.forEach(
        (address) => {
          const promise = new Promise((resolve, reject) => {
            getERC20TransactionRecord(
              address,
              "0xe36df5bb57e80629cfc28a31e5f794071c085eca" //bcac contract
            ).then((res) => {
              const lockRecord = res.data.result.filter(
                iter => iter.to === "0xC77d060a64E832Fdc81285292a7886ED418Df868".toLowerCase()
              )
              resolve({address, lockRecord})
            }).catch((e) => {
              console.log(e);
              //reject(e)
            })
          })
          promiseList.push(promise)
        }
      )
      Promise.all(promiseList).then(
        (result) => {
          const addresses = result.map(iter=>iter.address)
          const data = {}
          result.forEach(iter=>data[iter.address] = iter.lockRecord)
          dispatch(
            {
              type: 'WATCH_ADDRESS',
              addresses: addresses,
              data: data
            }
          )
        }
      )
    }
  }
}

export default actions