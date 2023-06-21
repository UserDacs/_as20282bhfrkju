while getopts n:f:a:d:r:p:l:b:c:y:z:m:w: flag
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
        c) git_branch_release=${OPTARG};;
    esac
done

# initialize variables
project_root="/www" 
project_dir_name=$project 
project_path="$project_root/$project_dir_name"
main_branch="${git_branch}"
release_branch="${git_branch_release}"

# showing initialize informations
echo "Initializing:";
echo "- Project: $project";
echo "- Project Label: $project_label";
echo "- Repo: $bets_repository";
echo "- Branch Main: $main_branch";
echo "- Branch Release: $release_branch";
echo "- Project Path: $project_path\n";