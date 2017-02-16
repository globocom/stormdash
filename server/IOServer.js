const axios = require('axios');
const Datastore = require('nedb');
const utils = require('../src/utils');

class IOServer {
  constructor(io) {
    this.dashDB = new Datastore({
      filename: __dirname + '/stormdash.db',
      autoload: true
    });
    this.dashDB.persistence.setAutocompactionInterval(300000) // 5 min
    this.dashDB.ensureIndex({fieldName: 'name', unique: true}, (err) => {
      return err && console.log(err);
    });

    this.authDB = new Datastore({
      filename: __dirname + '/stormdash_auth.db',
      autoload: true
    });
    this.authDB.persistence.setAutocompactionInterval(1800000) // 30 min
    this.authDB.ensureIndex({fieldName: 'name', unique: true}, (err) => {
      return err && console.log(err);
    });

    if(io === undefined) {
      return;
    }

    io.on('connection', (socket) => {
      // Dashboard events
      socket.on('dash:create', (data, fn) => {
        this.createDash(data, (result) => { fn(result); });
      });

      socket.on('dash:update', (data, fn) => {
        this.updateDash(data, (result) => { fn(result); });
      });

      socket.on('dash:get', (data, fn) => {
        this.getDash(data, (result) => { fn(result); });
      });

      socket.on('dash:getall', (data, fn) => {
        this.getAll(data, (result) => { fn(result); });
      });

      socket.on('dash:deletedash', (data, fn) => {
        this.deleteDash(data, (result) => { fn(result); });
      });

      // Alert item events
      socket.on('item:checkall', (data, fn) => {
        this.checkAllItems(data, (result) => { fn(result) });
      });

      socket.on('item:check', (data, fn) => {
        this.checkItem(data, (result) => { fn(result) });
      });

      // Authentication events
      socket.on('auth:save', (data, fn) => {
        this.saveAuth(data, (result) => { fn(result); });
      });

      socket.on('auth:get', (data, fn) => {
        this.getAuth(data, (result) => { fn(result); });
      });

      socket.on('auth:delete', (data, fn) => {
        this.deleteAuth(data, (result) => { fn(result); });
      });

    });
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
  }

  getAll(data, fn) {
    this.dashDB.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
      return fn(docs);
    });
  }

  deleteDash(data, fn) {}

  saveAuth(data, fn) {
    const newAuth = {
      name: data.name,
      username: data.username,
      password: data.password,
      authHeaders: data.authHeaders,
      createdAt: new Date()
    };
    this.authDB.insert(newAuth, (err, newDoc) => {
      return newDoc ? fn(true) : fn(false);
    });
  }

  getAuth(data, fn) {
    this.authDB.findOne({name: data.name}, (err, doc) => {
      return doc ? fn(doc) : fn(false);
    });
  }

  deleteAuth(data, fn) {}

  checkAllItems(data, fn) {
    this.getDash({ name: data.name }, (dash) => {
      if(!dash) {
        return fn(false);
      }

      let items = dash.items.slice();
      items.map((item) => {
        let p = new Promise((resolve, reject) => {
          this.checkItem(item, (value) => {
            resolve(value);
          });
        });
        p.then((val) => { item.currentValue = val; });
        return item;
      });

      this.updateDash({name: data.name, items: items}, (result) => {
        fn(result);
      });
    });
  }

  checkItem(itemObj, fn) {
    const { jsonurl, mainkey,
            reqBody, reqBodyContentType } = itemObj;
    const headers = {};

    if(reqBody && reqBody !== '') {
      headers['Content-Type'] = reqBodyContentType;
    }

    axios.get(jsonurl, {
      responseType: 'json',
      headers: headers
    })
    .then((response) => {
      if((typeof response.data) !== 'object') {
        return fn('__jsonurl_error');
      }
      utils.traverse(response.data, (key, value) => {
        if(key === mainkey) {
          return fn(value);
        }
      });
    })
    .catch((error) => {
      console.log(error);
      return fn('__jsonurl_error');
    });
  }
}

module.exports = IOServer;
