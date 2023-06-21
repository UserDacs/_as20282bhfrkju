const system_config = require("../system_config");
const fs            = require('fs');
const axios         = require('axios');

module.exports      = class DevClass
{
    constructor(bot, chat_id, sender_info)
    {
        this.bot                        = bot;
        this.chat_id                    = chat_id;
        this.sender_info                = sender_info;
        this.project_info               = {};
        this.server_info                = {};
        this.patch_title                = "";
        this.mode                       = "choose_command";
        this.root_project_path          = "/www";
        this.template_docker_compose    = "./bash_scripts/templates/docker-compose-projects.yml";
        this.template_front_development = "./bash_scripts/templates/front/development.php";
        this.template_front_index       = "./bash_scripts/templates/front/index.php";
        this.template_front_app         = "./bash_scripts/templates/front/App.php";
        this.template_admin_base_define = "./bash_scripts/templates/admin/base_define.php";
        this.template_admin_login       = "./bash_scripts/templates/admin/login.php";
        this.template_admin_class_redis = "./bash_scripts/templates/admin/class_redis.php";
        this.args                       = {};
        this.docker_file_name           = "";
        this.confirmation               = false;
    }
    async messageReceived(message_detail, server)
    { 
        this.project_info               = getRef("server", "id", server);
        let specific_project            = getRef("project", "id", this.project_info.project);
        this.__switchProject(specific_project);

        this.project_info.db_mydb       = `mydb_${this.project_info.project}`;
        this.project_info.db_main       = `main_${this.project_info.project}_db`;
        this.project_info.db_log        = `log_db`;
        let message                     = message_detail.text;
        this.docker_file_name           = `docker-compose-${this.project_info.id}.yml`;

        this.__updateArgs();

        // change mode depending on the message
        if(['/reset_server'].indexOf(message) > -1)
        {
            this.mode = "confirm_build_server";
        }
        else if(['/reset_database'].indexOf(message) > -1)
        {
            this.mode = "confirm_build_database";
        }
        else if(['/reconfig'].indexOf(message) > -1)
        {
            this.mode = "confirm_reconfig";
        }
        else if(['/pull_latest'].indexOf(message) > -1)
        {
            await this.__runScript('pull-latest');
        }
        else if(['/debug'].indexOf(message) > -1)
        {
            await this.__runScript('debug');
            await this.bot.realSendMessage(this.chat_id, "<pre>" + JSON.stringify(this.project_info) + "</pre>", "html");
            await this.bot.realSendMessage(this.chat_id, this.args, "html");
        }
        else if(['/start_live_rmq'].indexOf(message) > -1)
        {
            await this.__startLiveRMQ();
        }
        else if(message.startsWith('/change_branch'))
        {
            let desired_branch = message.replace('/change_branch', '').trim();

            if(desired_branch)
            {
                await this.__switchBranch(desired_branch);
            }
            else
            {
                this.mode = "choose_branch";
            }
        }
        else if(message.startsWith('/switch_project'))
        {
            let desired_project = message.replace('/switch_project', '').trim();

            if(desired_project)
            {
                desired_project                 = desired_project.replace('_', '').trim();

                await this.__switchProjectDev(desired_project);

                this.mode       = "choose_command";
            }
            else
            {
                this.mode       = "choose_project";
            }
        }
        else if(['/reset_server_confirm'].indexOf(message) > -1)
        {
            this.mode = "choose_command";
            await this.__buildServer();
        }
        else if(['/reset_database_confirm'].indexOf(message) > -1)
        {
            this.mode = "choose_command";
            await this.__runScript('setup-database');
        }
        else if(['/reconfig_confirm'].indexOf(message) > -1)
        {
            this.mode = "choose_command";
            await this.__reconfigProject();
        }
        else
        {
            this.mode = "choose_command";
        }

        // output message depending on mode
        switch (this.mode)
        {
            case "confirm_build_server": this.__sendConfirmationMessage("You will lose all changes and settings that you have made and you will revert back to the initial setup of this project. If you changed any code, those codes will be restored from the main branch. Is that okay?", "reset_server_confirm"); break;
            case "confirm_build_database": this.__sendConfirmationMessage("Database reset will delete all the data and restore it to default. Is that okay?", "reset_database_confirm"); break;
            case "confirm_reconfig": this.__sendConfirmationMessage("Reconfig will reset settings of database, redis and other stuff. Is that okay?", "reconfig_confirm"); break;
            case "choose_command": this.__chooseCommand(); break;
            case "choose_branch": this.__chooseBranch(); break;
            case "choose_project": this.__chooseProject(); break;
        }
    }
    async __switchProjectDev(desired_project)
    {
        let project_info    = getRef('project', 'id', desired_project);
        await this.__switchProject(project_info);
        this.__updateArgs();
        await this.__buildServer();
    }
    async __chooseProject()
    {
        let choose_project_message = "<b>Choose Project:</b>";
        let projects                = getRef('project');

        for(let project of projects)
        {
            if(!project.developer)
            {
                choose_project_message += `\n/switch_project_${project.project} - ${project.label}`;
            }
        }

        await this.bot.realSendMessage(this.chat_id, choose_project_message, 'html');
    }
    async __switchProject(project_info)
    {
        this.project_info.project           = project_info.project;
        this.project_info.front_username    = project_info.front_username;
        this.project_info.front_password    = project_info.front_password;
        this.project_info.admin_username    = project_info.admin_username;
        this.project_info.admin_password    = project_info.admin_password;
        this.project_info.server_name       = project_info.server_name;
        this.project_info.branch_main       = project_info.branch_main;
        this.project_info.branch_release    = project_info.branch_release;
        this.project_info.db_mydb           = `mydb_${project_info.project}`;
        this.project_info.db_main           = `main_${project_info.project}_db`;
        this.project_info.db_log            = `log_db`;
    }
    async __startLiveRMQ()
    {
        this.__updateArgsRMQ();  
        await this.__runScript('setup-rmq');
        await this.__reconfigRMQ();
        await this.__runScript('start-rmq');
    }
    async __updateArgs()
    {
        this.args =     `   -f^'${this.project_info.port}'^
                            -a^'${this.project_info.admin_port}'^
                            -l^'${this.project_info.label}'^
                            -d^'${system_config.domain}'^
                            -r^'${system_config.bet_repository}'^
                            -p^'${this.project_info.id}'^
                            -n^'${this.docker_file_name}'^
                            -m^'${system_config.mysql_user}'^
                            -w^'${system_config.mysql_password}'^
                            -y^'${this.project_info.db_mydb}'^
                            -z^'${this.project_info.db_main}'^
                            -b^'${this.project_info.branch_main}'^
                            -c^'${this.project_info.branch_release}'^`;
    }
    async __updateArgsRMQ()
    {
        this.args =     `   -p^'${this.project_info.project}'^
                            -d^'${system_config.domain}'^
                            -r^'${system_config.rmq_repository}'^
                            -l^'${this.project_info.label}'^`;
    }
    async __chooseBranch()
    {
        this.mode = "choose_command";

        await this.bot.realSendMessage(this.chat_id, `You have decided to change the  branch of <b>${this.project_info.label} Dev Server</b>. Kindly choose your desired branch:`, 'html');
        await this.__runScript('choose-branch', true, false);
        await this.bot.realSendMessage(this.chat_id, `In order to change the branch kindly please use the command <code>/change_branch</code> followed by the branch that you wanted to use. For example you would like to use the <code>main</code> branch then the command is <code>/change_branch main</code>.`, 'html');
    }
    async __chooseCommand()
    {
        let front_url       = `${system_config.domain}:${this.project_info.port}`;
        let admin_url       = `${system_config.domain}:${this.project_info.admin_port}`;
        let phpmyadmin_url  = `${system_config.domain}:${system_config.phpmyadmin_port}`;

        let send_message    = "";
        send_message        += `Welcome to <b>${this.project_info.label} Dev Server</b> Control Tower. You can see a brief summary of the server below.`;
        send_message        += `\n`;
        send_message        += `\n<b>URL for Front (${this.project_info.port}):</b>`;
        send_message        += `\n${front_url}`;
        send_message        += `\n<b>URL for Admin (${this.project_info.admin_port}):</b>`;
        send_message        += `\n${admin_url}`;
        send_message        += `\n<b>URL for Database Access:</b>`;
        send_message        += `\n${phpmyadmin_url}`;
        send_message        += `\n`;
        send_message        += `\n<b>Website Configurations:</b>`;
        send_message        += `\nBranch: <i>${this.project_info.branch_release}</i>`;
        send_message        += `\nDatabase: <i>${this.project_info.db_mydb}</i>`;
        send_message        += `\nMain DB: <i>${this.project_info.db_main}</i>`;
        send_message        += `\nLog DB: <i>${this.project_info.db_log}</i>`;
        send_message        += `\n`;
        send_message        += `\n<b>Website Commands:</b>`;
        send_message        += `\n/change_branch - change branch of project`;
        send_message        += `\n/reconfig - reconfig settings of project`;
        send_message        += `\n/pull_latest - pull latest commits`;
        send_message        += `\n/stop_server - this stops the server`;
        send_message        += `\n/reset_server - restore server to default`;
        send_message        += `\n/start_live_rmq - start Live RMQ`;
        send_message        += `\n/stop_live_rmq - stop Live RMQ`;
        send_message        += `\n/reset_database - restore database to default`;
        send_message        += `\n/switch_project - change project`;
        send_message        += `\n/debug - Check Debug Information`;

        send_message        += `\n/main_menu - back to main list of commands`;

        this.bot.realSendMessage(this.chat_id, send_message, 'html');
    }
    async __buildServer()
    {
        await this.bot.realSendMessage(this.chat_id, `Resetting ***${this.project_info.label} Dev Server***`);
        await this.__runScript('stop-server');
        await this.__runScript('clone-project');

        await this.__reconfigProject();
        await this.__runScript('build-server');
        await this.bot.realSendMessage(this.chat_id, `Server Reset for ***${this.project_info.label} Dev Server*** has been successful!`);
    }
    async __switchBranch(branch)
    {
        await this.bot.realSendMessage(this.chat_id, `Switching Branch for ***${this.project_info.label} ***`);
        this.project_info.branch = branch; 
        this.__updateArgs();
        await this.__runScript('switch-branch');
        await this.__reconfigProject();
        await wait(1000);
        await this.bot.realSendMessage(this.chat_id, `Switched branch to <code>${branch}</code>`, 'html');
    }
    async __runScript(execute_script, hide_title = false, hide_output = true)
    {
        if(!hide_title)
        {
            await this.bot.realSendMessage(this.chat_id, `Executing: <code>${execute_script}.sh</code>`, 'html'); 
        }
  
        let script_response = await executeBashScript(execute_script, this.args);

        if(!hide_output)
        {
            await this.bot.realSendMessage(this.chat_id, script_response, 'code'); 
        }
    }
    async __reconfigRMQ()
    {
        await this.__reconfigFileUpdate("./bash_scripts/templates/rmq/ecosystem.config.js", `${this.root_project_path}/${this.project_info.project}_rmq/ecosystem.config.js`);
        await this.__reconfigFileUpdate("./bash_scripts/templates/rmq/mysql_info.js", `${this.root_project_path}/${this.project_info.project}_rmq/RMQ_Lib/mysql_info.js`);
        await this.__reconfigFileUpdate("./bash_scripts/templates/rmq/redis_info.js", `${this.root_project_path}/${this.project_info.project}_rmq/RMQ_Lib/redis_info.js`);
        await this.bot.realSendMessage(this.chat_id, 'Executed: `__reconfigRMQ()`', 'markdown');
    }
    async __reconfigProject()
    {
        await this.__reconfigFileUpdate(this.template_docker_compose, `./bash_scripts/temp/${this.docker_file_name}`);
        await this.__reconfigFileUpdate(this.template_front_development, `${this.root_project_path}/${this.project_info.id}/projectt-server/app/Config/Boot/development.php`);
        await this.__reconfigFileUpdate(this.template_front_index, `${this.root_project_path}/${this.project_info.id}/projectt-server/public/index.php`);
        await this.__reconfigFileUpdate(this.template_front_app, `${this.root_project_path}/${this.project_info.id}/projectt-server/app/Config/App.php`);
        await this.__reconfigFileUpdate(this.template_admin_base_define, `${this.root_project_path}/${this.project_info.id}/admin/_LIB/base_define.php`);
        await this.__reconfigFileUpdate(this.template_admin_class_redis, `${this.root_project_path}/${this.project_info.id}/admin/_LIB/class_redis.php`);
        await this.__reconfigFileUpdate(this.template_admin_login, `${this.root_project_path}/${this.project_info.id}/admin/login.php`);         
        await this.__reconfigFileUpdate("./bash_scripts/templates/front/add_common.js", `${this.root_project_path}/${this.project_info.id}/projectt-server/public/assets_w/js/common.js`, true);         
        await this.__word_replace(`${this.root_project_path}/${this.project_info.id}/admin/common/head.php`, 'header(`Location', '//header(`Location');
        await this.bot.realSendMessage(this.chat_id, 'Executed: `__reconfigProject()`', 'markdown'); 
    }
    async __word_replace(path, word, replace_with)
    {
        let code = fs.readFileSync(path).toString();
        code = code.replaceAll(word, replace_with);
        await fs.writeFileSync(path, code);
    }
    async __reconfigFileUpdate(template_path, write_path, append_mode = false)
    {
        let file_content = fs.readFileSync(template_path).toString();

        if(append_mode)
        {
            let original_file   = "";
            
            if (fs.existsSync(write_path))
            {
                original_file = fs.readFileSync(write_path).toString()
            }
            
            file_content        = file_content + original_file;
        }

        // update credential of contents (project info)
        for(let word in this.project_info)
        {
            file_content = file_content.replaceAll(`{{${word}}}`, this.project_info[word]);
        }

        // update credential of contents (system config)
        for(let word in system_config)
        {
            file_content = file_content.replaceAll(`{{${word}}}`, system_config[word]);;
        }

        await fs.writeFileSync(write_path, file_content);
    }
    async __sendConfirmationMessage(note, confirm)
    {
        let send_message    = `***${this.project_info.label} Dev Server:***\n\n`;
        send_message        += `This message serves as a\ ***FINAL CONFIRMATION***.`;
        send_message        += `\n`;
        send_message        += `\n***Note: *** ${note}`;
        send_message        += `\n`;
        send_message        += `\n***Read Carefully:*** If you will want to continue then please enter the command [/${confirm}]. If you would like to cancel then please enter other commands or go back to [/main_menu].`;

        this.bot.realSendMessage(this.chat_id, send_message);
    }
}