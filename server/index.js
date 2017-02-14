const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const IOServer = require('./IOServer');

const ioserver = new IOServer(io);
const PORT = process.env.PORT || 8888;

http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
