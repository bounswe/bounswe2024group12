## Setting Up Django Backend from GitHub

This comprehensive guide covers setting up the Django backend from GitHub, running the backend alone, making changes, and deploying changes by pushing to the container or running backend and frontend together. If you have any further questions, feel free to ask!

When working with Docker, the initial setup might take a while as it fetches and sets up the required components. This could take tens of minutes or more, depending on your internet speed and system capabilities. Don't worry if it seems to be taking a long time. Just be patient and let it finish. As long as the build moves forward smoothly without any errors, you're on the right track. It's usually just a waiting game until it's done.

### 1. Clone the Repository

Clone the Django backend repository from GitHub using the `backend-dev` branch:

```bash
git clone -b backend-dev <repository-url>
cd <repository-name>
```

### 2. Create a Virtual Environment

Set up a virtual environment to isolate your Django project dependencies:

#### Using `venv` (built-in module):

Navigate to the project directory and create a virtual environment named `venv`:

```bash
python -m venv venv
```

Activate the virtual environment:

- **On Windows**:
  ```bash
  venv\Scripts\activate
  ```

- **On macOS and Linux**:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Django and Dependencies

Once the virtual environment is activated, install Django and other project dependencies using pip:

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Use the .env file in the root directory of your project and add corresponding environment variables for your project's configuration. Use the following format:

```plaintext
# MySQL settings
MYSQL_ROOT_PASSWORD=<root_password>
MYSQL_DATABASE=playlog_db
MYSQL_USER=<user>
MYSQL_PASSWORD=<mypassword>
DJANGO_SECRET_KEY=<django_secret_key>

# Add more environment variables as needed
```

Replace the placeholder values (`root_password`, `user`, `mypassword`, etc.) with your actual database credentials and configuration. You can add additional environment variables as needed for other configurations.

### 5. Run the Development Server

Start the Django development server:

```bash
python manage.py runserver
```

By default, the development server will run on [http://127.0.0.1:8000/](http://127.0.0.1:8000/). You can access it in your web browser to see the default Django welcome page.

### Running the Backend Alone

To run only the backend container:

```bash
docker-compose up --build backend
```

The Django backend will be accessible at [http://localhost:8000](http://localhost:8000).

### Making Changes

#### Development Workflow:

1. Make changes to the Django backend codebase locally using your preferred text editor or IDE.
2. Test your changes locally by running the Docker container and accessing the backend API endpoints.

#### Code Structure:

- `playlog/`: Django project directory containing settings, views, models, and other Django-specific files.
- `Dockerfile`: Dockerfile for building the Django backend into a Docker image.
- `requirements.txt`: File listing Python dependencies required for the Django project.

### Deploying Changes

#### Pushing Changes to the Container:

```bash
docker-compose build backend
docker-compose up --detach --force-recreate backend
```

#### Running Backend and Frontend Together:

To run both the Django backend and React frontend together:

```bash
docker-compose up --build
```

The Django backend will be accessible at [http://localhost:8000](http://localhost:8000) and the React frontend at [http://localhost:3000](http://localhost:3000).