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

cd /www
rm -rf "${project}_rmq"
git clone $rmq_repository "${project}_rmq"