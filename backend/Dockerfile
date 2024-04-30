FROM python:3.10-slim 

ENV DockerHOME=/home/app/backend  

# set work directory  
RUN mkdir -p $DockerHOME  

# where your code lives  
WORKDIR $DockerHOME  

# Copy requirements.txt separately to avoid copying unnecessary files
# COPY backend/requirements.txt .

RUN apt-get update && apt-get install -y pkg-config python3-dev default-libmysqlclient-dev build-essential 

RUN pip install --upgrade pip  

COPY . $DockerHOME  

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the backend files
# Command to run the server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
