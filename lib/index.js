const EthereumTx = require('ethereumjs-tx');
const Keychain = require('./keychain');

const rsv = (signature, chainId) => {
  const ret = {};
  console.log('signature: ', signature);
  ret.r = `0x${signature.slice(0, 64)}`;
  ret.s = `0x${signature.slice(64, 128)}`;
  const recovery = parseInt(signature.slice(128, 130), 16);
  let tmpV = recovery + 27;
  if (chainId > 0) {
    tmpV += chainId * 2 + 8;
  }
  let hexString = tmpV.toString(16);
  if (hexString.length % 2) {
    hexString = '0' + hexString;
  }
  ret.v = `0x${hexString}`;
  return ret;
}

web3Override = (web3) => {
  sign = async(data, keyname) => {
    const keychain = await Keychain.create();
    const prefix = "\x19Ethereum Signed Message:\n" + data.length;
    const messageHash = web3.utils.sha3(prefix + data).substr(2);

    const result = await keychain.signHash(messageHash, keyname);
    const signature = result.result;
    const ret = rsv(signature, 0);
    await keychain.term();
    return {
      message: data,
      messageHash: '0x' + messageHash,
      v: ret.v,
      r: ret.r,
      s: ret.s,
      signature: '0x' + signature
    };
  };

  signTransaction = async (txParams, keyname) => {
    if (!txParams.chainId) {
      const chainId = await web3.eth.net.getId();
      txParams = Object.assign({}, txParams, { chainId });
    }

    const keychain = await Keychain.create();

    const buildTxSinature = async (txParams) => {
      const rsv = {r: '0x00', s: '0x00', v: txParams.chainId};
      const tx = {...txParams, ...rsv};
      const ethTx = new EthereumTx(tx);
      const buffer = ethTx.serialize();
      const rawTransaction = buffer.toString('hex');
      const messageHash = ethTx.hash().toString('hex');
      return { hex: rawTransaction,  messageHash } ;
    }

    const buildRawTransaction = async (txParams) => {
      const tx = new EthereumTx(txParams);
      let buffer = tx.serialize();
      const hex = buffer.toString('hex');
      return hex;
    }

    const result = await buildTxSinature(txParams);
    const rawHex = result.hex;
    const messageHash = '0x' + result.messageHash;
    const data = await keychain.signHex(rawHex, keyname);
    const ret = rsv(data.result, txParams.chainId);
    let rawParams = Object.assign({}, txParams, ret);
 
    const raw = await buildRawTransaction(rawParams);
    const rawTransaction = `0x${raw}`;
    await keychain.term();

    return {
      messageHash,
      v: ret.v,
      r: ret.r,
      s: ret.s,
      rawTransaction
    };
  }

  web3.eth.accounts.sign = sign;
  web3.eth.accounts.signTransaction = signTransaction;
  return web3;
}

module.exports = { 
  override: web3Override, 
  Keychain: Keychain 
};