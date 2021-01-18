# The first stage
# Build React static files
FROM node:13.10.1 as build

LABEL maintainer="Benjamín González Guerrero <bgonzalez@mufuture.ai>"

WORKDIR /app/frontend

COPY ./package.json .
#COPY ./frontend/package-lock.json /roseapp/frontend
RUN npm install #ci --silent
COPY . .
#RUN npm run build

