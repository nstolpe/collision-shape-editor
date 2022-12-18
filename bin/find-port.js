#!/usr/bin/env node
const portfinder = require('portfinder');

portfinder.getPort({ port: 3000 }, (err, port) => {
  process.stdout.write(`${port}\n`);
});
