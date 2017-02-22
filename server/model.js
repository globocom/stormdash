const mongoose = require('mongoose');

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
