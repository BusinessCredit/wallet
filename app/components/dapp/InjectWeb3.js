BCACPayInjectProvider.prototype.send = function (payload, callback) {
  const self = this

  if (callback) {
    self.sendAsync(payload, callback)
  } else {
    return self._sendSync(payload)
  }
}

BCACPayInjectProvider.prototype._sendSync = function (payload) {
  const self = this

  let selectedAddress
  let result = null
  switch (payload.method) {

    case 'eth_accounts':
      // read from localStorage
      selectedAddress = self.publicConfigStore.getState().selectedAddress
      result = selectedAddress ? [selectedAddress] : []
      break

  }

  // return the result
  return {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    result: result,
  }
}

BCACPayInjectProvider.prototype.isConnected = function () {
  return true
}








// var MasonProvider = function(){};
//             MasonProvider.prototype.prepareRequest = function (async) {
//               return infuraProvider.prepareRequest(async);
//             };
//             MasonProvider.prototype.send = function (payload) {
//               console.log(payload)
//               var method = payload.method;
//               if (method == "eth_accounts") {
//                 res = payload
//                 delete res.params
//                 res.result = ['${address}']
//                 console.log(res);
//                 return res
//               } else {
//                 return infuraProvider.send(payload);
//               }
//             };
//             MasonProvider.prototype.sendAsync = function (payload, callback) {
//               console.log(payload);
//               var method = payload.method;
//               if (method == "eth_accounts") {
//                 res = payload
//                 delete res.params
//                 res.result = ['${address}']
//                 console.log(res);
//                 callback(null, res)
//               } else if (method == "eth_sendTransaction") {
//                 window.masonCallbacks[payload.id] = callback;
//                 window.webkit.messageHandlers.reactNative.postMessage({data: payload});
//               } else {
//                 infuraProvider.sendAsync(payload, (error, response) => callback(error, response));
//               }
//             };
//             MasonProvider.prototype.isConnected = function () {
//               return true
//             };
//             window.masonCallbackHub = function(payload) {
//               let id = payload.id;
//               let result = payload.result;
//               console.log(payload);
//               window.masonCallbacks[id](null, {
//                 "id":id,
//                 "jsonrpc": "2.0",
//                 "result": result
//               });
//             }
//             window.masonCallbacks = {};
//             let infuraProvider = new Web3.providers.HttpProvider("https://ropsten.infura.io/QwECdl7hf7Pq48xrC9PI");
//             var web3 = new Web3(new MasonProvider);
//             web3.eth.defaultAccount = '${address}'
//             alert(web3.eth.defaultAccount);