const Web3 = require('web3');
const Module = require('./index');
// const ethUtl = require('ethereumjs-util');
const API_KEY = 'https://ropsten.infura.io/v3/046804e3dd3240b09834531326f310cf';

let web3 = new Web3(new Web3.providers.HttpProvider(API_KEY));

main = async () => {
  const keyname = 'test1@76de427d42c38be4';  
  // const keychain = await Module.Keychain.create();
  // const publicKeyData = await keychain.method({ command: 'public_key', params: { keyname } });
  // console.log(`Result: ${JSON.stringify(publicKeyData)}`);
  // const publicKey = `0x${publicKeyData.result}`;
  // console.log('publicKey: ', publicKey);
  // const from = ethUtl.pubToAddress(publicKey).toString('hex');
  // console.log('from: ', from);

  const nonce = await web3.eth.getTransactionCount('0x7ec2514b2864103a27fd6c070778ec05af2cda0c');
  const gasPrice = await web3.eth.getGasPrice();
  const to = '0xE8899BA12578d60e4D0683a596EDaCbC85eC18CC';
  const value = 100;
  const data = '';
  const gas = 21000;

  const transactionParams = {
    nonce,
    gasPrice: Number(gasPrice),
    to,
    value,
    data,
    gas
  };
 
  const privateKey = '0xb3d3427eea7867c243baaf2f4c67a9551eea2ea96556acfb0051dffa18d182d4';
  const signedTxWeb3 = await web3.eth.accounts.signTransaction(transactionParams, privateKey);
   
  Module.override(web3);

  const signedTxKeychain = await web3.eth.accounts.signTransaction(transactionParams, keyname);
  console.log(signedTxKeychain.rawTransaction === signedTxWeb3.rawTransaction);
};
main();

