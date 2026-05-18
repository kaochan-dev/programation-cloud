const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/info', (req, res) => {
  res.json({
    date: new Date().toISOString(),
    hostname: os.hostname(),
    message: 'demo 2.0 ci/cd updated mai 2026'
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
