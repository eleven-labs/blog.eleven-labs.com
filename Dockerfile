FROM ruby:2-alpine

RUN apk add --no-cache \
  nodejs \ 
  git \
  build-base \
  libxml2-dev \
  libxslt-dev

WORKDIR /app

ADD . /app

RUN bundle config git.allow_insecure true \ 
    && bundle install
    