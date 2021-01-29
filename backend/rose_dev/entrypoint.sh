#!/bin/sh
echo "running migrations."
python manage.py makemigrations #--merge
python manage.py migrate

echo "collecting statics."
python manage.py collectstatic --noinput

echo "changing selection/tmp to absolute path"
find ./*  -type f -print0 | xargs -0 sed -i "s/selection\/tmp\\/home\/ec2-user\/rose\/backend\/rose_dev\/selection\/tmp/g" 

gunicorn rose_dev.wsgi:application \
    ${GUNICORN_COMMANDS}
