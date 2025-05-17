#!/bin/bash

yarn concurrently -n core \
  "PORT=3010 yarn dev core"
