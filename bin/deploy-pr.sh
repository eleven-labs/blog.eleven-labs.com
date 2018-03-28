#!/bin/bash -eu

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]
then
    # install aws cli
    pip install --user awscli

    # build with updated config
    sed -i '/^url:/c\url: http:\/\/dev.brouette-labs.com.s3-website.eu-west-2.amazonaws.com' _config.yml
    sed -i '/^baseurl:/c\baseurl: \/'"$TRAVIS_PULL_REQUEST_BRANCH" _config.yml
    bundle exec jekyll build --drafts --future

    # create deployment
    DEPLOYMENT_ID=$(curl --silent -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/json" -H "Accept: application/vnd.github.ant-man-preview+json" -X POST -d '{"ref":"'"$TRAVIS_PULL_REQUEST_BRANCH"'","environment":"'"$TRAVIS_PULL_REQUEST_BRANCH"'","required_contexts":[],"auto_merge":false}' "https://api.github.com/repos/brouette-labs/brouette-labs.com/deployments" | jq -r ".id")

    # clean & upload files
    aws s3 rm "s3://brouette-labs.com/$TRAVIS_PULL_REQUEST_BRANCH" --recursive
    aws s3 cp "_site/" "s3://dev.brouette-labs.com/$TRAVIS_PULL_REQUEST_BRANCH" --recursive

    # set deployment status in PR
    curl --silent -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/json" -H "Accept: application/vnd.github.ant-man-preview+json" -X POST -d '{"state": "success","environment_url":"http://dev.brouette-labs.com.s3-website.eu-west-2.amazonaws.com/'"$TRAVIS_PULL_REQUEST_BRANCH"'/","description": "Deployment finished successfully."}' "https://api.github.com/repos/brouette-labs/brouette-labs.com/deployments/$DEPLOYMENT_ID/statuses"
fi
