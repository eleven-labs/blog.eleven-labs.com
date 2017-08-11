#!/bin/bash
# requires apt packages: aspell, aspell-en, aspell-fr

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

MARKEDOWN_FILES_CHANGED=($(git diff --name-only $TRAVIS_COMMIT_RANGE | grep .md))
echo -e "$BLUE>> Following markdown files were changed in this pull request:$NC"
echo $MARKEDOWN_FILES_CHANGED

LANG=`echo $MARKEDOWN_FILES_CHANGED | xargs cat | grep "permalink: /" | sed -E 's/permalink: \/(fr|en)\/.*/\1/g'`
echo -e "$BLUE>> Language recognized from the permalink:$NC"
echo $LANG

TEXT_CONTENT_WITHOUT_METADATA=`cat $MARKEDOWN_FILES_CHANGED | grep -v -E '^(layout:|permalink:|date:|date_gmt:|authors:|categories:|tags:|cover:)(.*)'`
TEXT_CONTENT_WITHOUT_METADATA=`echo "$TEXT_CONTENT_WITHOUT_METADATA$" | sed -E 's/\{:([^\}]+)\}//g'`
TEXT_CONTENT_WITHOUT_METADATA=`echo "$TEXT_CONTENT_WITHOUT_METADATA$" | sed -E 's/<([^<]+)>//g'`
TEXT_CONTENT_WITHOUT_METADATA=`echo "$TEXT_CONTENT_WITHOUT_METADATA$" | sed -E 's/http(s)?:\/\/([^ ]+)//g'`

echo -e "$BLUE>> Text content that will be checked (without metadata, html, and links):$NC"
echo "$TEXT_CONTENT_WITHOUT_METADATA"


echo -e "$BLUE>> Checking in 'en' (many technical words are in English anyway)...$NC"
MISSPELLED=`echo "$TEXT_CONTENT_WITHOUT_METADATA" | aspell --lang=en --encoding=utf-8 --personal=./.aspell.en.pws list | sort -u`

if [ $LANG != 'en' ]
then
    echo -e "$BLUE>> Checking in '$LANG' too..."
    MISSPELLED=`echo "$MISSPELLED" | aspell --lang=$LANG --encoding=utf-8 --personal=./.aspell.$LANG.pws list | sort -u`
fi

NB_MISSPELLED=`echo "$MISSPELLED" | wc -l`

if [ "$NB_MISSPELLED" -gt 0 ]
then
    echo -e "$RED>> Words that might be misspelled, please check:$NC"
    echo "$MISSPELLED"
else
    echo -e "$GREEN>>No spelling errors, congratulations!"
fi

exit $NB_MISSPELLED
