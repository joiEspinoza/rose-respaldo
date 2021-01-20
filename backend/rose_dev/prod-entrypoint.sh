#!/bin/sh
echo "running migrations."
python manage.py makemigrations #--merge
python manage.py migrate

echo "collecting statics."
python manage.py collectstatic --noinput

gunicorn rose_dev.wsgi:application \
    --name rose_prod \
    --bind 0.0.0.0:8000 \
    --timeout 900 \
    --workers 4 \
    --threads 2 \
