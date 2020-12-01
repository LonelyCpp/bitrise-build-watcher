const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const streamPipeline = util.promisify(require("stream").pipeline);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadFile(url, path) {
  console.log({ url, path });
  const response = await fetch(url);

  if (response.ok) {
    return streamPipeline(response.body, fs.createWriteStream(path));
  }

  throw new Error(`unexpected response ${response.statusText}`);
}

module.exports = { sleep, downloadFile };
