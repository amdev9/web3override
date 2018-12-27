var expect = require('chai').expect;
const Web3 = require('web3');
 
const Module = require('../lib/index');
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

describe("Create and sign", () => {
  let key, resKch, resWeb3;
  const keyname = 'test1@76de427d42c38be4';  
  const privateKey = '0xb3d3427eea7867c243baaf2f4c67a9551eea2ea96556acfb0051dffa18d182d4';

  it('Create new key in Keychain', async () => {
    const keyInstance = await Module.Keychain.create();
    const data = await keyInstance.createKey('test1');
    key = data.result;
    await keyInstance.term();
    expect(key).to.have.string('@');
  });

  it('Sign transaction with web3', async () => {
    resWeb3 = await web3.eth.accounts.signTransaction(transactionParams, privateKey);  
    expect(resWeb3).to.have.property('rawTransaction');
  });

  it('Sign transaction with overriden web3', async () => {
    Module.override(web3);
    resKch = await web3.eth.accounts.signTransaction(transactionParams, keyname);  
    expect(resKch).to.have.property('rawTransaction');
    expect(resKch).to.be.equal(resWeb3);
  });
});
 
