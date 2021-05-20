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

const axios = require("axios-proxy-fix");
const mongoose = require("mongoose");
const model = require("./model");
const utils = require("../src/utils");
const HttpsProxyAgent = require("https-proxy-agent");

const mongoUri = process.env.MONGOURI || "mongodb://localhost:27017/stormdash";
const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 15;
const CHECK_ITEM_TIMEOUT = process.env.CHECK_ITEM_TIMEOUT || 5;

class Server {
  constructor() {
    this.updateInterval = null;

    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    this.startUpdateLoop();
  }

  startUpdateLoop() {
    clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => {
      this.getAll({}, (dashboards) => {
        dashboards.map((dash) => {
          this.checkDashItems(dash.name, (result) => {
            console.info(`Dashboard: ${dash.name}, check result: ${result}`);
          });
        });
      });
    }, UPDATE_INTERVAL * 1000);
  }

  createDash(data, fn) {
    let name = data.name !== "" ? data.name : utils.uuid().split("-")[0];

    let dash = new model.Dash({
      name: name,
      hidden: false,
      createdAt: Date.now(),
    });

    dash.save((err, doc) => {
      if (err) {
        console.log(err);
      }
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
      { $set: { hidden: data.hidden, items: data.items } },
      { upsert: true },
      (err, _) => {
        if (err) {
          console.log(err);
        }
        return err === null ? fn(true) : fn(false);
      }
    );
  }

  getDash(data, fn) {
    model.Dash.findOne({ name: data.name }, (err, doc) => {
      if (err) {
        console.log(err);
      }
      return doc ? fn(doc) : fn(false);
    });
  }

  getAll(data, fn) {
    model.Dash.find({})
      .sort({ createdAt: -1 })
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        return fn(docs);
      });
  }

  deleteDash(data, fn) {}

  deleteItemAuth(data, fn) {
    model.ItemAuth.remove(
      {
        itemId: data.itemId,
      },
      (error) => {
        fn(error);
      }
    );
  }

  saveAuth(data, fn) {
    let auth = new model.ItemAuth({
      itemId: data.itemId,
      username: data.username,
      password: data.password,
      authHeaders: data.authHeaders,
    });

    auth.save((err, doc) => {
      if (err) {
        console.log(err);
      }
      return doc ? fn(true) : fn(false);
    });
  }

  getAuth(data, fn) {
    model.ItemAuth.findOne({ itemId: data.itemId }, (err, doc) => {
      if (err) {
        console.log(err);
      }
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

      const itemsClone = utils.clone(dash.items),
        promises = [];

      for (const item of itemsClone) {
        const prom = new Promise((resolve, _) => {
          this.checkItem(item, (value) => {
            item.currentValue = value;

            if (value !== "__jsonurl_error" && item.coveragehost) {
              this.checkCoverage(item, (coverage) => {
                item.coverage = coverage;
                resolve(item);
              });
            } else {
              resolve(item);
            }
          });
        });
        promises.push(prom);
      }

      Promise.all(promises).then((items) => {
        this.updateDash({ name: dashName, items: items }, (result) => {
          return fn(result);
        });
      });
    });
  }

  checkItem(item, fn) {
    let headers = {};

    if (item.reqBody && item.reqBody !== "") {
      headers["Content-Type"] = item.reqBodyContentType;
    }

    if (item.hasAuth) {
      this.getAuth({ itemId: item.id }, (auth) => {
        if (auth) {
          item.headers = utils.extend(
            {},
            headers,
            JSON.parse(auth.authHeaders)
          );
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

  checkCoverage(item, fn) {
    axios
      .get(item.coveragehost)
      .then((response) => {
        if (typeof response.data !== "object") {
          return fn("__coveragehost_error");
        }
        let value = utils.findByKey(response.data, item.coveragefield);
        fn(value);
      })
      .catch((error) => {
        console.log(error);
        return fn("__coveragehost_error");
      });
  }

  _requestJSON(item, fn) {
    let config = {
      responseType: "json",
      timeout: CHECK_ITEM_TIMEOUT * 1000
    };

    if (item.jsonurl === "") {
      return fn("__jsonurl_error");
    }

    if (item.headers !== undefined && item.headers !== "") {
      config["headers"] = item.headers;
    }

    if (item.reqBody !== undefined && item.reqBody !== "") {
      config["data"] = item.reqBody;
    }

    if (
      item.proxyhost !== undefined &&
      item.proxyhost !== "" &&
      item.proxyport !== undefined &&
      item.proxyport !== ""
    ) {
      config["httpsAgent"] = new HttpsProxyAgent(
        "http://" + item.proxyhost + ":" + item.proxyport
      );
    }

    if (
      item.coveragehost !== undefined &&
      item.coveragehost !== "" &&
      item.coveragefield !== undefined &&
      item.coveragefield !== "" &&
      item.coveragetarget !== undefined &&
      item.coveragetarget !== ""
    ) {
      config["coverage"] = {
        host: item.coveragehost,
        field: item.coveragefield,
        target: item.coveragetarget,
      };
    }

    console.info(`Fetching ${item.jsonurl}`);

    axios
      .get(item.jsonurl, config)
      .then((response) => {
        if (typeof response.data !== "object") {
          return fn("__jsonurl_error");
        }
        let value = utils.findByKey(response.data, item.mainkey);
        fn(value);
      })
      .catch((error) => {
        console.error(`\t${error}`);
        return fn("__jsonurl_error");
      });
  }
}

module.exports = Server;
