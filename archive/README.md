# CmpE 352 Fundamentals of Software Engineering 2024 - Group 12

## 📚 Brief about the Course

CmpE 352 is a course designed to enhance abilities in collaborative software development and teamwork.

## 🚀 About Project
Playlog is a social game browsing app. You can semantically browse your favorite games, give ratings, make lists or follow your frineds and check their reviews. Currently you can access our deployment from here: http://165.22.85.172:3000/home

## 👥 Group Members 

- [Ahmet Bayir](https://github.com/bounswe/bounswe2024group12/wiki/Ahmet-Bayir)
- [Ahmet Fırat Gamsız](https://github.com/bounswe/bounswe2024group12/wiki/Ahmet-Firat-Gamsiz)
- [Asya Su Sen](https://github.com/bounswe/bounswe2024group12/wiki/Asya-Su-Sen)
- [Arda Yalcindag](https://github.com/bounswe/bounswe2024group12/wiki/Arda%20Yalcindag)
- [Isıl Su Karakuzu](https://github.com/bounswe/bounswe2024group12/wiki/Isil-Su-Karakuzu)
- [Mehmet Batuhan Cok](https://github.com/bounswe/bounswe2024group12/wiki/Mehmet-Batuhan-Cok)
- [Orhan Unuvar](https://github.com/bounswe/bounswe2024group12/wiki/Orhan-Unuvar)
- [Soner Kuyar](https://github.com/bounswe/bounswe2024group12/wiki/Soner-Kuyar)
- [Taha Ensar Kukul](https://github.com/bounswe/bounswe2024group12/wiki/Taha-Ensar-Kukul)
- [Yusuf Aygun](https://github.com/bounswe/bounswe2024group12/wiki/Yusuf-Aygun)

## 👩‍🏫 Teaching Staff
- **Instructor:** [Suzan Uskudarli](https://github.com/uskudarli)
- **Assistants**
	- Deniz Barak Aksoy
	- Kutay Altintas
	- Salih Furkan Akkurt
	
## 📷 The Team
<a href="https://ibb.co/DCMnxXz"><img src="https://i.ibb.co/FwYtSvm/Screenshot-2024-02-16-at-20-22-29.png" alt="Screenshot-2024-02-16-at-20-22-29" border="0"></a>

## 📖 Wiki Page
You can address our Wiki page from [here](https://github.com/bounswe/bounswe2024group12/wiki).

## 🛠️ Architecture and Local Deployment
We have directories named ./frontend, ./backend, and ./app/mobile/Playlog (which will later be changed to ./mobile), each containing the respective codebase for the frontend, backend, and mobile applications. Each codebase has its own readme file explaining setup, running the application, and making changes based on the codebase. We use docker-compose for building and deploying the application. Additionally, we have our API specification, with a Swagger UI instance available in our docker-compose setup at localhost:8000/swagger.

When working with Docker, the initial setup might take a while as it fetches and sets up the required components. This could take tens of minutes or more, depending on your internet speed and system capabilities. Don't worry if it seems to be taking a long time. Just be patient and let it finish. As long as the build moves forward smoothly without any errors, you're on the right track. It's usually just a waiting game until it's done.

1. **Clone the Repository:**
   - Open your terminal or command prompt.
   - Navigate to the directory where you want to clone the repository.
   - Use the following command to clone the repository:
     ```
     git clone -b dev <repository_url>
     ```
   Replace `<repository_url>` with the URL of the repository you want to clone.

2. **Navigate to the Repository:**
   - Once the cloning process is complete, navigate to the cloned repository directory using the `cd` command:
     ```
     cd <repository_name>
     ```
   -cReplace `<repository_name>` with the name of the cloned repository.
   - In the repository create .env file with "nano .env" command.
   - Inside the .env write the following (You can set \<text> parts arbitrarily):
	```
	# MySQL settings
	MYSQL_ROOT_PASSWORD=<password>
	MYSQL_DATABASE=playlog_db
	MYSQL_USER=admin
	MYSQL_PASSWORD=<password>
	MYSQL_HOST=db
	MYSQL_PORT=3306
	DJANGO_SECRET_KEY=<django_secret_key>
	
	DEPLOYMENT_URL=127.0.0.1
	FRONTEND_PORT=3000
	BACKEND_PORT=8000
	```
	- After saving and exiting (ctrl x followed by y) create the same file in backend folder.
	- Create .env file in frontend folder with following:
	```
	REACT_APP_ENDPOINT=http://127.0.0.1:8000/
	```

4. **Build and Run Docker Compose:**
   - Make sure you have Docker and Docker Compose installed on your system.
   - Run the following command to build and start Docker Compose:
     ```
     docker-compose up --build
     ```
   This command will build the Docker images and start the containers defined in your `docker-compose.yaml` file.

5. **Access the Frontend and Backend:**
   - Once Docker Compose has successfully started the containers, you can access the frontend at `localhost:3000` and the backend at `localhost:8000` in your web browser.


## 📦 Deployment
To deploy our application on DigitalOcean follow these instructions:
1. Sign up to Digital Ocean and create a project.
2. From left menu click on "Droplets" and click on "Create Droplets".
3. Choose region, datacenter and a machine. Increase machine capabilities if you have errors. For image click on marketplace and select Docker.
4. Write down a password and save it for later. Click on create droplet.
5. Wait until droplet is created and copy IP address from Droplets page.
6. Open up the terminal and connect to droplet by "ssh root@<ip_address>" command.
7. Once connected to machine install docker-compose with "apt install docker-compose"
8. Clone the repository by typing "git clone https://github.com/bounswe/bounswe2024group12.git".
9. Enter into repository by typing "cd bounswe2024group12/"
10. In the repository create .env file with "nano .env" command.
11. Inside the .env write the following (You can set \<text> parts arbitrarily):
```
# MySQL settings
MYSQL_ROOT_PASSWORD=<password>
MYSQL_DATABASE=playlog_db
MYSQL_USER=admin
MYSQL_PASSWORD=<password>
MYSQL_HOST=db
MYSQL_PORT=3306
DJANGO_SECRET_KEY=<django_secret_key>

DEPLOYMENT_URL=127.0.0.1 (use your own deployment url)
FRONTEND_PORT=3000
BACKEND_PORT=8000
```
12. After saving and exiting (ctrl x followed by y) create the same file in backend folder.
13. Create .env file in frontend folder with following:
```
REACT_APP_ENDPOINT=http://127.0.0.1:8000/ (again use your deployment url)
```
14. To be safe run `docker-compose down` first then run "docker-compose up --build" command.
15. Make sure frontend and backend were able to be successfully built (ignore the warnings). After that you can access the website by typing \<ip_address>:3000 to your browser.
