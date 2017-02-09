const Datastore = require('nedb');
const utils = require('../src/utils');


class StoreServer {
  constructor(serverIO) {
    serverIO.on('connection', (socket) => {
      // add to app log something like 'StoreServer connected'

      socket.on('dash:create', (data, fn) => {
        this.createDash((newDash) => {
          fn(newDash);

          // socket.emit('dash:created', newDash);
        });
      });

      socket.on('dash:update', (data, fn) => {
        this.updateDash(data, (updated) => {
          fn(updated);

          // socket.emit('dash:updated', {updated: updated});
        });
      });

      socket.on('dash:get', (data, fn) => {
        this.getDash(data, (data) => {
          fn(data);

          // socket.emit('dash:delivered', data);
        });
      });
    });

    this.dashDB = new Datastore({
      filename: __dirname + '/stormdash.db',
      autoload: true
    });

    this.authDB = new Datastore({
      filename: __dirname + '/stormdash_auth.db',
      autoload: true
    });
  }

  createDash(fn) {
    const dashId = utils.uuid();
    this.dashDB.insert({ dashId: dashId, items: [] }, (err, newDoc) => {
      return newDoc ? fn(newDoc) : fn(false);
    });
  }

  updateDash({dashId, items}, fn) {
    this.dashDB.update(
      {dashId: dashId},
      {dashId: dashId, items: items},
      {upsert: true},
      (err, numAffected, affectedDocuments, upsert) => {
        return numAffected > 0 ? fn(true): fn(false);
      }
    );
  }

  getDash({dashId}, fn) {
    this.dashDB.findOne({dashId: dashId}, (err, doc) => {
      return doc ? fn(doc) : fn(false);
    });
    return false;
  }
}

module.exports = StoreServer;
