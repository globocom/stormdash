const axios = require('axios');
const Datastore = require('nedb');
const utils = require('../src/utils');


class IOServer {
  constructor(io) {
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

    if(io === undefined) {
      return;
    }

    io.on('connection', (socket) => {
      // console.log('IOServer connected');

      // Dashboard persistence events
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
        this.getAll((result) => { fn(result); });
      });

      // Alert item events
      socket.on('items:update', (data, fn) => {
        this.startUpdate(data, (result) => { fn(result) });
      });

      socket.on('item:check', (data, fn) => {
        this.checkItemValue(data, (result) => { fn(result) });
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
    return false;
  }

  getAll(fn) {
    this.dashDB.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
      return fn(docs);
    });
  }

  // startUpdate(data, fn) {
  //   this.getDash({ name: data.name }, (dash) => {
  //     if(!dash) {
  //       return fn(false);
  //     }

  //     setInterval(() => {
  //       this.updateItems(dash.items);
  //     }, data.interval*1000);
  //   });
  // }

  // updateItems(items) {
  //   items.map((item) => {
  //     this.checkItemValue(item, (value) => {
  //       item.currentValue = value;


  //       this.updateDash(item.id, item);


  //     });
  //   });

  //   this.checkItemValue(item, (value) => {
  //     item.currentValue = value;
  //     this.editItem(item.id, item);
  //   });
  // }

  checkItemValue(itemObj, fn) {
    let { jsonurl, mainkey } = itemObj;
    if(jsonurl !== '') {
      axios.get(jsonurl, {responseType: 'json'}).then((response) => {
        console.log(response);

        if(response.data === null) {
          return fn('__jsonurl_error');
        }
        utils.traverse(response.data, (key, value) => {
          if(key === mainkey) {
            return fn(value);
          }
        });
      }).catch((error) => {
        console.log(error);
        return fn('__jsonurl_error');
      });
    }
  }
}

module.exports = IOServer;
