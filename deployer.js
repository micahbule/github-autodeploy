var async = require('async');
var shell = require('shelljs');
var mkdirp = require('mkdirp');
var projects = require('./projects');
var config = require('./config');

exports.deploy = function (repository, branch, callback) {
	var checkRepository = function (project, cb) {
		return cb(project.repository === repository.full_name && project.branch_to_watch === branch);
	}
	
	console.log('Searching for', repository.full_name + '...');
	
	async.detect(projects, checkRepository, function (project) {
		if (!project) return callback('No matching project with received GitHub hook or reference branch and branch to watch does not match.');
		
		console.log('Project found.');

		var root_deployment_path = config.root_deployment_path;
		var project_directory_path = root_deployment_path + project.name;

		async.waterfall([
			// Go to project directory, if it exists
			function (cb) {
				shell.cd(project_directory_path);
				cb();
			},
			// If project directory does not exist, create and pull the repository
			function (cb) {
				if (shell.error()) {
					mkdirp(project_directory_path, null, function (err, made) {
						if (err) return console.log(err);
						console.log('Created', made);

						shell.cd(project_directory_path);
						shell.exec('git init');
						shell.exec('git remote add origin git@github.com:' + project.repository + '.git');
						shell.exec('git pull -u origin ' + project.branch_to_watch, function (code, output) {
							shell.exec('git branch --set-upstream-to=origin/' + project.branch_to_watch);
							cb();
						});
					});
				} else {
					cb();
				}
			},
			// Pull updates from GitHub
			function (cb) {
				shell.exec('git pull', function (code, output) {
					cb();
				});
			},
			// Execute build commands
			function (cb) {
				var commands = project.build_commands;
				
				if (commands && commands.length) {
					for (var i in commands) {
						var command = commands[i];
						
						console.log('Executing command:', command)
						shell.exec(command);
					}
				}
				
				cb();
			}
		], function (err, results) {
			console.log('All automated deployment tasks for', project.name, 'project have been completed!');
			callback();
		});
	});
}