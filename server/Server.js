/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const axios = require('axios-proxy-fix');
const mongoose = require('mongoose');
const model = require('./model');
const utils = require('../src/utils');

const mongoUri = process.env.MONGOURI || 'mongodb://localhost:27017/stormdash';
const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 15;

class Server {

  constructor() {
    this.updateInterval = null;
    mongoose.connect(mongoUri, { useMongoClient: true });
    this.startUpdateLoop();
  }

  startUpdateLoop() {
    clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => {
      this.getAll({}, (dashboards) => {
        dashboards.map((dash) => {
          this.checkDashItems(dash.name, (data) => {
            console.log('Run startUpdateLoop...');
          });
        });
      });
    }, UPDATE_INTERVAL * 1000);
  }

  createDash(data, fn) {
    let name = data.name !== ''
                ? data.name
                : utils.uuid().split('-')[0];

    let dash = new model.Dash({ name: name, hidden: false, createdAt: Date.now() });

    dash.save((err, doc) => {
      if (err) { console.log(err); }
      if (doc) {
        this.startUpdateLoop();
        return fn(doc);
      }
      return fn(false);
    });
  }

  updateDash(data, fn) {
    model.Dash.findOneAndUpdate(
      { name: data.name },
      { $set: { hidden: data.hidden, items: data.items} },
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

  deleteItemAuth(data, fn) {
    model.ItemAuth.remove({
      itemId: data.itemId
    }, (error) => {
      fn(error);
    });
  }

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
    model.ItemAuth.findOne({ itemId: data.itemId }, (err, doc) => {
      if (err) { console.log(err); }
      return doc ? fn(doc) : fn(false);
    });
  }

  deleteAuth(data, fn) {
    model.ItemAuth.remove({ itemId: data.itemId }, (err) => {
      if (err) {
        console.log(err);
        return fn(false);
      }
      return fn(true);
    });
  }

  checkDashItems(dashName, fn) {
    this.getDash({ name: dashName }, (dash) => {
      if (!dash) {
        return fn(false);
      }

      let nItems = dash.items.slice(),
          hasUpdate = false,
          promises = [];

      for (let i=0, l=nItems.length; i<l; ++i) {
        promises.push(
          new Promise((resolve, reject) => {
            this.checkItem(nItems[i], (value) => {
              if (nItems[i].currentValue !== value) {
                nItems[i].currentValue = value;
                hasUpdate = true;
              }
              resolve(value);
            });
          })
        );
      }

      Promise.all(promises).then((item) => {
        if (hasUpdate) {
          this.updateDash({ name: dashName, items: nItems }, (result) => {
            return fn(result);
          });
        }
        return fn(false);
      });
    });
  }

  checkItem(item, fn) {
    let headers = {};

    if (item.reqBody && item.reqBody !== '') {
      headers['Content-Type'] = item.reqBodyContentType;
    }

    if (item.hasAuth) {
      this.getAuth({ itemId: item.id }, (auth) => {
        if (auth) {
          item.headers = utils.extend({}, headers, JSON.parse(auth.authHeaders));
          this._requestJSON(item, (value) => {
            return fn(value);
          });
        }
      });
    } else {
      this._requestJSON(item, (value) => {
        return fn(value);
      });
    }
  }

  _requestJSON(item, fn) {
    let config = {
      responseType: 'json'
    }

    if (item.jsonurl === '') {
      return fn('__jsonurl_error');
    }

    if (item.headers !== undefined
      && item.headers !== '') {
      config['headers'] = item.headers;
    }

    if (item.reqBody !== undefined
      && item.reqBody !== '') {
      config['data'] = item.reqBody;
    }

    if (item.proxyhost !== undefined
      && item.proxyhost !== ''
      && item.proxyport !== undefined
      && item.proxyport !== '') {
      config['proxy'] = {
        host: item.proxyhost,
        port: item.proxyport
      };
    }

    axios.get(item.jsonurl, config)
    .then((response) => {
      if ((typeof response.data) !== 'object') {
        return fn('__jsonurl_error');
      }
      let value = utils.findByKey(response.data, item.mainkey);
      fn(value);
    })
    .catch((error) => {
      console.log(error);
      return fn('__jsonurl_error');
    });
  }
}

module.exports = Server;
