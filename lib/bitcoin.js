var bitcoin = require('bitcoinjs-lib');
const Keychain = require('./keychain');
var Buffer = require('safe-buffer').Buffer

var EMPTY_SCRIPT = Buffer.allocUnsafe(0)

bitcoin.TransactionBuilder.prototype.buildTxKeychain = async function () {
 
    // this.tx.prepareTxKeychain(this.inputs, bitcoin.Transaction.SIGHASH_ALL);
  var txTmp = this.tx.clone()
  const hashType = bitcoin.Transaction.SIGHASH_ALL;

  this.inputs.forEach((input, inIndex) => {
    const prevOutScript = input.signScript;
    
    //
    var ourScript = bitcoin.script.compile(bitcoin.script.decompile(prevOutScript).filter(function (x) {
      return x !== bitcoin.opcodes.OP_CODESEPARATOR
    }))

    console.log('prepareTxKeychain ', this)
    

    // SIGHASH_NONE: ignore all outputs? (wildcard payee)
    if ((hashType & 0x1f) === bitcoin.Transaction.SIGHASH_NONE) {
      txTmp.outs = []

      // ignore sequence numbers (except at inIndex)
      txTmp.ins.forEach(function (input, i) {
        if (i === inIndex) return

        input.sequence = 0
      })

    // SIGHASH_SINGLE: ignore all outputs, except at the same index?
    } else if ((hashType & 0x1f) === bitcoin.Transaction.SIGHASH_SINGLE) {
      // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L60
      if (inIndex >= this.outs.length) return ONE

      // truncate outputs after
      txTmp.outs.length = inIndex + 1

      // "blank" outputs before
      for (var i = 0; i < inIndex; i++) {
        txTmp.outs[i] = BLANK_OUTPUT
      }

      // ignore sequence numbers (except at inIndex)
      txTmp.ins.forEach(function (input, y) {
        if (y === inIndex) return

        input.sequence = 0
      })
    }

    // SIGHASH_ANYONECANPAY: ignore inputs entirely?
    if (hashType & bitcoin.Transaction.SIGHASH_ANYONECANPAY) {
      txTmp.ins = [txTmp.ins[inIndex]]
      txTmp.ins[0].script = ourScript

    // SIGHASH_ALL: only ignore input scripts
    } else {
      // "blank" others input scripts
      txTmp.ins.forEach(function (input) { input.script = EMPTY_SCRIPT })
      txTmp.ins[inIndex].script = ourScript
    }

  })

  var buffer = Buffer.allocUnsafe(txTmp.__byteLength(false) + 4)
  buffer.writeInt32LE(hashType, buffer.length - 4)
  txTmp.__toBuffer(buffer, 0, false)



  const keyInstance = await Keychain.create();
  const data = await keyInstance.selectKey();
  const publicKey = data.result;
  const bufferHex = Buffer.from(buffer).toString('hex');
  const res = await keyInstance.signHex(bufferHex, publicKey, 'bitcoin');
   
  await keyInstance.term();
  return res.result;   
}

 
module.exports = bitcoin;

