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
/* eslint no-eval: 0 */

var crypto = require("crypto");

function extend() {
  var newObj = {};
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function uuid() {
  var i, random;
  var uuid = "";

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }

  return uuid;
}

function shuffle(array) {
  // Fisher–Yates shuffle
  var m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function store(namespace, data) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  var store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}

function findByKey(obj, mainkey) {
  var mainvalue = null,
    found = false;

  function traverse(o, k) {
    var keys = Object.keys(o);

    for (var i = 0, l = keys.length; i < l; ++i) {
      var key = keys[i];
      if (key === k) {
        found = true;
        mainvalue = o[key];
        break;
      } else {
        if (o[key] !== null && typeof o[key] === "object") {
          traverse(o[key], k);
          if (found) {
            break;
          }
        }
      }
    }
  }

  traverse(obj, mainkey);
  return mainvalue;
}

function checkStatus(item) {
  let final = "ok",
    status = {
      ok: item.ok,
      warning: item.warning,
      critical: item.critical,
    };

  if (item.currentValue === "__jsonurl_error") {
    return "critical";
  }

  if (item.coveragehost) {
    if (item.coverage < item.coveragetarget) {
      return "critical";
    }
  }

  for (let s in status) {
    let v1 = item.currentValue,
      v2 = status[s].value,
      c = status[s].compare === "=" ? "==" : status[s].compare,
      condition = false;

    v1 = !!parseInt(v1, 10) ? parseInt(v1, 10) : '"' + v1 + '"';
    v2 = !!parseInt(v2, 10) ? parseInt(v2, 10) : '"' + v2 + '"';

    try {
      condition = eval(v1 + c + v2);
    } catch (err) {}

    if (c !== "" && condition) {
      final = s;
    }
  }

  return final;
}

function genSalt(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

function sha512(password, salt) {
  var hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  return { salt: salt, passwordHash: hash.digest("hex") };
}

module.exports = {
  extend,
  clone,
  uuid,
  shuffle,
  store,
  findByKey,
  checkStatus,
  genSalt,
  sha512,
};
