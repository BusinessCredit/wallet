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
              "0x2ad8529da0488a7c2a1af1e22d1902f7ad2943eb" //bcac contract
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