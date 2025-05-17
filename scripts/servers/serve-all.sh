#!/bin/bash

yarn concurrently -n core \
  "PORT=3010 node dist/apps/core/main.js"
