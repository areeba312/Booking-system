const express = require('express');
const logger = require('./src/middleware/logger');
const { notFound, errorHandler } = require('./src/middleware/errors');

async function createApp() {
  const app = express();

  app.use(logger);
  app.use(express.json());
  // Express 5: body undefined hoti hai agar request mein body na ho
  app.use((req, res, next) => {
    if (req.body === undefined) req.body = {};
    next();
  });
  app.use(express.static('public'));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/v1', require('./src/routes'));

  // GraphQL (Q4) - same services as REST
  await require('./graphql/mount')(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
