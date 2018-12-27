const Web3 = require('web3');
// const  = require('./keychain');
const Module = require('./index');
const API_KEY = 'https://ropsten.infura.io/v3/046804e3dd3240b09834531326f310cf';

let web3 = new Web3(new Web3.providers.HttpProvider(API_KEY)); 

const to = '0xE8899BA12578d60e4D0683a596EDaCbC85eC18CC';
const value = 100;
const data = '';
const gasLimit = 21000; 
const nonce = 0;  
const gasPrice = 100;
 
const transactionParams = {
  nonce,
  gasPrice,
  to,
  value,
  data,
  gasLimit
}

main = async () => {
  // create new key in Keychain
  const keyInstance = await Module.Keychain.create();
  const data = await keyInstance.createKey('test1');
  const key = data.result;
  await keyInstance.term();

  Module.override(web3);
  // now we use web3 with keychain
  const res = await web3.eth.accounts.signTransaction(transactionParams, key); // overriden web3 function usage
  console.log(res);
}
main();

