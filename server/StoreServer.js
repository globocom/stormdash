const Datastore = require('nedb');
const utils = require('../src/utils');


class StoreServer {
  constructor(serverIO) {
    serverIO.on('connection', (socket) => {
      // add to app log something like 'StoreServer connected'

      socket.on('dash:create', (data, fn) => {
        this.createDash(data, (newDash) => { fn(newDash); });
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
    this.dashDB.ensureIndex({fieldName: 'name', unique: true}, (err) => {
      return err && console.log(err);
    })

    this.authDB = new Datastore({
      filename: __dirname + '/stormdash_auth.db',
      autoload: true
    });
    this.authDB.ensureIndex({fieldName: 'name', unique: true}, (err) => {
      return err && console.log(err);
    })
  }

  createDash(data, fn) {
    const name = utils.uuid().split('-')[0];
    const newDash = {
      name: data.name !== '' ? data.name : name,
      createdAt: new Date(),
      items: []
    };
    this.dashDB.insert(newDash, (err, newDoc) => {
      return newDoc ? fn(newDoc) : fn(false);
    });
  }

  updateDash(data, fn) {
    this.dashDB.update(
      {name: data.name},
      { $set: { items: data.items} },
      (err, numAffected, affectedDocuments, upsert) => {
        return numAffected > 0 ? fn(true): fn(false);
      }
    );
  }

  getDash(data, fn) {
    this.dashDB.findOne({name: data.name}, (err, doc) => {
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
