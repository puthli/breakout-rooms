#!/bin/bash

docker run -it --rm -v $(pwd):/src node:slim /bin/sh -c "cd /src; npm install;"
