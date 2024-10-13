FROM python:3.12

WORKDIR /app

COPY . /app

# dependencies
RUN pip install --upgrade pip
RUN pip install django mysqlclient
RUN pip install drf-yasg
RUN pip install setuptools


# port
EXPOSE 8000

# Default commands to run the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]