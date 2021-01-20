#!/bin/sh

echo "${0}: running migrations."
python manage.py makemigrations #--merge
python manage.py migrate

echo "${0}: collecting statics."
python manage.py collectstatic --noinput

gunicorn rose_dev.wsgi:application \
    --name rose_dev \
    --bind 0.0.0.0:8000 \
    --timeout 900 \
    --workers 1 \
    --log-level=debug
