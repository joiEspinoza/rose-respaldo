#!/bin/bash
cd roseapp/backend/rose_dev
echo $(pwd)
echo $(ls -l backend)
echo $(cd backend/rose_dev) ..
#./manage.py migrate
#./manage.py collectstatic --noinput

gunicorn rose_dev.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4


# Option 1:
# run gunicorn with debug log level
# gunicorn server.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# Option 2:
# run development server
# DEBUG=True ./manage.py runserver 0.0.0.0:8000
