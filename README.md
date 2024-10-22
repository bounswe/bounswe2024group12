# Setup Instructions

## Backend

This project contains the backend for a Django application using MySQL as the database.

### Prerequisites

Before running this project, make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)

### Steps to Run the Backend

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bounswe/bounswe2024group12.git
   ```

2. **Navigate to the backend folder:**

   ```bash
   cd app/backend
   ```

3. **Build and start the Docker containers in the background:**

   ```bash
   docker-compose up --build -d
   ```

   This will start two services:

   - `web`: The Django backend service running on port `8000`.
   - `db`: The MySQL database service running on port `3306`.

4. **View logs to monitor the process:**

   To view the logs for any service, run:

   ```bash
   docker-compose logs
   ```

5. **Apply the database migrations:**

   ```bash
   docker-compose exec web python manage.py migrate
   ```

6. **Access the application:**

   - The application will be running at: `http://localhost:8000`
   - The Django admin panel will be available at: `http://localhost:8000/admin`

7. **Stop the containers:**

   To stop the containers, run:

   ```bash
   docker-compose down
   ```

8. **Show the docker containers:**

   To show the docker containers, run:

   ```bash
   docker ps
   ```

## Frontend

This project contains the frontend for a React application.

### Prerequisites

Before running this project, make sure you have the following installed on your machine:

- Docker
- Git

### Steps to Run the Frontend

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bounswe/bounswe2024group12.git

2. **Navigate to the frontend folder**:
   
   ```bash
   cd app/frontend

3. **Build the Docker image**:
First, ensure Docker is running. Then, build the Docker image for the React frontend:

   ```bash
   docker build -t frontend-app .

4. **Run the Docker container**:
After building the Docker image, run the container to start the frontend:

   ```bash
   docker run -p 3000:3000 frontend-app
   
5. **Access the application**:
Once the container is running, you can access the application in your browser at:

http://localhost:3000


## Mobile App

This project contains the mobile app for an Android application.


### Prerequisites

Before running this project, make sure you have the following installed on your machine:

- Docker
- Git

### Steps to Run Mobile

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bounswe/bounswe2024group12.git

2. **Navigate to the mobile folder**:
   
   ```bash
   cd project/Mobile

3. Install dependencies

   ```bash
   npm install
   ```

4. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


