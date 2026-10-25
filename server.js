require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const createApp = require('./app');
const { initSocket } = require('./src/socket');

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Database connected');
    const app = await createApp();
    const server = http.createServer(app);
    initSocket(server); // Q5: Socket.IO
    server.listen(PORT, () => {
      console.log('Server is running on port ' + PORT);
    });
  })
  .catch((err) => {
    console.error('Startup failed:', err.message);
  });
