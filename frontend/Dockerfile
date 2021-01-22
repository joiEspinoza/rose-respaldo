# The first stage
# Build React static files
FROM node:12.20.1-buster-slim

LABEL maintainer="Benjamín González Guerrero <bgonzalez@myfuture.ai>"

WORKDIR /app/frontend

#install rsync for files and yarn build
RUN apt-get update && apt-get upgrade -y
RUN apt-get install ssh rsync -y
RUN apt-get install git -y

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install 
COPY . .
#Exec permissions to entrypoint
RUN chmod 755 entrypoint.sh

ENTRYPOINT ["sh","entrypoint.sh"]