const fetch = require("node-fetch");

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

  triggerBuild = async (commitHash, workflow) => {
    const body = {
      hook_info: {
        type: "bitrise",
      },
      build_params: {
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
}

module.exports = BitriseApi;
