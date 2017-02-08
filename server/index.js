const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const StoreServer = require('./StoreServer');

const PORT = process.env.PORT || 8888;

const store = new StoreServer(io);

// io.on('connection', (socket) => {
//   console.log('StoreServer connected');

//   socket.on('dash conn', (dashId) => {
//     console.log(dashId);
//   });
// });

http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
