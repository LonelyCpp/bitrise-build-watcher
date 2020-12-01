const fs = require("fs");
const fetch = require("node-fetch");
const { downloadFile } = require("./util");

const ARTIFACTS_PATH_DEFAULT = "./build_artifacts";

class BitriseApi {
  constructor(apiKey, appSlug) {
    this.authHeader = { Authorization: apiKey };
    this.appSlug = appSlug;
  }

  getAppInfo = async () => {
    const res = await fetch(
      `https://api.bitrise.io/v0.1/apps/${this.appSlug}`,
      { headers: this.authHeader }
    );
    return await res.json();
  };

  triggerBuild = async (commitHash, branchName, workflow) => {
    const body = {
      hook_info: {
        type: "bitrise",
      },
      build_params: {
        branch: branchName,
        workflow_id: workflow,
        commit_hash: commitHash,
      },
    };

    const res = await fetch(
      `https://api.bitrise.io/v0.1/apps/${this.appSlug}/builds`,
      {
        method: "post",
        headers: this.authHeader,
        body: JSON.stringify(body),
      }
    );
    return await res.json();
  };

  getBuildStatus = async (buildSlug) => {
    const res = await fetch(
      `https://api.bitrise.io/v0.1/apps/${this.appSlug}/builds/${buildSlug}`,
      { headers: this.authHeader }
    );
    return await res.json();
  };

  getBuildLog = async (buildSlug) => {
    const res = await fetch(
      `https://api.bitrise.io/v0.1/apps/${this.appSlug}/builds/${buildSlug}/log`,
      { headers: this.authHeader }
    );
    const data = await res.json();

    const logRes = await fetch(data.expiring_raw_log_url);
    return logRes.text();
  };

  getArtifactList = async (buildSlug) => {
    const res = await fetch(
      `https://api.bitrise.io/v0.1/apps/${this.appSlug}/builds/${buildSlug}/artifacts`,
      { headers: this.authHeader }
    );
    const data = await res.json();
    return data.data;
  };

  downloadArtifact = async (buildSlug, artifactSlug, folderPath) => {
    const res = await fetch(
      `https://api.bitrise.io/v0.1/apps/${this.appSlug}/builds/${buildSlug}/artifacts/${artifactSlug}`,
      { headers: this.authHeader }
    );
    const data = await res.json();

    const name = data.data.title;
    const downloadUrl = data.data.expiring_download_url;

    const folder = folderPath || ARTIFACTS_PATH_DEFAULT;
    const filePath = `${ARTIFACTS_PATH_DEFAULT}/${name}`;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    await downloadFile(downloadUrl, filePath);
  };
}

module.exports = BitriseApi;
