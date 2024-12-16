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
RUN pip install requests
RUN pip install chess



# port
EXPOSE 8000

# Default commands to run the server
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]