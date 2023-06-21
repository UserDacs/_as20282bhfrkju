module.exports      = class PatchClass
{
    constructor(bot, chat_id, sender_info)
    {
        this.bot            = bot;
        this.chat_id        = chat_id;
        this.sender_info    = sender_info;
        this.project_info   = {};
        this.patch_title    = "";
        this.mode           = "choose_patch_type";
    }
    messageReceived(message_detail, project)
    { 
        this.project_info   = getRef("project", "id", project);
        let message         = message_detail.text;

        // check if patch type has been chosen
        if(['/front_dev', '/admin_dev', '/front_live', '/admin_live'].indexOf(message) > -1)
        {
            this.mode       = "enter_patch_description";
            
            // execute based on the patch type
            switch (message)
            {
                case "/front_dev":
                    this.patch_title = `${this.project_info.label} Dev Front Server`;
                break;

                case "/admin_dev":
                    this.patch_title = `${this.project_info.label} Dev Admin Server`;
                break;

                case "/front_live":
                    this.patch_title = `${this.project_info.label} Live Front Server`;
                break;

                case "/admin_live":
                    this.patch_title = `${this.project_info.label} Live Admin Server`;
                break;
            }
        }
        else if(['/confirm'].indexOf(message) > -1)
        {
            this.mode = "patch_success";
        }
        else
        {
            this.mode = "choose_patch_type";
        }

        switch (this.mode)
        {
            case "choose_patch_type": this.choosePatchTypeResponse(); break;
            case "enter_patch_description": this.enterPatchDescriptionResponse(); break;
            case "patch_success": this.patchSuccessResponse(); break;
        }
    }
    async choosePatchTypeResponse()
    {
        let send_message    = "";
        send_message        += `You have decided to patch ***${this.project_info.label}***.`;
        send_message        += `\n\n***Choose patch mode:***`;
        send_message        += `\n[/front_dev] - patch on dev server front`;
        send_message        += `\n[/admin_dev] - patch on dev server admin`;
        send_message        += `\n[/front_live] - patch on live server front`;
        send_message        += `\n[/admin_live] - patch on live server admin`;
        send_message        += `\n\nYou can always go back to the main ***list of commands*** using the [/main_menu] command.`;

        this.bot.realSendMessage(this.chat_id, send_message);
    }
    async enterPatchDescriptionResponse()
    {
        let send_message    = "";
        send_message        += `\n***${this.patch_title} Patch***  will initiate.\n\nThe only way to cancel this patch is by using the command [/main_menu]. Please take note that patching be revertable but there will always be an effect on the server the moment you upload it.\n\nIf you are sure you would like to patch then please use the [/confirm] command.`;

        this.bot.realSendMessage(this.chat_id, send_message);
    }
    async patchSuccessResponse()
    {
        let send_message    = "";
        send_message        += `\n***${this.patch_title}*** patch was succesful!\n\nPlease use the [/main_menu] command in order to go back to the main menu.`;

        this.bot.realSendMessage(this.chat_id, send_message);
    }
}