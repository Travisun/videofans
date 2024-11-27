module.exports = {
    apps: [
        {
            name: 'frontend',
            script: 'npm',
            args: 'start',
            cwd: './client'
        },
        {
            name: 'backend',
            script: 'node',
            args: 'server.js',
            cwd: './server'
        }
    ]
}