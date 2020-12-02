const parseArgs = require("minimist");
const BitriseApi = require("./BitriseApi");
const util = require("./util");

async function main(cliArgs) {
  const args = parseArgs(cliArgs);

  const noPoll = args.noPoll;
  const apiKey = args.k || args.apiKey;
  const appSlug = args.s || args.appSlug;
  const workflow = args.w || args.workflow;
  const branchName = args.b || args.branch;
  const commitHash = args.c || args.commitHash;
  const interval = args.i || args.interval || 60000;
  const artifactFolder = args.a || args.artifactFolder;

  if (!commitHash || !apiKey || !appSlug || !workflow || !branchName) {
    console.log("missing required keys", args);
    throw "missing required keys";
  }

  const api = new BitriseApi(apiKey, appSlug);

  const accInfo = await api.getAppInfo();
  console.log(`triggering job on project ${accInfo.data.title}`);
  console.log("-----------------------------------------------");

  const buildData = await api.triggerBuild(commitHash, branchName, workflow);
  const buildUrl = buildData.build_url;
  const buildSlug = buildData.build_slug;

  console.log(`job created at : ${buildUrl}`);

  if (noPoll) {
    return;
  }

  let buildStatus;

  while (true) {
    buildStatus = await api.getBuildStatus(buildSlug);
    buildStatus = buildStatus.data;

    const statusCode = buildStatus.status;
    const finishedAt = buildStatus.finished_at;
    const statusText = buildStatus.status_text;
    const now = new Date().toISOString();

    console.log(`${now} : ${statusText} : ${statusCode}`);

    if (finishedAt) {
      console.log(
        `job finished at ${finishedAt} with status code ${statusCode}`
      );
      break;
    }

    await util.sleep(interval);
  }

  try {
    const log = await api.getBuildLog(buildSlug);
    console.log(log);
  } catch (error) {
    console.log("could not fetch build log");
  }

  try {
    console.log("downloading artifacts");
    const artifacts = await api.getArtifactList(buildSlug);
    for (let i = 0; i < artifacts.length; i++) {
      const item = artifacts[i];
      console.log("downloading", item.title);

      try {
        await api.downloadArtifact(buildSlug, item.slug, artifactFolder);
      } catch (error) {
        console.log("could not fetch build artifact : ", item);
      }
    }
  } catch (error) {
    console.log("could not fetch build artifacts");
  }

  if (buildStatus.status_text !== "success") {
    throw buildStatus.status;
  }
}

module.exports = main;
