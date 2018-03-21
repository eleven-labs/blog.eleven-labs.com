#!/bin/bash -eu

TEXT=$( echo "${TRAVIS_COMMIT_MESSAGE}" | tr -d "\"" | tr -d "'" )
PAYLOAD=$( printf '{"channel":"#%s","username":"%s","icon_emoji":":%s:","attachments":[{"color":"#36a64f","pretext":"Nouvelle version du blog en prod","title":"%s","title_link":"https://blog.eleven-labs.com/"}]}' "${SLACK_CHANNEL}" "${SLACK_USERNAME}" "${SLACK_EMOJI}" "${TEXT}" )

curl \
    -X POST \
    -H "Content-type: application/json" \
    --data "${PAYLOAD}" \
    "${SLACK_WEBHOOK_URL}"
