const axios = require('axios');
const mongoose = require('mongoose');

const model = require('./model');
const utils = require('../src/utils');

const mongoUri = process.env.MONGOURI || 'mongodb://localhost:27017/stormdash';

class IOServer {
  constructor(io) {
    mongoose.connect(mongoUri);

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
    const name = data.name !== ''
                 ? data.name
                 : utils.uuid().split('-')[0];

    let dash = new model.Dash({name: name});
    dash.save((err, doc) => {
      if (err) { console.log(err); }
      return doc ? fn(doc) : fn(false);
    });
  }

  updateDash(data, fn) {
    model.Dash.findOneAndUpdate(
      { name: data.name},
      { $set: { items: data.items} },
      { upsert: true },
      (err, doc) => {
        if (err) { console.log(err); }
        return err === null ? fn(true) : fn(false);
      }
    );
  }

  getDash(data, fn) {
    model.Dash.findOne({ name: data.name }, (err, doc) => {
      if (err) { console.log(err); }
      return doc ? fn(doc) : fn(false);
    });
  }

  getAll(data, fn) {
    model.Dash.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
      if (err) { console.log(err); }
      return fn(docs);
    });
  }

  deleteDash(data, fn) {}

  saveAuth(data, fn) {
    let auth = new model.ItemAuth({
      itemId: data.itemId,
      username: data.username,
      password: data.password,
      authHeaders: data.authHeaders
    });

    auth.save((err, doc) => {
      if (err) { console.log(err); }
      return doc ? fn(true) : fn(false);
    });
  }

  getAuth(data, fn) {
    model.ItemAuth.findOne({itemId: data.itemId}, (err, doc) => {
      if (err) { console.log(err); }
      return doc ? fn(doc) : fn(false);
    });
  }

  deleteAuth(data, fn) {}

  checkAllItems(data, fn) {
    this.getDash({ name: data.name }, (dash) => {
      if(!dash) {
        return fn(false);
      }

      let nItems = dash.items.slice(),
          stage = 0;

      nItems.map((item) => {
        let p = new Promise((resolve, reject) => {
          this.checkItem(item, (value) => {
            resolve(value);
          });
        });

        p.then((val) => {
          item.currentValue = val;
          ++stage;
          if(stage === nItems.length) {
            this.updateDash({name: data.name, items: nItems}, (result) => {
              fn(result);
            });
          }
        });

        return item;
      });
    });
  }

  checkItem(item, fn) {
    let headers = {};
    if(item.reqBody && item.reqBody !== '') {
      headers['Content-Type'] = item.reqBodyContentType;
    }
    if(item.hasAuth) {
      this.getAuth({itemId: item.id}, (auth) => {
        console.log(auth);

        item.headers = utils.extend({}, headers, JSON.parse(auth.authHeaders));
        this._requestJSON(item, (value) => {
          return fn(value);
        });
      });
    } else {
      this._requestJSON(item, (value) => {
        return fn(value);
      });
    }
  }

  _requestJSON(item, fn) {
    axios.get(item.jsonurl, {
      responseType: 'json',
      headers: item.headers,
      data: item.reqBody
    })
    .then((response) => {
      if((typeof response.data) !== 'object') {
        return fn('__jsonurl_error');
      }
      utils.traverse(response.data, (key, value) => {
        if(key === item.mainkey) {
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
