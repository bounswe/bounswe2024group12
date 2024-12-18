# Backend Setup Instructions

This project contains the backend for a Django application using MySQL as the database.

## Prerequisites

Before running this project, make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)

## Steps to Run the Backend

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bounswe/bounswe2024group12.git
   ```

2. **Navigate to the backend folder:**

   ```bash
   cd app/backend
   ```

3. **Build and start the Docker containers:**

   ```bash
   docker-compose up --build
   ```

   This will start two services:

   - `web`: The Django backend service running on port `8000`.
   - `db`: The MySQL database service running on port `3306`.

4. **Apply the database migrations:**

   ```bash
   docker-compose exec web python manage.py migrate
   ```

5. **Create a superuser to access the Django admin panel (optional):**

   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

   Follow the prompts to set up the superuser account.

6. **Access the application:**

   - The application will be running at: `http://localhost:8000`
   - The Django admin panel will be available at: `http://localhost:8000/admin`

7. **Stop the containers:**

   To stop the containers, press `CTRL+C` in the terminal or run:

   ```bash
   docker-compose down
   ```

## Adding New Apps

1. **Create a new app:**

   To create a new app, run the following command from the root of your backend folder:

   ```bash
   docker-compose exec web python manage.py startapp <app_name> api_core/v1/apps/<app_name>
   ```

   Replace `<app_name>` with the desired name of your app.

2. **Register the new app in `settings.py`:**

   After creating the app, add it to the `INSTALLED_APPS` list in `api_core/settings.py`:

   ```python
   INSTALLED_APPS = [
       # Other apps
       'api_core.v1.apps.<app_name>',
   ]
   ```

3. **Add URLs for the new app:**

   In the `v1/urls.py` file, include the new app's URLs:

   ```python
   from django.urls import path, include

   urlpatterns = [
       # Other paths
       path('<app_name>/', include('api_core.v1.apps.<app_name>.urls')),
   ]
   ```

4. **Create views and models:**

   Define views, models, and migrations as needed in the new app's respective files.

## Why Use Modular Apps?

Modular apps allow you to keep your code organized and scalable. Each app represents a distinct part of the project, such as handling user authentication, product management, or health checks. By splitting functionality into separate apps, you ensure:

- **Better maintainability**: You can work on individual components without affecting the entire project.
- **Scalability**: As your project grows, you can add more apps without cluttering the main codebase.
- **Separation of concerns**: Each app handles its own functionality, leading to cleaner, more readable code.

## Troubleshooting

- If you encounter issues with port conflicts, ensure no other services are running on the ports specified in the `docker-compose.yml` file (e.g., MySQL on port `3306`).
- Make sure Docker is running before executing any commands.

---

By following these steps, you can easily get the backend up and running with Docker and manage new apps efficiently. Enjoy developing!
