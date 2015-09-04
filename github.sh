#!/usr/bin/env bash

# create and init a git repository for an organization

# replace: USER, PASSWORD, REPO, ORG in this script
# cd into your development directory

# org repo

curl -u USER:PASSWORD https://api.github.com/orgs/ORG/repos -d '{"name":"REPO"}'
git init
git add -A
git commit -m initial
git remote add origin https://github.com/ORG/REPO.git
git push -u origin master

# git tag
git push --tags
