const Datastore = require('nedb');
const utils = require('../src/utils');


class StoreServer {
  constructor(serverIO) {
    serverIO.on('connection', (socket) => {
      // add to app log something like 'StoreServer connected'

      socket.on('dash:create', (data, fn) => {
        this.createDash((newDash) => { fn(newDash); });
      });

      socket.on('dash:update', (data, fn) => {
        this.updateDash(data, (updated) => { fn(updated); });
      });

      socket.on('dash:get', (data, fn) => {
        this.getDash(data, (data) => { fn(data); });
      });

      socket.on('dash:getall', (data, fn) => {
        this.getAll((data) => { fn(data); });
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
    const newDash = {
      dashId: utils.uuid(),
      createdAt: new Date(),
      items: []
    };
    this.dashDB.insert(newDash, (err, newDoc) => {
      return newDoc ? fn(newDoc) : fn(false);
    });
  }

  updateDash(data, fn) {
    this.dashDB.update(
      {dashId: data.dashId},
      { $set: { items: data.items} },
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

  getAll(fn) {
    this.dashDB.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
      return fn(docs);
    });
  }
}

module.exports = StoreServer;
