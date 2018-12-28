function sendTransaction(fromAddr, toAddr, amount, data, password, keystore, gas, gasPrice, callabck) {
  const account = web3.eth.accounts.decrypt(keystore, password);
  value = web3.utils.toWei(amount, 'ether');
  web3.eth.accounts.wallet.add(account);
  web3.eth.sendTransaction({
      from: fromAddr,
      to: toAddr,
      value: value,
      gasPrice: gasPrice,
      gas: gas,
      data: data
  },
      function (error, txhash) {
          callabck(error, txhash)
      })
}

export default sendTransaction;