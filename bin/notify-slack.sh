#!/bin/bash -eu

curl \
    -X POST \
    -H "Content-type: application/json" \
    --data '{"text":"MEP blog\n'${TRAVIS_COMMIT_MESSAGE}'","channel":"#'${SLACK_CHANNEL}'","username":"'${SLACK_USERNAME}'","icon_emoji":":'${SLACK_EMOJI}':"}' \
    ${SLACK_WEBHOOK_URL}
