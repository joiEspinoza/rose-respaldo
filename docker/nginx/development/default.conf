FROM python:3.8.3-alpine

LABEL maintainer="Benjamín González Guerrero <bgonzalez@mufuture.ai>"

WORKDIR /roseapp

#source code
ADD ./backend/requirements.txt /roseapp/backend/

#Updating command, just like pip
RUN apt-get update -y

#Installing requirements from python, pip and gunicorn for multiple workers
RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install -r backend/requirements.txt


ADD ./docker /roseapp/docker
ADD ./backend /roseapp/backend
