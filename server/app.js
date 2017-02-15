const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/dash/:dashName/info', (req, res) => {
  global.ioserver.getDash({name: req.params.dashName}, (dash) => {
    if(dash) {
      return res.json({
        "status": "OK",
        "itemsCount": dash.items.length,
        "createdAt": dash.createdAt
      });
    } else {
      return res.json({
        "status": "Dashboard Not Found"
      });
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
