FROM python:3.12

WORKDIR /app

COPY . /app

# dependencies
RUN pip install --upgrade pip
RUN pip install django mysqlclient
RUN pip install djangorestframework-simplejwt
RUN pip install drf-yasg
RUN pip install setuptools
RUN pip install Pillow
RUN pip install django-cors-headers


# port
EXPOSE 8000

# Default commands to run the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]