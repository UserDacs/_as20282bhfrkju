const TelegramBot           = require('node-telegram-bot-api');
const BotClassInstance      = require('../classess/BotClassInstance');

module.exports      = class BotClass
{
    constructor()
    {
        this.token                  = '5883190534:AAEKn_JTiFUUMvLXFqUnRO8bM6xpDdhFzkI';
        this.bot                    = new TelegramBot(this.token, { polling: true });
        this.bot.realSendMessage    = async (chat_id, message, parse_mode = "markdown") =>
        {
            let send_message = message;

            if(parse_mode == "code")
            {
                let limit = 4000;

                if(message.length > limit)
                {
                    message = message.substring(0, limit);
                }

                if(send_message.trim() == "")
                {
                    send_message = "Empty Result";
                }
                else
                {
                    send_message    = message;
                }
    
                parse_mode      = null; 
            }

            await this.bot.sendMessage(chat_id, send_message,  { parse_mode: parse_mode });
        }

        this.chat_instances     = {};
    }
    catchMessages()
    {
        this.bot.on('message', (message_detail) =>
        {
            let chat_id         = message_detail.chat.id;

            console.log(chat_id, message_detail.text);

            if(!this.chat_instances.hasOwnProperty(chat_id))
            {
                this.chat_instances[chat_id] = new BotClassInstance(this.bot, chat_id, message_detail.from);
            }

            this.chat_instances[chat_id].messageReceived(message_detail);
        });
    }
}