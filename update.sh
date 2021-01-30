#!/bin/bash

ROSE_HOME=/home/ec2-user/rose
export BRANCH=$1


#Login docker AWS
sudo aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0

echo "BRANCH: ${BRANCH}"

cd ${ROSE_HOME}
sudo docker rm -f nginx_proxy
sudo docker-compose pull backend_${BRANCH} frontend_${BRANCH}
sudo docker-compose up -d
#docker-compose pull 943423409941.dkr.ecr.us-east-2.amazonaws.com/rosev0/master:${BRANCH}
