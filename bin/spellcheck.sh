#!/bin/bash -eu

[[ "$TRAVIS_PULL_REQUEST" == "false" ]] && exit 0 # bypass script if not a pull request

# list_updted_markdown_files
function list_updated_markdown_files {
    printf "\n--> retrieveing list of updated markdown files \n"

    local UPDATED_FILES

    UPDATED_FILES=$(git diff --name-only "${TRAVIS_COMMIT_RANGE}")
    UPDATED_MARKDOWN_FILES=$(echo "${UPDATED_FILES}" | grep ".md")
}

# get_lang
#
# $1 markdown file path
function get_language {
    printf "\n--> retrieveing language for file %s \n" "${1}"

    local PERMALINK
    local LANGUAGE

    PERMALINK=$(grep "permalink: /" "${1}")
    LANGUAGE=$(echo "${PERMALINK}" | sed --regexp-extended "s/permalink: \/(fr|en)\/.*/\1/g")

    echo "${LANGUAGE}"
}

# clean_markdown_file_content
#
# $1 markdown file path
function get_clean_file_content {
    printf "\n--> cleaning %s content \n" "${1}"

    local CLEAN_FILE_CONTENT

    # get file content
    CLEAN_FILE_CONTENT=$(cat "${1}")

    # remove front matter
    CLEAN_FILE_CONTENT=$(echo "$CLEAN_FILE_CONTENT" | sed "1 { /^---/ { :a N; /\n---/! ba; d} }")

    # remove code blocks
    CLEAN_FILE_CONTENT=$(echo "$CLEAN_FILE_CONTENT" | sed "/\`\`\`/ { :a N; /\n\`\`\`/! ba; d}")

    # remove liquid tags
    CLEAN_FILE_CONTENT=$(echo "$CLEAN_FILE_CONTENT" | sed --regexp-extended "s/\{:([^\}]+)\}//g")

    # remove html
    CLEAN_FILE_CONTENT=$(echo "$CLEAN_FILE_CONTENT" | sed --regexp-extended "s/<([^<]+)>//g")

    # remove links
    CLEAN_FILE_CONTENT=$(echo "$CLEAN_FILE_CONTENT" | sed --regexp-extended "s/http(s)?:\/\/([^ ]+)//g")

    echo "${CLEAN_FILE_CONTENT}"
}

# get_misspelled_words
#
# $1 content
# $2 language
function get_misspelled_words {
    local MISSPELLED

    echo "aspell --lang=${2} --encoding=utf-8 --personal=./.aspell.${2}.pws list"
    MISSPELLED=$(echo "${1}" | aspell --lang="${2}" --encoding="utf-8" --personal="./.aspell.${2}.pws" list)

    echo "${MISSPELLED}"
}

[[ -z $TRAVIS_COMMIT_RANGE ]] && echo "var TRAVIS_COMMIT_RANGE is not set" && exit 1

# list updated markdown files
list_updated_markdown_files
[[ -z $UPDATED_MARKDOWN_FILES ]] && exit 0 # nothing to check

# for each updated markdown files
while read -r UPDATED_MARKDOWN_FILE
do
    # get language
    LANGUAGE=$(get_language "${UPDATED_MARKDOWN_FILE}")

    # get clean content
    CONTENT=$(get_clean_file_content "${UPDATED_MARKDOWN_FILE}")

    # run aspell
    MISSPELLED_WORDS=$(get_misspelled_words "${CONTENT}" "${LANGUAGE}")

    echo "${MISSPELLED_WORDS}"

done <<< "${UPDATED_MARKDOWN_FILES}"
