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

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const model = require('./model');
const Server = require('./Server');

const app = express();
const server = new Server()

app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

// Add CORS for DEVELOPMENT
app.use(function(req, res, next) {
  if (req.connection.remoteAddress == '127.0.0.1') {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  }
  next();
});

app.post('/api/dash/create', (req, res) => {
  server.createDash(req.body, (doc) => {
    return res.status(200).json(doc)
  })
})

app.post('/api/dash/update', (req, res) => {
  server.updateDash(req.body, (doc) => {
    return res.status(200).json(doc)
  })
})

app.post('/api/dash/search', (req, res) => {
  server.getDash(req.body, (doc) => {
    return res.status(200).json(doc)
  })
})

app.get('/api/dash/all', (req, res) => {
  server.getAll({}, (docs) => {
    return res.status(200).json(docs)
  })
})

app.delete('/api/dash/itemauth', (req, res) => {
  server.deleteItemAuth(req.body, (error) => {
    return res.status(200).json(error)
  })
})

app.get('/api/dash/:dashName/info', (req, res) => {
  server.getDash({name: req.params.dashName}, (dash) => {
    if(dash) {
      return res.json({
        "status": "OK",
        "itemsCount": dash.items.length,
        "createdAt": dash.createdAt
      })
    } else {
      return res.json({
        "status": "Dashboard Not Found"
      })
    }
  })
})

app.get('/api/item/check', (req, res) => {
  server.checkItem(req.body, (value) => {
    return res.status(200).json(value)
  })
})

app.post('/api/auth/save', (req, res) => {
  server.saveAuth(req.body, (data) => {
    return res.status(200).json(data)
  })
})

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
})

module.exports = app;
