# GitHub Deployment Automation Script

This is a simple automated deployment script to be used in conjunction to GitHub.

NodeJS >= v10.x is required to run this script.

## Setup & Configuration

1. Run `npm install` to download dependencies.
2. Open `projects.js` file. It exports an array of objects that contains metadata of your GitHub projects. The following metadata fields are:
	- name: The name of your project
	- repository: The repository URL (omit the http://github.com)
	- branch_to_watch: The branch to watch for changes for the automatic deployment
    - build_commands: The commands you need to execute after a successful `git pull`
3. Open `config.js` to specify the port to use and the directory where projects will be deployed.