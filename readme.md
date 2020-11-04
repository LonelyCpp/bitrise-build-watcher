A lightweight CLI to start and monitor builds on bitrise

I use it to trigger builds from my gitlab pipelines and poll for the build status.

### What it does

- start a build
- poll for the status
- correctly end the process based on the build result
- download artifacts if any

### CLI

- `-k` or `--apiKey` - bitrise API key
- `-s` or `--appSlug` - bitrise app slug
- `-w` or `--workflow`- bitrise workflow to trigger
- `-c` or `--commitHash` - run build on this commit hash
- `-i` or `--interval` - [optional] poll interval (default 1 minute)
