const WebSocket = require('ws');

class Keychain {
  constructor() { // add create function instead https://stackoverflow.com/questions/36363278/does-async-await-will-allow-us-to-be-used-on-constructors
    this.ws = new WebSocket('ws://localhost:16384/');
    this.queue = [];

    this.ws.onmessage = (response) => {
      const call = this.queue.shift();
      call(JSON.parse(response.data));
    };
  }

  method(request) {
    return new Promise((resolve, reject) => {
      this.queue.push(resolve);
      this.ws.send(JSON.stringify(request));
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
}

module.exports = Keychain;