# get argument information
while getopts m:w:n:f:a:d:r:p:l:b:y:z: flag
do
    case "${flag}" in
        n) docker_file_name=${OPTARG};;
        f) front_port=${OPTARG};;
        a) admin_port=${OPTARG};;
        d) domain=${OPTARG};;
        r) bets_repository=${OPTARG};;
        p) project=${OPTARG};;
        l) project_label=${OPTARG};;
        b) git_branch=${OPTARG};;
        m) mysql_username=${OPTARG};;
        w) mysql_password=${OPTARG};;
        y) mydb_database=${OPTARG};;
        z) main_database=${OPTARG};;
    esac
done

log_database="log_database";

# showing initialize informations
echo "Initializing:";
echo "- Project: $project";
echo "- Project Label: $project_label";
echo "- Domain: $domain";
echo "- Front Port: $front_port";
echo "- Admin Port: $admin_port";
echo "- Docker Compose: $docker_file_name";
echo "- MYSQL UN: $mysql_username";
echo "- MYSQL PW: $mysql_password";
echo "- DB_MY: $mydb_database";
echo "- DB_MAIN: $main_database";
echo "- DB_LOG: $log_database\n\n";

echo "Commands:"
echo "- docker exec groundlink-mysql mysql -u $mysql_username -p\"$mysql_password\" -e \"DROP SCHEMA IF EXISTS mydb_${project}\""
echo "- docker exec groundlink-mysql mysql -u $mysql_username -p\"$mysql_password\" -e \"CREATE SCHEMA mydb_${project}\""
echo "- docker exec groundlink-mysql mysql -u $mysql_username -p\"$mysql_password\" -e \"DROP SCHEMA IF EXISTS ${project}_main_db\""
echo "- docker exec groundlink-mysql mysql -u $mysql_username -p\"$mysql_password\" -e \"CREATE SCHEMA ${project}_main_db\""

cd bash_scripts/temp

# mydb import
docker exec groundlink-mysql mysql -u $mysql_username -p"$mysql_password" -e "DROP SCHEMA IF EXISTS ${mydb_database}"
docker exec groundlink-mysql mysql -u $mysql_username -p"$mysql_password" -e "CREATE SCHEMA ${mydb_database}"
cat "/dumps/${mydb_database}.sql" | docker exec -i groundlink-mysql /usr/bin/mysql -u $mysql_username --password=$mysql_password ${mydb_database}

# main db import
docker exec groundlink-mysql mysql -u $mysql_username -p"$mysql_password" -e "DROP SCHEMA IF EXISTS ${main_database}"
docker exec groundlink-mysql mysql -u $mysql_username -p"$mysql_password" -e "CREATE SCHEMA ${main_database}"
cat "/dumps/${main_database}.sql" | docker exec -i groundlink-mysql /usr/bin/mysql -u $mysql_username --password=$mysql_password ${main_database}

# main db import
docker exec groundlink-mysql mysql -u $mysql_username -p"$mysql_password" -e "DROP SCHEMA IF EXISTS ${log_database}"
docker exec groundlink-mysql mysql -u $mysql_username -p"$mysql_password" -e "CREATE SCHEMA ${log_database}"
cat "/dumps/log_db.sql" | docker exec -i groundlink-mysql /usr/bin/mysql -u $mysql_username --password=$mysql_password ${log_database}

# create betdev user (required)
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e 'grant all privileges on *.* to \"betsdev\"@\"%\" identified by \"4JJvnTGwU8jB92mf\"'"
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e 'grant all privileges on *.* to \"betgoadmin\"@\"%\" identified by \"4JJvnTGwU8jB92mf\"'"
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e 'grant all privileges on *.* to \"kadminwin\"@\"%\" identified by \"4JJvnTGwU8jB92mf\"'"
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e'grant insert,select,update,delete,execute,lock tables on *.* to  \"betsdev\"@\"%\" identified by \"4JJvnTGwU8jB92mf\";'"
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e'grant insert,select,update,delete,execute,lock tables on *.* to  \"betgoadmin\"@\"%\" identified by \"4JJvnTGwU8jB92mf\";'"
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e'grant insert,select,update,delete,execute,lock tables on *.* to  \"kadminwin\"@\"%\" identified by \"4JJvnTGwU8jB92mf\";'"
docker exec -i groundlink-mysql /bin/sh -c "mysql -u $mysql_username -p$mysql_password -e'flush privileges;'"