module.exports = [
    {
        name: 'project_name',
        repository: 'User/repository-name',
        branch_to_watch: 'master',
        build_commands: [
            'npm install',
            'bower install --allow-root'
        ]
    }
];