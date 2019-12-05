#! /bin/bash
if [ "$TRAVIS_OS_NAME" == osx ]; then
    # deploy on mac
    yarn build
else
    # deploy on windows and linux
    docker run --rm -e GH_TOKEN=$GH_TOKEN -v "${PWD}":/project -v ~/.cache/electron:/root/.cache/electron -v ~/.cache/electron-builder:/root/.cache/electron-builder electronuserland/builder:12-11.19 /bin/bash -c "yarn install && yarn release"
fi