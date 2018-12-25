* `keychain.js` - Keychain class with ws connection initialization
* `index.js` - override `web3.eth.accounts.signTransaction` method 
* `test.js` - example usage together (`keychain` + `web3`) 

**Usage**

```javascript
  // create new key in Keychain
  const keyInstance = await Module.Keychain.create();
  const data = await keyInstance.createKey('test1');
  const key = data.result;
  await keyInstance.term();

  Module.override(web3);
  // now we use web3 with keychain
  await web3.eth.accounts.signTransaction(transactionParams, key); // overriden web3 function usage
```
**Result**

![alt text](https://raw.githubusercontent.com/cypherpunk99/web3override/master/Screen.png)


