To see the app: https://buchessocial.online/

# Setup Instructions

## Backend

This project contains the backend for a Django application using MySQL as the database.

### Prerequisites

Before running this project, make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)

### Steps to Run the Backend
You can reach documentation at: [Swagger-UI](https://buchessocial.online/api/swagger/), [Json-File](https://buchessocial.online/api/swagger.json), [Yaml-file(you can view at swaggerhub](https://buchessocial.online/api/swagger.yaml)


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

   **Important Note!**
   Due to we are inserting 28K games and bunch of data into database, even if we add an interval before backend start. Backend may failed at the build phase( Due to db is not started yet)
   We solved this issue by adding start.sh script but we are giving some permission during this phase etc. So, that if anything wrongs about permission please reach out.


5. **View logs to monitor the process:**

   To view the logs for any service, run:

   ```bash
   docker-compose logs
   ```

6. **Apply the database migrations:**

   ```bash
   docker-compose exec web python manage.py migrate
   ```

7. **Access the application:**

   - The application will be running at: `http://localhost:8000`
   - The Django admin panel will be available at: `http://localhost:8000/admin`

8. **Stop the containers:**

   To stop the containers, run:

   ```bash
   docker-compose down
   ```

9. **Show the docker containers:**

   To show the docker containers, run:

   ```bash
   docker ps
   ```

### Testing the Backend

To run all tests for the backend, execute the following command at /backend :

```bash
docker-compose exec web bash test.sh
```
### Database Initialization (IMPORTANT)
Due to we put a sql initiator no need to use Commands, you can run by docker-compose scrit at 3rd step
**OLD** We scraped chess games from https://www.pgnmentor.com/ and there is a function at "/app/backend/v1/apps/games/management/commands/import_games.py" to import json file to database. Due to file size is too big (~300MB) we will send it if exact database table is needed.


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
   cd bounswe2024group12/frontend

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


