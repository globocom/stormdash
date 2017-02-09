const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const StoreServer = require('./StoreServer');

const store = new StoreServer(io);
const PORT = process.env.PORT || 8888;

http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
