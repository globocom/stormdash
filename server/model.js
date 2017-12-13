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

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const dashSchema = mongoose.Schema({
  name: { type: String, index: true },
  createdAt: { type: Date, default: Date.now },
  items: Array
});

const itemAuthSchema = mongoose.Schema({
  itemId: String,
  username: String,
  password: String,
  authHeaders: String,
  createdAt: { type: Date, default: Date.now }
});

const Dash = mongoose.model('Dash', dashSchema);
const ItemAuth = mongoose.model('ItemAuth', itemAuthSchema);

module.exports = { Dash, ItemAuth };
