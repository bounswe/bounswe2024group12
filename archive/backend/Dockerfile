FROM python:3

WORKDIR /backend

# Copy requirements.txt separately to avoid copying unnecessary files
COPY backend/requirements.txt .

RUN apt-get update && apt-get install -y default-libmysqlclient-dev
# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the backend files
COPY backend/ .

# Command to run the server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
