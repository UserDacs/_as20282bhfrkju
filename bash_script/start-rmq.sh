# get argument information
while getopts p:d:r:l: flag
do
    case "${flag}" in
        p) project=${OPTARG};;
        d) domain=${OPTARG};;
        r) rmq_repository=${OPTARG};;
        l) project_label=${OPTARG};;
    esac
done

# showing initialize informations
echo "Initializing:";
echo "- Project: $project";
echo "- Project Label: $project_label";
echo "- Domain: $domain";
echo "- RMQ BRANCH: $rmq_repository";

cd /www/${project}_rmq
pm2 delete all
pm2 start ecosystem.config.js