const app = require('./app');
const httpServer = require('http').Server(app);
const socketIO = require('socket.io');
const uws = require('uws');
const io = socketIO(httpServer);
const IOServer = require('./IOServer');

io.ws = new uws.Server({ perMessageDeflate: false });
global.ioserver = new IOServer(io);

const PORT = process.env.PORT || 8888;

http.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening on port ${PORT}!`);
});
