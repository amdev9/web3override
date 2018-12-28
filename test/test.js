var expect = require('chai').expect;
const Web3 = require('web3');
 
const Module = require('../lib/index');
const API_KEY = 'https://ropsten.infura.io/v3/046804e3dd3240b09834531326f310cf';

let web3 = new Web3(new Web3.providers.HttpProvider(API_KEY)); 

const to = '0xE8899BA12578d60e4D0683a596EDaCbC85eC18CC';
const value = 100;
const data = '';
const gas = 21000;
const nonce = 0;  
const gasPrice = 100;
const chainId = 3;
 
const transactionParams = {
  nonce,
  gasPrice,
  to,
  value,
  data,
  gas,
  chainId
}

describe("Create and sign", () => {
  let key, signResKch, signResWeb3, resKch, resWeb3;
  const keyname = 'test1@76de427d42c38be4';
  const privateKey = '0xb3d3427eea7867c243baaf2f4c67a9551eea2ea96556acfb0051dffa18d182d4';
  const message = '12345';

  it('Create new key in Keychain', async () => {
    const keyInstance = await Module.Keychain.create();
    const data = await keyInstance.createKey('test1');
    key = data.result;
    await keyInstance.term();
    expect(key).to.have.string('@');
  });
  //
  // it('Sign with web3', async () => {
  //   signResWeb3 = await web3.eth.accounts.sign(message, privateKey);
  //   console.log('signResWeb3: ', signResWeb3);
  //   expect(signResWeb3).to.have.property('message');
  // });
  //
  // it('Sign with overriden web3', async () => {
  //   Module.override(web3);
  //   signResKch = await web3.eth.accounts.sign(message, keyname);
  //   console.log('signResKch: ', signResKch);
  //   expect(signResKch).to.have.property('signature');
  // });
  //
  // it('Overriden web3 sign valid', async () => {
  //   expect(signResKch.message).to.equal(signResWeb3.message);
  //   expect(signResKch.messageHash).to.equal(signResWeb3.messageHash);
  //   expect(signResKch.v).to.equal(signResWeb3.v);
  //   expect(signResKch.r).to.equal(signResWeb3.r);
  //   expect(signResKch.s).to.equal(signResWeb3.s);
  //   expect(signResKch.signature.substr(0, signResKch.signature.length-2)).to.
  //   equal(signResWeb3.signature.substr(0, signResWeb3.signature.length-2));  // trunc V for now because keychain gives different from web3 V
  // });

  it('Sign transaction with web3', async () => {
    resWeb3 = await web3.eth.accounts.signTransaction(transactionParams, privateKey);
    expect(resWeb3).to.have.property('rawTransaction');
  });

  it('Sign transaction with overriden web3', async () => {
    Module.override(web3);
    resKch = await web3.eth.accounts.signTransaction(transactionParams, keyname);
    expect(resKch).to.have.property('rawTransaction');
  });

  it('Overriden web3 signTransaction valid', async () => {
    expect(resKch).to.deep.equal(resWeb3);
  });

});
 
