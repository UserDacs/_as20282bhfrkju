let redisInfo =
{
    host: '{{host_ip}}',
    port: {{redis_port}},
    family: 4,
    password: '',
    db: 0,
    expire : 300 // second
};

module.exports.redisInfo = redisInfo;