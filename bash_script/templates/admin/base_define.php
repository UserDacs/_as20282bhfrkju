<?php
    define('_DB_IP', '{{host_ip}}');
    define('_DB_PORT', '{{mysql_port}}');
	define('_DB_USER_ADMIN', '{{mysql_user}}');
	define('_DB_PASS_ADMIN', '{{mysql_password}}');
	define('_DB_NAME_ADMIN', '{{mysql_user}}');
	define('_DB_NAME_WEB', '{{db_mydb}}');
	define('_DB_USER_WEB', '{{mysql_user}}');
	define('_DB_PASS_WEB', '{{mysql_password}}');
    define('_DB_LOG_IP', '{{host_ip}}');
    define('_DB_LOG_PORT', '{{mysql_port}}');
	define('_DB_USER_LOG', '{{mysql_user}}');
	define('_DB_PASS_LOG', '{{mysql_password}}');
	define('_DB_NAME_LOG_DB', '{{db_log}}');
    define('IMAGE_TEMP_PATH', '/www/{{id}}/projectt-server/writable');
    define('IMAGE_PATH', '{{project}}');
	define('IMAGE_SERVER_URL', 'https://imghubserver.com');
    define('IMAGE_SERVER_UPLOAD_URL', 'https://imghubserver.com/receiver.php');
    define('IMAGE_SERVER_DELETE_URL', 'https://imghubserver.com/delete.php');
    define('INITDATA_PRE_URL', 'http://210.175.73.161:20003/admin/change_provider_refundRate');
    define('INITDATA_REAL_URL', 'http://210.175.73.161:20002/admin/change_provider_refundRate');
    define('SERVER', '{{server_name}}');
    define('TITLE', '{{label}} Dev Server');
    define ('IS_HASH','ON');
    define ('IS_ESPORTS_KEYRON','OFF');
    define ('IS_XSS_MODE','OFF');
    define ('IS_INCLUDING_DISTRIBUTOR','OFF'); 
    define ('IS_MULTI_LOSS_ROLLING','ON'); 
    define ('LOGIN_BG','login_bi.png');
    define ('FAVICON_IMG','/favicon.ico');
    define ('IS_EOS_POWERBALL','ON');
    define ('IS_POWERBALL','ON');
?>