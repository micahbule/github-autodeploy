module.exports = [
    {
        name: 'project_name',
        repository: 'User/repository-name',
        branch_to_watch: 'master',
        commands_to_run: [
            'npm install',
            'bower install --allow-root'
        ]
    }
];