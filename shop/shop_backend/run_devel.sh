. env/bin/activate
export DJANGO_ALLOWED_HOSTS="*"
export DJANGO_CORS_ORIGIN_WHITELIST="http://127.0.0.1"
export DJANGO_SECRET_KEY='xxx'
python manage.py runserver 0.0.0.0:8000
