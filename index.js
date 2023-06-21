
const BotClass              = require('./classess/BotClass');
const system_config         = require('./system_config');

// these are global methods that are accessibile everywhere
require('./globals/global_methods');

// initialize a Bot Catcher
let bot_class = new BotClass();
bot_class.catchMessages();

console.log("Telegram Bot: Running!");