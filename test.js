const Keychain = require('./keychain');
const web3 = require('./index');


// params
const key = 'test1@6de493f01bf590c0';
const to = '0xE8899BA12578d60e4D0683a596EDaCbC85eC18CC';
const publicKey = '0x6a99ea8d33b64610e1c9ff689f3e95b6959a0cc039621154c7b69c019f015f4521bb9f3fc36a4d447002787d4d408da968185fc5116b8ffd385e8ad3196812e2';
// const privKey = '1552e84aa697185f06bbd8287725c63362b287bb45d0814308f409ba189f03ba'
// const fromAddress = ethUtil.publicToAddress(publicKey).toString('hex');
const chainIdHere = 3;
const value = 100;
const data = '';
const gasLimit = 21000; // await web3.eth.estimateGas(draftTxParams) ||
const nonce = 0; //await web3.eth.getTransactionCount(fromAddress);
const gasPrice = 100; //await web3.eth.getGasPrice().then(wei => Number(wei))

// ................
const draftTxParams = {
  nonce,
  gasPrice,
  to,
  value,
  data,
  chainId: chainIdHere
}

let transactionParams = {
  ...draftTxParams,
  gasLimit
}

main = async () => {
  await web3.eth.accounts.signTransaction(transactionParams, key); // overriden web3 function usage
}
main();

