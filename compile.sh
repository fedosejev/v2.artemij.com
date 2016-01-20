#!/bin/bash

# compile
harp compile

# discard CNAME and .nojekyll
git checkout -- www/CNAME
git checkout -- www/.nojekyll