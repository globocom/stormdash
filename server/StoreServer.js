const utils = require('../src/utils');

class StoreServer {
  constructor(serverIO) {
    serverIO.on('connection', (socket) => {
      console.log('StoreServer connected');

      socket.on('dash:create', () => {
        const newId = this.createDash();
        socket.emit('dash:created', {id: newId});
      });
    });
  }

  createDash(dashId=utils.uuid()) {
    return dashId;
  }
}

module.exports = StoreServer;
