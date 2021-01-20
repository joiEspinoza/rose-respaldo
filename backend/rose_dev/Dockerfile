FROM python:3.8.3-slim-buster

LABEL maintainer="Benjamín González Guerrero <bgonzalez@myfuture.ai>"

WORKDIR /app/backend

#source code
COPY ./requirements.txt .

#Updating command, just like pip
RUN apt-get -y update

#Installing python3.7 and pip3
RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y
RUN apt-get install antiword

#Installing requirements from python, pip and gunicorn for multiple workers
#If we dont change requirements.txt then docker run will skip to last line
#Opposite: copy entire folder, if there is one change even if its not requirements.txt, the image will reconstruct entirely
RUN pip install --upgrade pip
RUN pip install mysqlclient
RUN pip install gunicorn
RUN pip install -r requirements.txt

#copy entrypoint and project
COPY . .

#Exec permissions to entrypoint
RUN chmod 755 entrypoint.sh


ENTRYPOINT ["sh","entrypoint.sh"]