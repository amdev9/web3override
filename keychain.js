const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');

class Keychain {
  constructor() { // add create function instead https://stackoverflow.com/questions/36363278/does-async-await-will-allow-us-to-be-used-on-constructors
    this.wsp = new WebSocketAsPromised('ws://localhost:16384/', {
      createWebSocket: url => new W3CWebSocket(url)
    });
    this.wsp.onMessage.addListener((response) => {
      const call = this.queue.shift();
      call(JSON.parse(response));
    });
    this.queue = [];
  }

  async initialize() {
    await this.wsp.open();
  }
  async term() {
    await this.wsp.close();
  }

  static async create() {
    const keychainInstance = new Keychain();
    await keychainInstance.initialize();
    return keychainInstance;
  }

  method(request) {
    return new Promise((resolve, reject) => {
      this.queue.push(resolve);
      this.wsp.send(JSON.stringify(request));
    });
  };

  signHex(data, keyname) {
    const params = {
      transaction: data,
      blockchain_type: "ethereum",
      keyname: keyname
    };
    return this.method({
      command: 'sign_hex',
      params
    });
  }

  createKey(name) {
    const params = {
      keyname: name,
      encrypted: true,
      curve: "secp256k1",
      cipher: "aes256"
    }
    return this.method({
      command: "create",
      params
    });
  }
  
}

module.exports = Keychain;