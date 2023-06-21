module.exports = {
    apps :
    [
        {
            name: '{{project}}_store_queue_inplay',
            script: './STORE_QUEUE_INPLAY_STM/bin/www',
            instances: 1,
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            output:"/var/log/{{project}}_store_inplay-out.log",
            error:"/var/log/{{project}}_store_inplay-error.log",
            env_production:
            {
                NODE_ENV: "production"
            }
        },
        {
            name: '{{project}}_inplay_stm',
            script: './STORE_INPLAY_STM/bin/www',
            instances: 1,
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            output:"/var/log/{{project}}_inplay_stm-out.log",
            error:"/var/log/{{project}}_inplay_stm-error.log",
            env_production:
            {
                NODE_ENV: "production",
            }
        },
        {
            name: '{{project}}_queue_prematch',
            script: './STORE_QUEUE_PREMATCH_STM/bin/www',
            instances: 1,
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            output:"/var/log/{{project}}_queue_prematch-out.log",
            error:"/var/log/{{project}}_queue_prematch-error.log",
            env_production:
            {
                NODE_ENV: "production",
            }
        },
        {
            name: '{{project}}_prematch_stm',
            script: './STORE_PREMATCH_STM/bin/www',
            instances: 1,
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            output:"/var/log/{{project}}_prematch_stm-out.log",
            error:"/var/log/{{project}}_prematch_stm-error.log",
            env_production:
            {
                NODE_ENV: "production",
            }
        }
    ],
    deploy :
    {
        production :
        {
            'user'              : 'SSH_USERNAME',
            'host'              : 'SSH_HOSTMACHINE',
            'ref'               : 'origin/master',
            'repo'              : 'GIT_REPOSITORY',
            'path'              : 'DESTINATION_PATH',
            'pre-deploy-local'  : '',
            'post-deploy'       : 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup'         : ''
        }
    }
};