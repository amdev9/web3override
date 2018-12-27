

[![npm version](https://badge.fury.io/js/web3override.svg)](https://badge.fury.io/js/web3override)

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
**Run tests**

```
npm run test
```
Add key to your `key_data`:
```
keyname: test1@76de427d42c38be4
password: qwe
```

![alt image](https://raw.githubusercontent.com/cypherpunk99/web3override/master/screencast.gif)
