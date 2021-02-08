#!/bin/bash

ROSE_HOME=/home/ec2-user/rose
export BRANCH=$1


#Login docker AWS
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0

echo "BRANCH: ${BRANCH}"

cd ${ROSE_HOME}
docker rm -f nginx_proxy backend_dev frontend_dev
docker pull 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0/backend:${BRANCH}
docker pull 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0/frontend:${BRANCH}
docker run -d --name=backend_dev --env-file=.env.dev -p=1335:1335 --restart=unless-stopped 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0/backend:${BRANCH}
docker run -d --name=frontend_dev --env-file=.env_f.dev -p=1337:1337 --restart=unless-stopped 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0/frontend:${BRANCH}
#docker-compose pull backend_${BRANCH} frontend_${BRANCH}
#docker-compose up -d

