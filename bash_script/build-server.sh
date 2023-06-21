# get argument information
while getopts m:w:n:f:a:d:r:p:l:b:x: flag
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
        y) my_db=${OPTARG};;
        z) main_db=${OPTARG};;
        x) log_db=${OPTARG};;
    esac
done

# showing initialize informations
echo "Initializing:";
echo "- Project: $project";
echo "- Project Label: $project_label";
echo "- Domain: $domain";
echo "- Docker Compose: $docker_file_name"\n;

echo "Commands:"
echo "- cd bash_scripts/temp"
echo "- docker compose -f $docker_file_name up"

cd bash_scripts/temp
docker compose -f $docker_file_name up --build -d