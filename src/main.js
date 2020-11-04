#!/usr/bin/env node

const parseArgs = require("minimist");
const BitriseApi = require("./BitriseApi");
const util = require("./util");

async function main(cliArgs) {
  const args = parseArgs(cliArgs);

  const apiKey = args.k || args.apiKey;
  const appSlug = args.s || args.appSlug;
  const workflow = args.w || args.workflow;
  const commitHash = args.c || args.commitHash;
  const interval = args.i || args.interval || 60000;

  if (!commitHash || !apiKey || !appSlug || !workflow) {
    process.exit(1);
  }

  const api = new BitriseApi(apiKey, appSlug);

  const accInfo = await api.getAppInfo();
  console.log(`triggering job on project ${accInfo.data.title}`);
  console.log("-----------------------------------------------");

  const jobData = await api.triggerBuild(commitHash, workflow);

  console.log(`job created at : ${jobData.build_url}`);

  let jobStatus;

  while (true) {
    jobStatus = await api.getBuildStatus(jobData.build_slug);
    jobStatus = jobStatus.data;

    const finishedAt = jobStatus.finished_at;
    const statusText = jobStatus.status_text;
    const now = new Date().toISOString();

    console.log(`${now} : ${statusText}`);

    if (finishedAt) {
      console.log(
        `job finished at ${finishedAt} with status code ${jobStatus.status}`
      );
      break;
    }

    await util.sleep(interval);
  }

  if (jobStatus.status_text !== "success") {
    throw jobStatus.status;
  }
}

module.exports = main;
