#!/bin/bash

# compile
harp compile

# discard CNAME and .nojekyll
git checkout -- www/CNAME
git checkout -- www/.nojekyll

# push to master branch
git add .
git commit -m "Update"
git push

# push to gh-pages branch
git subtree push --prefix www origin gh-pages