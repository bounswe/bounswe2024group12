
# Milestone 2 Report Group12



## Milestone Review
**The requirements addressed in this milestone**: Below are the requirements addressed in this milestone:
- Mobile:
    - 1.1.1.3. Registered users shall be able to securely log out of their accounts.
    - 1.1.4.1.2. The platform shall support text, images, FEN notation, and (PGN notation not implemented) inside posts.
    - 1.1.4.1.3. Users shall be able to add tags to categorize their posts.
    - 1.1.4.1.3.1. Comments shall support text, images, FEN notation, and (PGN files not implemented) similar to posts.
    - 1.1.4.1.5.1. Like/Dislike functionality shall be available for all registered users.
    - 1.1.4.2.1.3. Games shall be explored with a visually animated chess board.
    - 1.1.4.2.1.6. Comments shall be able to be made under each board position of the game.
    - 1.1.6.1.2.1. The analysis tool should provide engine-based move suggestions and evaluations.
    - 1.1.6.1.2.2. Users should be able to toggle engine analysis on and off.
    - 1.1.6.1.3.1. Users should be able to add comments to specific moves or positions.
    - 2.1.1. The application shall feature an intuitive user interface with clear navigation paths and interactive elements.
    - 2.1.2. Users shall be able to easily find and access all essential features and functionalities.
    - 2.1.3. The application shall provide informative feedback for user actions, such as successful registrations, login attempts, and error messages.
    - 2.1.4. Design elements and layout shall be consistent across different pages to enhance user familiarity and usability.
>
### Deliverables
1. **List and status of deliverables**: (See the relevant links above)
1. **A summary of the project status and any changes that are planned for moving forward**:
 Our 6-person team is still making great progress on the Buchess Social project. Chess has turned out to be a goldmine for user engagement - there's so much more we can do with strategy tips, forums, leaderboards, and live game analysis. The interface needs some polish to make it more user-friendly, and we want to build up the community features. We're keeping our ears open for user feedback to make sure we're on the right track and can pivot if needed.
3. **UX design with focus on domain-specific nature of the features.**
    - We designed our UI and selected our theme to maximize readability.
    - We display comments in chronological order.
    - Each comment (annotating a move) can be found under that exact move.
5. **Description of the standard being utilized (with examples)**
    - We decided on Web Annotation Data Model standard. We written documentation [here](https://github.com/bounswe/bounswe2024group12/wiki/Web-Annotation-Data-Model-(WADM)-Documentation). We couldn't implement the standard in our yet.
7. **API Documentation**
Our 'current' API Documentation always available at https://buchessocial.online/api/swagger or swagger.json/yaml but due to this is our current deployment link, here is the latest version before milestone 2 report deadline [at this github link](https://github.com/bounswe/bounswe2024group12/blob/main/reports/api_doc.yaml)
You can easily see the UI also by pasting this yaml file into [swagger-editor](https://editor.swagger.io).
### Testing 
- The general test plan for our project involves a phased testing strategy. Initially, we have implemented unit tests for the backend and frontend components separately to ensure individual modules function as expected. Moving forward, we plan to extend our testing efforts to include integration testing to verify interactions between components and use mock data to simulate real-world scenarios. This progressive approach ensures a robust and reliable product.


- **Backend:** 
    - **Unit Testing:**
        Implemented and ran tests for key backend components across multiple apps:
        - Posts: Verified like_post and filter_games endpoints, handling pagination warnings gracefully.
        - Games: Tested add_game_comment and list_game_comments endpoints for authenticated and unauthenticated users.
        - Accounts: Covered user authentication and management functionalities.
        - Healthcheck: Validated general, database, and authenticated health checks.

    - **Test Execution Summary:**

        - Posts: 11 tests passed in 2.6 seconds.
        - Games: 3 tests passed in 0.25 seconds.
        - Accounts: 6 tests passed in 1.4 seconds.
        - Healthcheck: 4 tests passed in 1.17 seconds.
        - **Total: All 24 tests passed successfully.**
    
    - **Test Workflow:**

        Tests executed using Docker (at app/backend):
        ```
        docker-compose exec web bash test.sh
        ```
        Leveraged the `test_chess` database for isolated testing environments.

    
- **Frontend:**
    - Unit tests implemented for home page. The test suite validates the following functionality:
        - The HomeCard displays appropriate views based on user authentication status and performs necessary health checks for logged-in users.
        - For Feed functionality, tests ensure posts render with their associated like counts and SharePost visibility adapts to user authentication state.
        - Post component tests verify content rendering, user interactions like liking and deleting posts, and proper chess position display when FEN notation is present.
         - SharePost validation covers form elements, submission handling, content type support including images and chess positions, and tag management. The tests also verify proper feedback through success messages and preview functionality.
    - Run the test suite with:
    ```npm test```
    - Test summary (failures will be fixed urgently):
        - Test Suites: 1 failed, 1 total
        - Tests:       6 failed, 10 passed, 16 total
        - Snapshots:   0 total
        - Time:        10.129 s
        - Ran all test suites.
- **Mobile:**
    - LikeButton test verifies if the like button displays the correct initial count and heart icon state based on provided props.
    - AuthService test verifies that the login method successfully authenticates a user with valid credentials and returns a user object.
    - LikeService test checks if the toggleLike method properly switches a post's like status and updates the like count.
    - AuthContext test verifies that the AuthContext provides null user and empty error states on initial render.
    - PgnViewer test checks that a chess game's details (players, event, date) are correctly displayed when given valid PGN notation.
    - ThemedText test verifies that text colors adjust appropriately based on the device's light/dark theme setting.
    - LoginScreen test checks that invalid email formats trigger appropriate validation error messages.
    - CreatePostScreen test verifies that all form elements (title, content, image upload) are properly rendered.
    - MasterGameService test checks that a chess game's PGN notation is successfully retrieved using a valid game ID.
        
    - Run the test suite with:
    ```npm test```
    
    - Test summary (failures will be fixed urgently):
        - Test Suites: 9 failed, 2 passed, 11 total
        - Tests:       3 failed, 7 passed, 10 total
        - Snapshots:   0 total
        - Time:        1.528 s, estimated 3 s
        - Ran all test suites.

### Planning and Team Process

- **Changes Since Milestone 1:**
    Since Milestone 1, the team has implemented the following improvements to streamline and enhance our development process:
    - **Adoption of Code Reviews:**
Introduced code reviews for all pull requests. This ensures higher code quality and shared understanding among team members.
    - **Improved Testing Workflow:**
Integrated unit tests to catch bugs earlier and maintain code reliability.

    These changes have fostered a more collaborative, structured, and efficient workflow, reducing delays.

- **Plan for Completing the Project**
    To ensure successful delivery of the project by the final milestone, the following plan is in place:
    - **Finalizing Features:**
    Complete remaining features for the backend, frontend, and mobile app within the next two weeks.
    - **Integration Testing:**
    Conduct integration testing to ensure seamless communication between components and APIs.
    - **Bug Fixing and Refinements:**
    Allocate dedicated time for fixing bugs, optimizing performance, and refining the UI/UX.
    - **Final Presentation Preparation:**
    Create a polished demonstration for the final customer presentation.

- **Project Plan**
    The detailed project timeline is maintained using GitHub Projects, featuring the following:
    - Tasks for each team member.
    - Milestones with deadlines.
    - Progress tracking for completed, in-progress, and pending tasks.
    - [Link to the project plan](https://github.com/bounswe/bounswe2024group12/wiki/Project-Plan-CMPE451)
    - Screenshots: [Project Roadmap](https://github.com/orgs/bounswe/projects/83/views/4)




### Evaluation
1. **Evaluation of the status of deliverables and its impact on our project plan:**
    - We are not able to follow our initial plan for the deliverables. Some of our features remain implemented mostly due to the lack of enough team members. We have re-evaluated what we could do with two people in each team and tried to produce the most critical parts and keeping the app coherent. We will continue to try picking up the most important parts of our project to provide the best experience with the resources we have.
3. **A summary of the customer feedback and reflections**:
    - There should be a comment downvote feature.
    - There should be a comment report feature.
    - There should be a position analysis feature.
    - The user should be able to see all the comments for the game, not just the comments for each move.
    - There should be more complex search for games between Player A and Player B, or games with opening A, or games between years A and B.
    - There should be hyperlinks on tournament name, player name, etc. to jump to either (1) a wiki page or (2) a search result with that keyword.
5. **Evaluation of tools and processes you have used to manage your team project**:

**Evaluation of Tools**

* **GitHub**
We've relied heavily on GitHub as our main platform for sharing and collaborating on code. We use its features like issue tracking, project boards, and wikis to stay organized and efficient. By using issue tracking, we’ve managed tasks effectively and quickly addressed any project-related challenges. Our team uses the wiki to centralize documentation, making it easy for everyone to access and share project resources. Overall, GitHub has helped us streamline our workflow and improve collaboration.

* **Docker**
We’ve used Docker extensively to create consistent development environments across all team members' machines. By standardizing our setups, we’ve avoided environment-specific issues and made our development process more reliable. We also use Docker Compose to configure and automate the deployment of multiple services, such as our backend and database. This approach ensures that our development and production environments are always aligned, making our workflow smoother and more predictable.

* **Swagger**
To document our APIs, we’ve integrated Swagger into our project. We use Swagger to provide the frontend and mobile teams with a clear and interactive overview of all API endpoints. This has made it easier for us to align development efforts and minimize communication gaps. We’ve also explored tools like DRF-Spectacular and DRF-YASG to further enhance our documentation and make it more comprehensive and user-friendly.

* **DigitalOcean**
For deployment, we use DigitalOcean to host our backend and database services. We’ve set up a secure production environment with HTTPS support and configured firewall rules to protect our application. DigitalOcean allows us to scale resources based on project needs, and by integrating Docker, we’ve automated the deployment process. This has helped us maintain a secure and reliable environment for our application.

* **Google Drive & Docs**
We rely on Google Docs and Drive for creating, organizing, and storing all our project documentation. We use Google Docs to collaborate on meeting notes, research documents, and other materials, ensuring that everyone stays on the same page. By organizing everything in Google Drive, we’ve made it easy to access project resources and avoid losing important information. This approach has helped us maintain consistency and quality in our documentation.

* **Postman**
We use Postman regularly to test and validate our API endpoints. It allows us to simulate different request scenarios and debug issues efficiently. By working with Postman, we’ve ensured that our backend is reliable and performs as expected under various conditions.

* **WhatsApp**
When we need to communicate quickly, we rely on WhatsApp. It’s been an essential tool for addressing urgent issues or clarifying points during emergencies. With WhatsApp, we’ve been able to stay connected and resolve problems promptly, ensuring our project stays on track.

**Evaluation of Processes**

* **Team Meetings**
Our team held regular meetings at Lab sessions. These meetings were crucial for discussing weekly tasks, reviewing project progress, and addressing any challenges faced by team members. Before each meeting, we outlined the lab topics and estimated the time required for each topic to ensure that meetings remained focused and did not overrun. Meeting notes, including key takeaways and assigned tasks, were documented and shared via Google Docs to maintain transparency and reference.

* **Issue Management**
We managed our project workflow through GitHub’s issue management system. During our meetings, we broke down tasks and assigned them to team members by creating detailed issues in the GitHub repository. For larger tasks, we created sub-issues to make them more manageable. Each issue was given a title, description, acceptance criteria, and reviewers, ensuring clear expectations. We also used labels to prioritize and categorize tasks, which helped streamline organization and made task management more efficient for the entire team.

* **GitHub Roadmap**
We utilized GitHub's roadmap feature to plan and track the progress of our project milestones. During our initial planning sessions, we outlined key deliverables and created roadmap items to represent them. Each item was linked to specific issues and tasks in the repository, ensuring seamless tracking. We assigned due dates and team members to roadmap items, allowing us to monitor progress and stay aligned with project goals. The roadmap provided a visual overview of our development timeline, helping us prioritize tasks effectively and adapt to changes as needed. This approach kept the entire team informed and focused on achieving milestones on schedule.



## Individual Contributions


### Ahmet Fırat Gamsız
1. **Responsibilities**: I was responsible for creating the archive page, implementing comment related systems and providing feedback on various aspects.
2. **Main contributions**: 
- I've created archive page of our app. The page included displaying a chess game step-by-step.
-  I've implemented commenting system. I created a specific post page that display comments, where comments can be shared, edited and deleted.
-  I've added comments to archive page.
-  I've liking, sharing and deleting mechanisms to posts.
-  I've enhanced the theme for the web UI.
-  I've written unit-tests for home page.
-  I have contributed to milestone report.
3. **API Contribution**: 
-  I've used the following APIs. Please refer to Soner's section for details since he already explained everything in detail.
    /posts/comment/{post_id}/
    /posts/comment/{post_id}/{comment_id}/ (PUT)
    /posts/comment/{post_id}/{comment_id}/ (DELETE)
    /posts/comments/{post_id}/
    /posts/like/{post_id}/
    /posts/likes_summary/
    /posts/{post_id}/


5. **Code-related significant issues**: 
- [Add Archive Page](https://github.com/bounswe/bounswe2024group12/issues/304)
- [Enhance Post Mechanism](https://github.com/bounswe/bounswe2024group12/issues/309)
- [Enhance Archive Page](https://github.com/bounswe/bounswe2024group12/issues/310)
- [Implement unit tests for Home Page](https://github.com/bounswe/bounswe2024group12/issues/333)
- Reviewed:
    - [Enable Step-by-Step Game Navigation (With Backend Integration)](https://github.com/bounswe/bounswe2024group12/issues/328)
    - [Convert PGN to FEN Notation](https://github.com/bounswe/bounswe2024group12/issues/327)
    - [Implement Advanced Game Search (With Backend Integration)](https://github.com/bounswe/bounswe2024group12/issues/326)
    - [Implement Commenting System Per Move Per Game (With Backend Integration)](https://github.com/bounswe/bounswe2024group12/issues/325)
6. **Non-code-related significant issues**: 
- [Populate Feed Page with User Posts](https://github.com/bounswe/bounswe2024group12/issues/329)
- [Write Milestone 2 Report](https://github.com/bounswe/bounswe2024group12/issues/349)
7. **Pull requests**: 
- [Firat/archive](https://github.com/bounswe/bounswe2024group12/pull/305)
- [309 enhance post mechanism](https://github.com/bounswe/bounswe2024group12/pull/322)
- [milestone 2 deliverables](https://github.com/bounswe/bounswe2024group12/pull/324)
- [unit test environment and tests for homepage](https://github.com/bounswe/bounswe2024group12/pull/334)
- [Frontend to Main integration](https://github.com/bounswe/bounswe2024group12/pull/338)
- [LAB 6 PR](https://github.com/bounswe/bounswe2024group12/pull/302)
- Isil and I coded the front-end asynchronous all the time so we didn't have conflict problems.

7. **Additional information**: I have joined all lab meetings, actively discussed about the project with my teammates all throughout. Contributed to selection of W3C standard.

---

### Soner Kuyar

1. **Responsibilities**: In this milestone I was responsible for the creating endpoints for posts, games, likes, comments, lichess api and testing of these endpoints. I was also responsible for creating a database by fetching games from resources and complete deployment environment works (deployment of frontend-backend, getting domain name, ngnix and certificate configurations).
2. **Main contributions**:
- I've created database table composed of 28k offical matches by scraping and processing raw data from [pgnmentor](https://www.pgnmentor.com) then created endpoint for filter-search between those games on various situations.
- I've created endpoints for posts to like post, comment post, edit comment, delete comment, get comments of post, get like status of posts.
- I've added lichess token to our backend, test various lichess api endpoints then created endpoints to explore games and  get master games.
- I've acquired a domain name from [namecheap](https://www.namecheap.com) to send and accept secure request at backend.Then I created certificate for this domain name, added to our api and made ngnix configurations of our host machine.
- Even if we wrote a documentation, I helped the teammates who are using our backend to solve their issues.
- I've handled all the dev-product deployment staff for frontend and backend.
3. **API Contributions**:
I wrote and documented many endpoint as backend developer(see the code significant issues and PR's).
Here is an example: 
#### Endpoint: `/games/filter/`
- **Method**: `GET`
- **Description**: Filter chess games based on various criteria such as year, player names, site, event, and game results.
- **Operation ID**: `games_filter_list`

---

#### Parameters(all optional)

| Name     | Type    | Location | Description                                      | Example         |
|----------|---------|----------|--------------------------------------------------|-----------------|
| `year`   | integer | query    | Filter games by the year they were played.       | `2020`          |
| `player` | string  | query    | Filter by a player's surname (case-insensitive). | `Kasparov`      |
| `site`   | string  | query    | Filter by the site where the game was played.    | `New York`      |
| `event`  | string  | query    | Filter by the event's name (case-insensitive).   | `World Championship` |
| `result` | string  | query    | Filter by the game result.                       | `1-0`           |

---

#### Responses

##### `200 OK`
- **Description**: Returns a filtered list of chess games.
- **Example**:
  ```json
  {
    "games": [
      {
        "id": 1,
        "year": 1976,
        "month": 10,
        "day": 10,
        "white": "Browne, Walter S",
        "black": "Karpov, Anatoly",
        "site": "Amsterdam NED",
        "event": "Amsterdam",
        "result": "0-1",
        "pgn": "PGN content here..."
      }
    ]
  }
  ```

##### `400 Bad Request`
- **Description**: Invalid query parameters were provided.
- **Example**:
  ```json
  {
    "error": "Invalid query parameter"
  }
  ```

---

#### Summary
- **Purpose**: Enables users to search and explore historical chess games  between 2024-1976 based on their criteria. Useful for chess enthusiasts, researchers, and developers building chess analysis tools.

---

#### Example Call

**Request**:
```http
GET /games/filter/?year=1976&player=Karpov&result=0-1 HTTP/1.1
Host: buchessocial.online/api/v1/
```

**Response**:
```json
{
  "games": [
    {
      "id": 1,
      "year": 1976,
      "month": 10,
      "day": 10,
      "white": "Browne, Walter S",
      "black": "Karpov, Anatoly",
      "site": "Amsterdam NED",
      "event": "Amsterdam",
      "result": "0-1",
      "pgn": "PGN content here..."
    }
  ]
}
```

---

##### Context of Use
This API endpoint is part of a archive feature of our app:
- **Chess enthusiasts**: User can easily filter-search the games

4. **Code-related significant issues**:
(If there is enough explanation and comments under related issue I only gave the link)
- [Created Comment and Like Related Endpoints](https://github.com/bounswe/bounswe2024group12/issues/315)
- [Research and Trys about Chess Databases-API's](https://github.com/bounswe/bounswe2024group12/issues/316)
- [Conflict at Static Files of Frontend and Backend](https://github.com/bounswe/bounswe2024group12/issues/320)
- [Unit Test Creations for Backend](https://github.com/bounswe/bounswe2024group12/issues/317)
- [Collect Data and Create Games Table](https://github.com/bounswe/bounswe2024group12/issues/318)
- [Create Extensive Filtering and Search at Games](https://github.com/bounswe/bounswe2024group12/issues/319)
- [Explore Games Endpoint](https://github.com/bounswe/bounswe2024group12/issues/330)
- [Get Master Game Endpoint](https://github.com/bounswe/bounswe2024group12/issues/331)
- [Filter Games Endpoint](https://github.com/bounswe/bounswe2024group12/issues/332)
- [Deployment of Backend](https://github.com/bounswe/bounswe2024group12/issues/345)
- [Deployment of Frontend](https://github.com/bounswe/bounswe2024group12/issues/344)


5. **Non-code-related significant issues**: 
(If there is enough explanation under related issue I only gave the link)
- [Clear Irrelevant Data From Database](https://github.com/bounswe/bounswe2024group12/issues/346)
- [Write Mileston 2 Report](https://github.com/bounswe/bounswe2024group12/issues/349) : I've taken incentives, started and implements some part of report.

6. **Pull requests**: 
I wrote each commits explanation with detail what I've done item by item.
[Backend Feature Branches to Backend](https://github.com/bounswe/bounswe2024group12/pull/292):
[Backend Games and Swagger](https://github.com/bounswe/bounswe2024group12/pull/321)
[Posts Like and Comment Endpoints](https://github.com/bounswe/bounswe2024group12/pull/306)
7. **Additional information**: 
 Beside the work I've done. I generally contributed to fixing errors, wrong structures at the backend or deployment due to deployment side is not visible at Github I want to indicate it.


### Orhan Ünüvar
1. **Responsibilities**: I was responsible for testing the mobile application by writing unit tests for the various components and also manually testing all the features through both a real iOS device and an Android emulator. Additionally, I was responsible for building the mobile application for the Android platform by generating an .apk file.
2. **Main contributions**:
- I wrote unit tests for the various components of the mobile application, some of which were the login screen, the create post screen, the like button, and the PGN viewer. I wrote the unit tests using the Jest JavaScript testing framework and the React Native Testing Library.
- I manually tested all the features of the mobile application by interacting with it both on a real iOS device and an Android emulator. This proved to be a much more practical and reliable way of testing given the small scale of our application.
- I built the mobile application for the Android platform by generating an .apk file using the Expo Application Services. This proved to be much more challenging than initially expected as each build of the application would take more than 10 minutes, and each build of the application would crash as soon as it was run even after a tremendous number of tries.
3. **Code-related significant issues**:
- [Write unit tests for the components](https://github.com/bounswe/bounswe2024group12/issues/351)
    - Commits:
        - [Add unit tests](https://github.com/bounswe/bounswe2024group12/commit/e3d2740b7ad0c18275220d3ca07135b18ad9d0fb)
        - [Add more unit tests](https://github.com/bounswe/bounswe2024group12/commit/ae82ec26ce153a2fc6aa02173b7909af03c3f6ef)
- [Manually test the app](https://github.com/bounswe/bounswe2024group12/issues/352)
- [Generate the .apk file](https://github.com/bounswe/bounswe2024group12/issues/353)
4. **Non-code-related significant issues**:
    None
5. **Pull requests**:
- [Mobile/testing](https://github.com/bounswe/bounswe2024group12/pull/350)
    - There were no merge conflicts.
6. **Additional information**:
    - I attended all the lab meetings except Lab6 and Lab7 (due to health reasons), kept a close and continuous communication with my Mobile teammate, and also actively discussed the planning of the project with my teammates all throughout.

---

### Ozan Kaymak
1. **Responsibilities**: I was responsible for developing the Mobile application on top of what we had.
2. **Main contributions**:
- I implemented numerous endpoints and their interfaces on the Mobile app.
- I improved some aspects of the existing endpoints and interfaces on the Mobile app.
- I constantly tested the app by using as many scenarios as possible while I was developing. 
3. **API Contributions**:
- As the mobile app developer I implemented many API calls and evaluation of their responses. Please refer to Soner's section for details since he already explained everything in detail.
    - /posts/comment/{post_id}/
    - /posts/comment/{post_id}/{comment_id}/ (PUT)
    - /posts/comment/{post_id}/{comment_id}/ (DELETE)
    - /posts/comments/{post_id}/
    - /posts/like/{post_id}/
    - /posts/likes_summary/
    - /posts/{post_id}/
    - /games/filter/
    - /games/master_game/{game_id}
    - /games/{game_id}/add_comment/
    - /games/{game_id}/comments/
4. **Code-related significant issues**: 
- [Mobile: implement Archive Search](https://github.com/bounswe/bounswe2024group12/issues/342)
    - Commits:
        - [WIP implement archive and search](https://github.com/bounswe/bounswe2024group12/pull/343/commits/c3a000212f016f40d75b8745d39f79201065e0a5)
- [Mobile: implement adding and getting comments for the games and positions](https://github.com/bounswe/bounswe2024group12/issues/341)
    - Commits:
        - [Pgn display works on Filter + comment on position](https://github.com/bounswe/bounswe2024group12/pull/343/commits/8fba878e77fb6cb958611a70261820fbaedd8a14)
- [Mobile: Implement like and comment mechanism](https://github.com/bounswe/bounswe2024group12/issues/311)
    - Commits:
        - [WIP Like + some UI improvements](https://github.com/bounswe/bounswe2024group12/pull/343/commits/b42335c96be1311d71da40faca7618e4fffeeadc)
        - [Fix image display, add thread for posts with dummy comments](https://github.com/bounswe/bounswe2024group12/pull/343/commits/7c836cdfd4b1c32bb50acf5fdf2009cd3b9d66da)
- [Mobile: Fix sign up/log in](https://github.com/bounswe/bounswe2024group12/issues/308)
    - Commits:
        - [Change api url, refactor, add log out](https://github.com/bounswe/bounswe2024group12/pull/343/commits/e9e34b0ac2496f9339a335fe26d52411787e8e5c)
- [Mobile: Add Archive Screen](https://github.com/bounswe/bounswe2024group12/issues/312)
    - Commits:
        - [WIP Analysis Screen + PGN Display](https://github.com/bounswe/bounswe2024group12/pull/343/commits/4f7d225b7261f09305139e2a2e602664f7ce5b63)
        - [PgnViewer working + add dummy Analysis Screen Pgn](https://github.com/bounswe/bounswe2024group12/pull/343/commits/2fe5d780e05a8cbfe6183a4274c4a719b8767854)
5. **Pull requests**: 
- [Mobile/ozan improvements](https://github.com/bounswe/bounswe2024group12/pull/343)
6. **Additional information**: I attended all the lab meetings except Lab6 and Lab7 (due to health reasons), kept a close and continuous communication with my Mobile teammate, and also actively discussed the planning of the project with my teammates all throughout.


---

### Işıl Su Karakuzu
1. **Responsibilities**: I was responsible for creating the advanced search functionality in frontend, integrating backend systems for archiving games to frontend, and implementing comment-related systems in the frontend. Additionally, I provided feedback on various aspects of the project.
2. **Main contributions**:
- Advanced Search: Developed the advanced search feature for the archive page and displayed games returned from the backend.
- Game Interaction: Enabled games to be clickable, displaying Ahmet's step-by-step game logic when selected. This included backend integration.
- Chess Notation Conversion: Implemented the logic for converting PGN (Portable Game Notation) to FEN (Forsyth-Edwards Notation), enabling parsing and compatibility between different chess notations.
- Game Details Display: Used PGN data to display game details above the game visualization.
- Return to Search: Added a "Return to Search" functionality to improve navigation for users.
- Pagination and Loading Logic: Developed the pagination system and implemented loading/waiting logic for the feed page to enhance user experience.
- Mock Data Creation: Created mock data for testing and development purposes.
- Backend Team Connection: I adressed issues related to API calls and we worked together with backend team to solve them.
3. **API Contributions**:
- As a frontend developer, I implemented various API integrations and handled the processing and display of their responses within the user interface. Please refer to Soner's section for detailed explanations of the backend functionalities, as he has already outlined them comprehensively. I used this API's:
    - /posts/{post_id}/
    - /games/filter/
    - /games/{game_id}/add_comment/
    - /games/{game_id}/comments/
    - /posts/list_posts/
3. **Code-related significant issues**:
- [Enable Step-by-Step Game Navigation (With Backend Integration)](https://github.com/bounswe/bounswe2024group12/issues/328)
- [Convert PGN to FEN Notation](https://github.com/bounswe/bounswe2024group12/issues/268)
- [Implement Advanced Game Search (With Backend Integration)](https://github.com/bounswe/bounswe2024group12/issues/327)
- [Implement Commenting System Per Move Per Game (With Backend Integration)](https://github.com/bounswe/bounswe2024group12/issues/326)
- [Enhance Archive Page](https://github.com/bounswe/bounswe2024group12/issues/310)
4. **Non-code-related Significant Issues**:
- [Write Milestone 2 Report](https://github.com/bounswe/bounswe2024group12/issues/349)
5. **Pull Requests**:
- [LAB 6 PR](https://github.com/bounswe/bounswe2024group12/pull/302) I contributed to this PR.
- [milestone 2 deliverables](https://github.com/bounswe/bounswe2024group12/pull/324)
- Ahmet and I coded the front-end asynchronous all the time so we didn't have conflict problems.
6. **Additional information**: I attended all labs except the last one, so I don't have any unit tests. Contributed to selection of W3C standard.

---


### Yusuf Aygün

1. **Responsibilities**: In this milestone, I was responsible for enhancing backend architecture, implementing and refining database models, creating and maintaining API endpoints, managing the functionality for games and comments, writing comprehensive unit tests, and addressing key backend issues to improve performance and reliability.

2. **Main contributions**:
- **API Development**:
  - Developed two key endpoints for managing game comments:
    - **Add Game Comment**: Allows authenticated users to comment on specific game positions.
    - **List Game Comments**: Fetches all comments for a specific game.
- **Backend Improvements**:
  - Added a `title` field to the post model to enhance post functionality.
  - Modified the `filter_games` endpoint to include `game_id` in the response for better frontend integration.
- **Testing**:
  - Wrote and configured unit tests for multiple endpoints, including posts, likes, and comments.
  - Resolved database and configuration-related issues to ensure smooth test execution.


3. **API Contributions**:
**Endpoint Name**: Add Game Comment  
**Description**: This API allows authenticated users to add comments on specific positions in a game. The comment includes a `position_fen` string, optional related `comment_fens`, and a `comment_text`.  
**Example Call**:
```bash
POST /api/v1/games/{game_id}/comments/
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
{
    "position_fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    "comment_fens": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"],
    "comment_text": "Great move!"
}
```
Example Response:

```bash
{
    "id": 1,
    "user": "testuser",
    "game": 5,
    "position_fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    "comment_fens": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    "fens_list": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"],
    "comment_text": "Great move!",
    "created_at": "2024-11-22T12:00:00Z"
}
```
Usage Scenario: This endpoint is used in the project to allow users to comment on specific moves or positions of a chess game, contributing to a richer discussion experience around game analysis.



3. **Code-related significant issues**:
- [Unit test creations for backend](https://github.com/bounswe/bounswe2024group12/issues/317): Wrote comprehensive unit tests for various backend functionalities, including game comments and posts.
- [Add Endpoints for Game Comments](https://github.com/bounswe/bounswe2024group12/issues/323): Developed two endpoints for game comments and ensured their integration with the backend.


4. **Pull requests**: 
- [Backend Feature Branches to Backend](https://github.com/bounswe/bounswe2024group12/pull/335): Added game comment endpoints and fixed various issues.
- [Backend To Main](https://github.com/bounswe/bounswe2024group12/pull/337): Merged backend updates, including new endpoints and bug fixes, into the main branch.
- [Game comment endpoints added (commit)](https://github.com/bounswe/bounswe2024group12/commit/c0330750f580112b5779d500b3cb195ea766d9c4): Added add_game_comment and list_game_comments endpoints.
- [Field fix (commit)](https://github.com/bounswe/bounswe2024group12/commit/9641e9e99687929528a63b44ac4df0535c72b581): Fixed issues related to the post model and game filtering logic.

Developed and documented the add_game_comment and list_game_comments endpoints with comprehensive Swagger documentation. Fixed backend testing issues, including test database setup and MySQL configuration adjustments, to enable seamless test execution. Refactored backend logic for filtering games and managing post models to meet updated requirements.


5. **Additional information**: 
- Collaborated with the team to ensure backend changes aligned with project goals and frontend needs.
- Provided support for backend-related issues during development.
- Prepared the 'Planning and Team Process' section of the milestone 2 report.

