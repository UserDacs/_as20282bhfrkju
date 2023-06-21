global.system_config        = require('../system_config');
const { exec }              = require("child_process");

global.getConfig            = () =>
{
    let config = process.env;
    return config;
}

global.executeBashScript = async (script, args = "") =>
{
    args = args.replace(/[\r\n]/gm, '');
    args = args.replace(/\s/g, '');
    args = args.replaceAll('^', ' ');
    
    return  new Promise(function(resolve, reject)
    {
        exec(`./bash_scripts/${script}.sh ${args}`, { stdio: 'ignore' }, (error, stdout, stderr) =>
        {
            return resolve(stdout);
        }); 
    });
}

global.wait = (ms) =>
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

global.getRef = (key, find = null, value = null) => 
{
    let reference = require(`../refs/ref_${key}.js`);

    if(!find)
    {
        return reference;
    }
    else
    {
        return reference.find(data => data[find] == value);
    }
}

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 