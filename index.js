/////////////////////////
// GitHub Hook Service //
/////////////////////////

var http = require('http');
var deployer = require('./deployer');

// Create the GitHub Hook Service server to catch all incoming requests from GitHub
http.createServer(function (req, res) {
	console.log('Request received.');
	console.log('Running validations.');

	// Check if the request method is POST
	if (req.method.toUpperCase() !== 'POST') return res.end('Request is not a POST.');

	// Get the request headers
	var headers = req.headers;

	// Get user agent to check if request is from GitHub
	var user_agent = headers['user-agent'];
	if (!/^GitHub-Hookshot/.test(user_agent)) return res.end('Request is not from GitHub.');

	// Check if GitHub Hook event is push
	if (headers['x-github-event'] !== 'push') return res.end('Request is not from a "push" event hook.');

	console.log('Initial validations complete.');
	console.log('Retrieving payload');

	// If request passed all initial validations, proceed with getting the payload
	var data = '';
	req.on('data', function (chunk) {
		data += chunk;
	});

	// After request is finished, process payload
	req.on('end', function () {
		console.log('Request ended.');
		console.log('Payload retrieved.');
		
		// If there's no payload, tell 'em something has gone wrong
		if (data === '') return res.end('No data received mate.');

		console.log('Processing payload.');

		// Parse payload if it exists
		var parsedData = JSON.parse(data);

		// Get repository
		var repository = parsedData.repository;

		// Get hook reference branch
		var branch = parsedData.ref.split('/')[2];

		deployer.deploy(repository, branch, function (err) {
			console.log(err);
		});
	});

	// Tell GitHub a nice piratey cheer after everything is complete!
	return res.end('Yoho pirate!');
}).listen(22539);

console.log('GitHub WebHook Service running on port 22539');