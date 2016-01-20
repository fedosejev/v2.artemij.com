#!/bin/bash

# compile
harp compile

# copy CNAME and .nojekyll
cp ./github_pages/CNAME ./www/
cp ./github_pages/.nojekyll ./www/.nojekyll

# push to master branch
git add .
git commit -m "Update"
git push

# push to gh-pages branch
git subtree push --prefix www origin gh-pages