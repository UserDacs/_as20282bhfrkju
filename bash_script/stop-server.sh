# get argument information
while getopts n:f:a:d:r:p:l:b: flag
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
    esac
done

# showing initialize informations
echo "Initializing:";
echo "- Project: $project";
echo "- Project Label: $project_label";
echo "- Domain: $domain";
echo "- Front Port: $front_port";
echo "- Admin Port: $admin_port";
echo "- Docker Compose: $docker_file_name\n\n";

echo "Commands:"
echo "- cd bash_scripts/temp"
echo "- docker compose -f $docker_file_name down\n"

cd bash_scripts/temp
docker compose -f $docker_file_name down