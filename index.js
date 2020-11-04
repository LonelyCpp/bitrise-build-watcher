#!/usr/bin/env node

const main = require("./src/main");

const args = process.argv.slice(2);
main(args)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
