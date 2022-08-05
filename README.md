# lksh-web-services

## Установка

### Frontend

 cd shop/shop_frontend
 npm run build

 Настроить nginx (см. конфиг)

 sudo rm -rf /var/www/html/*
 sudo cp -r build/* /var/www/html/
 sudo systemctl restart nginx

#### Разработка

 cd shop/shop_frontend
 npm install
 npm start

### Backend

 cd shop
 python3 -m venv env
 . env/bin/activate
 cd shop_backend
 pip install -r requirements.txt

Настроить БД

 python manage.py migrate
 python manage.py createsuperuser

Запуск сервера

 export DJANGO_ALLOWED_HOSTS="*"
 export DJANGO_CORS_ORIGIN_WHITELIST="http://192.168.8.*"
 export DJANGO_SECRET_KEY='xxx'
 cd lksh-web-services/shop
 . env/bin/activate
 cd shop_backend
 python manage.py runserver 0.0.0.0:8000

TODO: Настроить nginx для backend


## Разработка

