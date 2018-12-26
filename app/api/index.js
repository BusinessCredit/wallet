import axios from 'axios';

checkVersionUrl = "http://www.bcachain.org/release.json"
bcacNewsUrl="http://www.bcachain.org/index.php?c=api&a=news"

//获取eth交易记录
const getTransactionRecord = (walletAddress, contractaddress) => {
	if (host.includes('rinkeby')) {
		return axios.get(
			'https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=' +
				walletAddress +
				'&sort=desc&apikey=Q8ZFPV5MXG4PFK7EPHRBPJGMXWGH9YRR8I'
		);
	} else {
		return axios.get(
			'https://api.etherscan.io/api?module=account&action=txlist&address=' +
				walletAddress +
				'&sort=desc&apikey=Q8ZFPV5MXG4PFK7EPHRBPJGMXWGH9YRR8I'
		);
	}
};

//获取ERC20交易记录
const getERC20TransactionRecord = (walletAddress, contractaddress) => {
	if (host.includes('rinkeby')) {
		return axios.get(
			'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=' +
				contractaddress +
				'&address=' +
				walletAddress +
				'&sort=desc&apikey=Q8ZFPV5MXG4PFK7EPHRBPJGMXWGH9YRR8I'
		);
	} else {
		return axios.get(
			'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=' +
				contractaddress +
				'&address=' +
				walletAddress +
				'&sort=desc&apikey=Q8ZFPV5MXG4PFK7EPHRBPJGMXWGH9YRR8I'
		);
	}
};

const checkVersion = () => {
	var config = {	headers: {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}};
	console.log("check version")
	return axios.get(checkVersionUrl, config);
};

const getBCACNews = () => {
	var config = {	headers: {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}, timeout: 1000*20};
	return axios.get(bcacNewsUrl, config);
}
export { getTransactionRecord, getERC20TransactionRecord, checkVersion, getBCACNews };
