#!/bin/bash -eu

# status:
# 1 one or multiple variables are not set
# 2 error during configuration update
# 3 problem during jekyll build
# 4 problem during github deployment creation or update
# 5 error during s3 clean or upload

[[ "$TRAVIS_PULL_REQUEST" == "false" ]] && exit 0 # bypass script if not a pull request

CONFIG_PATH=_config.yml
URL="http://${S3_BUCKET_PREVIEW}.s3-website.${S3_REGION_PREVIEW}.amazonaws.com"
BASEURL="/${TRAVIS_PULL_REQUEST_BRANCH}"
BUILD_DIRECTORY="_site"

# set_url
function set_url {
    printf "\n--> setting url %s in config file %s \n" "${URL}" "${CONFIG_PATH}"

    sed --in-place "/^url:/d" "${CONFIG_PATH}"
    echo "url: ${URL}" >> "${CONFIG_PATH}"
}

# set_baseurl
function set_baseurl {
    printf "\n--> setting baseurl %s in config file %s \n" "${BASEURL}" "${CONFIG_PATH}"

    sed --in-place "/^baseurl:/d" "${CONFIG_PATH}"
    echo "baseurl: ${BASEURL}" >> "${CONFIG_PATH}"
}

# create_github_deployment
function create_github_deployment {
    printf "\n--> creating github deployment for %s \n" "${TRAVIS_PULL_REQUEST_BRANCH}"

    local DEPLOYMENT_DATA
    local GITHUB_DEPLOYMENT_API_RESPONSE

    DEPLOYMENT_DATA="{\"ref\":\"${TRAVIS_PULL_REQUEST_BRANCH}\",\"environment\":\"${TRAVIS_PULL_REQUEST_BRANCH}\",\"required_contexts\":[],\"auto_merge\":false}"

    GITHUB_DEPLOYMENT_API_RESPONSE=$(curl --silent --header "Authorization: token ${GITHUB_TOKEN}" --header "Content-Type: application/json" --header "Accept: application/vnd.github.ant-man-preview+json" --request POST --data "${DEPLOYMENT_DATA}" "https://api.github.com/repos/eleven-labs/blog.eleven-labs.com/deployments")
    DEPLOYMENT_ID=$(echo "${GITHUB_DEPLOYMENT_API_RESPONSE}" | jq -r ".id")
}

# update_github_deployment
function update_github_deployment {
    printf "\n--> updating github deployment %s \n" "${DEPLOYMENT_ID}"

    local DEPLOYMENT_DATA

    DEPLOYMENT_DATA="{\"state\":\"success\",\"environment_url\":\"${URL}${BASEURL}\",\"description\":\"Deployment finished successfully\"}"

    UPDATED_DEPLOYMENT=$(curl --silent --show-error --request POST --header "Authorization: token ${GITHUB_TOKEN}" --header "Content-Type: application/json" --header "Accept: application/vnd.github.ant-man-preview+json" --data "${DEPLOYMENT_DATA}" "https://api.github.com/repos/eleven-labs/blog.eleven-labs.com/deployments/${DEPLOYMENT_ID}/statuses")
}

# jekyll_build
function jekyll_build {
    printf "\n--> building site to %s \n" "${BUILD_DIRECTORY}"

    bundle exec jekyll build \
        --destination "${BUILD_DIRECTORY}" \
        --drafts \
        --future \
        --quiet
}

# s3_clean
function s3_clean {
    printf "\n--> cleaning %s \n" "s3://${S3_BUCKET_PREVIEW}/${TRAVIS_PULL_REQUEST_BRANCH}"

    aws s3 rm \
        --recursive \
        --only-show-errors \
        "s3://${S3_BUCKET_PREVIEW}/${TRAVIS_PULL_REQUEST_BRANCH}"
}

# s3_upload
function s3_upload {
    printf "\n--> uploading to %s \n" "s3://${S3_BUCKET_PREVIEW}/${TRAVIS_PULL_REQUEST_BRANCH}"

    aws s3 cp \
        --recursive \
        --only-show-errors \
        "${BUILD_DIRECTORY}/" \
        "s3://${S3_BUCKET_PREVIEW}/${TRAVIS_PULL_REQUEST_BRANCH}"
}

# check variables
[[ -z $S3_BUCKET_PREVIEW ]] && echo "var S3_BUCKET_PREVIEW is not set" && exit 1
[[ -z $S3_REGION_PREVIEW ]] && echo "var S3_REGION_PREVIEW is not set" && exit 1
[[ -z $TRAVIS_PULL_REQUEST_BRANCH ]] && echo "var TRAVIS_PULL_REQUEST_BRANCH is not set" && exit 1
[[ -z $GITHUB_TOKEN ]] && echo "var GITHUB_TOKEN is not set" && exit 1

# install aws cli
which aws || pip install --user --quiet awscli

# update config
set_url || exit 2
set_baseurl || exit 2

# build with drafts and future publications
jekyll_build || exit 3

# create deployment
create_github_deployment || exit 4

# clean & upload files
s3_clean || exit 5
s3_upload || exit 5

# set deployment status in PR
update_github_deployment || exit 4
