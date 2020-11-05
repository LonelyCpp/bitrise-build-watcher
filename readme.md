A lightweight CLI to start and monitor builds on bitrise

I use it to trigger builds from my gitlab pipelines and poll for the build status.

### What it does

- start a build
- poll for the status
- correctly end the process based on the build result
- download artifacts if any

### CLI

`npx github:LonelyCpp/bitrise-build-watcher`

**options**

| option                 | required | description                      |
| ---------------------- | -------- | -------------------------------- |
| `-k` or `--apiKey`     | yes      | bitrise API key                  |
| `-s` or `--appSlug`    | yes      | bitrise app slug                 |
| `-w` or `--workflow`   | yes      | bitrise workflow to trigger      |
| `-c` or `--commitHash` | yes      | run build on this commit hash    |
| `-i` or `--interval`   | no       | poll interval (default 1 minute) |
