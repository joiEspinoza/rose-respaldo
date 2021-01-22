#!/bin/sh
echo "running migrations."
python manage.py makemigrations #--merge
python manage.py migrate

echo "collecting statics."
python manage.py collectstatic --noinput

gunicorn rose_dev.wsgi:application \
    ${GUNICORN_COMMANDS}