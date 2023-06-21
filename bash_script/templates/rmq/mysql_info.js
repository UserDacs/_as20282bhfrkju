
let devDBbInfo =
{
    connectionLimits: 10,
    host: '{{host_ip}}',
    port: {{mysql_port}},             
    user: '{{mysql_user}}',
    password: '{{mysql_password}}',
    database: '{{db_mydb}}',
    debug: false,
    charset: 'UTF8_GENERAL_CI',
    timezone: '+0900', 
    multipleStatements: true,
    dateStrings: 'DATETIME'
};

module.exports.devDBbInfo = devDBbInfo;

let prodDBbInfo =
{
    connectionLimits: 10,
    host: '{{host_ip}}',
    port: {{mysql_port}},              
    user: '{{mysql_user}}',
    password: '{{mysql_password}}',
    database: '{{db_mydb}}',
    debug: false,
    charset: 'UTF8_GENERAL_CI',
    timezone: '+0900', 
    multipleStatements: true,
    dateStrings: 'DATETIME'
};

module.exports.prodDBbInfo = prodDBbInfo;