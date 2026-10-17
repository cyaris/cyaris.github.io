#!/usr/bin/env bash

set -euo pipefail

BUCKET="cyaris.github.io"

echo "Enabling bucket policies to grant public read access..."

aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
'{
  "BlockPublicAcls": true,
  "IgnorePublicAcls": true,
  "BlockPublicPolicy": false,
  "RestrictPublicBuckets": false
}'

echo
echo "Updated Block Public Access settings:"
aws s3api get-public-access-block --bucket "$BUCKET"