#!/bin/bash

ROSE_HOME=/home/ec2-user/rose
export BRANCH=$1

#Login docker AWS
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0

echo "BRANCH: ${BRANCH}"

cd ${ROSE_HOME}
git pull https://bgonzalezfractal:Fractal1527@bitbucket.org/bgonzalezfractal/rose.git ${BRANCH}

docker rm -f nginx_proxy backend_dev frontend_dev
docker-compose pull backend_${BRANCH} frontend_${BRANCH}
docker-compose up -d
