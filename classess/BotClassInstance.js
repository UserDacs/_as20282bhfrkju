const PatchClass    = require('../classess/PatchClass');
const DevClass      = require('../classess/DevClass');
const axios         = require('axios');
const system_config = require('../system_config');

module.exports      = class BotClassInstance
{
    constructor(bot, chat_id, sender_info)
    {
        this.bot                = bot;
        this.chat_id            = chat_id;
        this.sender_info        = sender_info;
        this.mode               = null;
        this.project            = "";
        this.patch_class        = new PatchClass(bot, chat_id, sender_info);
        this.dev_class          = new DevClass(bot, chat_id, sender_info);
    }
    async messageReceived(message_detail)
    {
        let message             = message_detail.text;

        // reset command to reset the mode
        if(message.startsWith('/main_menu'))
        {
            this.mode       = null;
        }
        // patch mode
        else if(message.startsWith('/patch_'))
        {
            this.mode       = "patch";
            this.project    = message.replace("/patch_", "");
        }
        // dev mode
        else if(message.startsWith('/dev_'))
        {
            this.mode       = "dev";
            this.project    = message.replace("/dev_", "");
        }
        else if(message.startsWith('/view_url'))
        {
            this.mode       = "view_url";
        }
        //  if mode has been chosen
        switch (this.mode)
        {
            case "patch":
                this.patch_class.messageReceived(message_detail, this.project);
            break;

            case "dev":
                this.dev_class.messageReceived(message_detail, this.project);
            break;

            case "view_url":
                this.sendListOfWebsite();
            break;
        
            default:
                this.sendDefaultResponse();
            break;
        }
    }
    async sendListOfWebsite()
    {
        // initialize variables
        let projects            = getRef('project');
        let send_message        = "";

        // construct message

        for(let project of projects)
        {
            send_message        += `\n\n***Staging Website for ${project.label}***`;
            send_message        += `\n- Front: ${system_config.domain}:${project.port}`;
            send_message        += `\n- Admin: ${system_config.domain}:${project.admin_port}`;
        }
       
        // send_message        += `\n\n***Patching Server Commands:***`;

        // for(let project of projects)
        // {
        //     send_message        += `\n[/patch_${project.id}] - patch ${project.label.toLowerCase()}`;
        // }

        send_message        += `\n\n***Other Commands***`;
        send_message        += `\n[/view_url] - view all website URL`;
        send_message        += `\n[/main_menu] - back to main list of commands`;
        send_message        += `\n[/broadcast] - post an announcement`;

        // send the message
        this.bot.realSendMessage(this.chat_id, send_message);
    }
    async sendDefaultResponse()
    {
        // initialize variables
        let projects            = getRef('server');
        let send_message        = "";

        // construct message
        send_message        += `Hi [@${this.sender_info.username}], I am Ground Link Bot! I hold the power to access the ***Control Tower*** of Ground Link.`;
        send_message        += `\n\nYou can control me by sending these commmands:`;
        send_message        += `\n\n***Development Server Controls:***`;

        for(let project of projects)
        {
            send_message        += `\n[/dev_${project.id}] - manage dev ${project.label.toLowerCase()}`;
        }
       
        // send_message        += `\n\n***Patching Server Commands:***`;

        // for(let project of projects)
        // {
        //     send_message        += `\n[/patch_${project.id}] - patch ${project.label.toLowerCase()}`;
        // }

        send_message        += `\n\n***Manage Permissions:***`;
        send_message        += `\n[/permission_view] - view access`;
        send_message        += `\n[/permission_add] - add permission to user`;

        send_message        += `\n\n***Other Commands***`;
        send_message        += `\n[/view_url] - view all website URL`;
        send_message        += `\n[/main_menu] - back to main list of commands`;
        send_message        += `\n[/broadcast] - post an announcement`;

        // send the message
        this.bot.realSendMessage(this.chat_id, send_message);
    }
}