
# Milestone 1 Report Group12

## Software Requirements Specification
[Software Requirements Specification](https://github.com/bounswe/bounswe2024group12/wiki/Requirements-Document-for-CMPE451)

## Software Design (UML diagrams)
[Software Design (UML diagrams)](https://github.com/bounswe/bounswe2024group12/wiki): Accesible from sidebar at wiki

## Scenarios and Mockups
[Scenarios and Mockups](https://github.com/bounswe/bounswe2024group12/wiki): Accesible from sidebar at wiki

## Project Plan, Communication Plan, Responsibility Assignment Matrix
[ Project Plan, Communication Plan, Responsibility Assignment Matrix](https://github.com/bounswe/bounswe2024group12/wiki/Project-Plan-CMPE451) : All accessible from Project Plan Page

## Weekly reports and any additional meeting notes
[ Weekly reports and Meeting Notes](https://github.com/bounswe/bounswe2024group12/wiki): Accesible from sidebar at wiki.

## Milestone Review
1. **A summary of the project status and any changes that are planned for moving forward**: The project, currently handled by a dedicated team of 6 members, is progressing well despite the smaller team size compared to typical projects. The team has shown strong collaboration and adaptability, which has allowed for steady progress. Working within the specific domain of Chess, the project has revealed a wealth of opportunities for fostering user interaction and engagement. Chess, while specialized, is a domain rich in potential features, from game strategies and tactics to community-building elements such as forums, leaderboards, and real-time game analysis. Moving forward, the team aims to capitalize on these opportunities by exploring how to integrate features that can enhance user experience, such as interactive tools for player communication, skill tracking, and game analysis. Planned changes include refining the user interface to make it more intuitive, adding features that support community interaction, and potentially expanding to mobile platforms to increase accessibility. Furthermore, by continuously assessing the project’s scope and aligning it with user feedback, the team will ensure that the project remains flexible and responsive to new challenges and opportunities as they arise.
2. **A summary of the customer feedback and reflections**: During our recent customer presentation, we showcased the current development and outlined our app’s objectives. The customer provided valuable feedback that will help refine the user experience and functionality.
- The customer was particularly pleased with the puzzles and archive sections, appreciating these features' educational value combined with community engagement. They also acknowledged the app’s strong chess-specific focus and provided a few suggestions to enhance this specialization further.
- Key takeaways included positive feedback on the FEN notation feature for adding chessboards, although the customer suggested a more user-friendly chessboard input option to replace manual FEN entry. Additionally, they recommended incorporating more chess-specific options in posts, such as specifying whether it’s white or black to move in puzzles. From this presentation, we understand that the customer wants posts in our app to have domain-specific features rather than resembling generic forums.
3. **List and status of deliverables**: (See the relevant links above)
- Software Requirements Specification: Completed
- Software Design (UML diagrams): Completed
- Scenarios and Mockups: Completed
- Project Plan, Communication Plan, Responsibility Assignment Matrix: Completed
- Weekly reports and any additional meeting notes: Updated weekly
- Milestone Review: Completed
- Individual Contributions: Completed
- A pre-release version of your software: Completed at [release](https://github.com/bounswe/bounswe2024group12/releases/tag/customer-milestone-1)
4. **Evaluation of the status of deliverables and its impact on our project plan:**
During the demo, we encountered an issue with the backend connection, which prompted us to prioritize the SSL certificate and secure connection. Additionally, we faced some design-related challenges(alignment of object) on the frontend and encountered functional issues on mobile devices. These setbacks have collectively slowed our progress slightly, leading us to reconsider prioritizing certain features we initially marked as “should” in the requirements to better align with our adjusted timeline and resource allocation. Also we should decided to consider the standarts that we are designing to apply in out application.

5. **Evaluation of tools and processes you have used to manage your team project**:

**Evaluation of Tools**

* **GitHub**
GitHub continues to be our primary platform for sharing and collaborating on software code. GitHub is efficient due to its comprehensive features, including issue tracking, project boards, and wiki. The issue tracking feature proved invaluable in efficiently managing tasks and addressing project-related concerns. Additionally, the wiki feature served as a central space for documentation, making it easy for all team members to access project resources. GitHub’s robust capabilities streamlined our project management, promoting efficient collaboration and clear organization.

* **Docker**
Docker played a key role in our development workflow by creating a consistent environment across all team members' machines. This minimized the chances of encountering environment-specific issues and enabled a more streamlined deployment process. Using Docker Compose, we were able to configure multiple services (backend, database, etc.) and automate their deployment, simplifying the setup for all team members and ensuring consistency between development and production environments.

* **Swagger**
Swagger was integrated into the project for API documentation. By using Swagger, we provided both the frontend and mobile development teams with a clear and interactive overview of all API endpoints. This helped in aligning the development process and reducing communication overhead between teams. Additionally, we explored various Swagger-related tools such as DRF-Spectacular and DRF-YASG to enhance documentation.

* **DigitalOcean**
We used DigitalOcean for deploying our backend and database services. DigitalOcean's cloud infrastructure provided a reliable and scalable environment to host our application. By utilizing DigitalOcean, we were able to set up a production environment with HTTPS support, manage firewall rules, and allocate resources effectively based on project requirements. The integration of DigitalOcean allowed us to automate deployment through Docker and ensure a secure and accessible environment for our application.

* **Google Drive & Docs**
Google Docs and Drive remained essential for document creation, collaboration, and storage. We used Google Docs to organize meeting notes, research documents, and other materials, ensuring effective collaboration and preventing information loss. By integrating content from Google Docs, we maintained consistency and quality across all project documentation.

**Evaluation of Processes**

* **Team Meetings**
Our team held regular meetings on Google Meet. These meetings were crucial for discussing weekly tasks, reviewing project progress, and addressing any challenges faced by team members. Before each meeting, we outlined the agenda and estimated the time required for each topic to ensure that meetings remained focused and did not overrun. Meeting notes, including key takeaways and assigned tasks, were documented and shared via Google Docs to maintain transparency and reference.

* **Issue Management**
We organized our project workflow using GitHub’s issue management system. During meetings, we divided tasks among team members and created corresponding issues in our GitHub repository. Each issue was assigned to one or more team members, with the option to create sub-issues for larger tasks. Each issue included a title, description, acceptance criteria, sub-issues (if needed), and reviewers. Labels were used to prioritize and categorize issues, improving clarity and task management among team members.


6. **The requirements addressed in this milestone**: Below are the requirements addressed in this milestone:
>
    ### 1. Functional Requirements

    #### 1.1. User Requirements

    ##### 1.1.1. Account Management
    - 1.1.1.1. Users shall be able to sign up by providing email, username, and password.
    - 1.1.1.2. Registered users shall be able to log in using email and password.
    - 1.1.1.3. Registered users shall be able to securely log out of their accounts.

    ##### 1.1.4. Content Interaction

    ###### 1.1.4.1. Posts
    - 1.1.4.1.1. Specialist users shall be able to create posts.
    - 1.1.4.1.2. The platform shall support text, images, FEN notation, and PGN notation inside posts.
    - 1.1.4.1.3. Users shall be able to add tags to categorize their posts.
    - 1.1.4.1.5. The platform shall support hyperlinks and internal referencing:
        - 1.1.4.1.4.1. External hyperlinks shall be supported.
    - 1.1.4.1.7. A main feed shall display posts from the entire site.

    ##### 1.1.6. Analysis
    - 1.1.6.1. The platform shall provide an analysis tool similar to Lichess's analysis board.
        - 1.1.6.1.1. Interactive Chess Board
            - 1.1.6.1.1.2. The chess board shall support drag-and-drop functionality for moving pieces.

    ### 2. Non-Functional Requirements

    #### 2.1. Usability
    - 2.1.1. The application shall feature an intuitive user interface with clear navigation paths and interactive elements.

    #### 2.2. Accessibility and Availability
    - 2.2.1. The application shall be accessible via various web browsers, including Chrome, Firefox, Safari, and Edge.
    - 2.2.2. The application shall be available in English.
    - 2.2.3. The application shall comply with Web Content Accessibility Guidelines to ensure accessibility for all users.
    - 2.2.4. The Android application shall support Android 5.0 and above.

    #### 2.3. Security
    - 2.3.1. All passwords stored in the database shall be encrypted using industry-standard encryption methods.
    - 2.3.2. User data shall be securely stored and protected against unauthorized access.

    #### 2.5. Legal
    - 2.5.1. The application shall comply with KVCC privacy regulations.

    #### 2.6. Standards
    - 2.6.1. The system shall comply with W3C Standards to ensure interoperability and accessibility.
>

## Individual Contributions


### Ahmet Fırat Gamsız
1. **Responsibilities**: I was responsible for creating the main feed of our app, creating use-case diagram and providing feedback on various aspects.
2. **Main contributions**: 
- I've created home page of our app. The page included posting and viewing posts features.
-  I've integrated the chessboard rendering logic to our app.
-  I've created use-case diagram of our app.
-  I've contributed to requirements, including giving feedback and deciding on user leveling system.
-  I've implemented a basic theme for the web UI.
-  We initialized the web app with Isil.
-  I have contributed to milestone report.
3. **Code-related significant issues**: 
- [Initialize Frontend with React](https://github.com/bounswe/bounswe2024group12/issues/258)
    - PR: [init: login-signup-home page](https://github.com/bounswe/bounswe2024group12/pull/267)
    - We did this initialization with Isil in her computer.
- [Add Home Page](https://github.com/bounswe/bounswe2024group12/issues/271)
    - Check commits from this PR: [Afg/home page](https://github.com/bounswe/bounswe2024group12/pull/290)
    - [Implement Post Functionality](https://github.com/bounswe/bounswe2024group12/issues/286)
    - [Implement Feed Functionality](https://github.com/bounswe/bounswe2024group12/issues/287)
    - [Implement FEN rendering](https://github.com/bounswe/bounswe2024group12/issues/288)
- Reviewed:
    - [Deployment of Frontend](https://github.com/bounswe/bounswe2024group12/issues/298)
4. **Non-code-related significant issues**: 
- [Create Use Case Diagram](https://github.com/bounswe/bounswe2024group12/issues/280)
- [Organizing Personal Pages](https://github.com/bounswe/bounswe2024group12/issues/252)
- [Put the personal pages in the sidebar](https://github.com/bounswe/bounswe2024group12/issues/254)
- Reviewed:
    - [Prapering Github Project On Projects Tab](https://github.com/bounswe/bounswe2024group12/issues/272)
    - [Create RAM](https://github.com/bounswe/bounswe2024group12/issues/273)
5. **Pull requests**: 
- [Afg/home page](https://github.com/bounswe/bounswe2024group12/pull/290)
- I was the first one merging to frontend so I didn't have conflicts.

6. **Additional information**: I have joined all lab meetings except the first one (I was abroad), join our front-end meetings, actively discussed the planning of the project with my teammates all throughout. Also took notes for the Lab 3 [Meeting #3 ‐ 01.10.2024](https://github.com/bounswe/bounswe2024group12/wiki/Meeting-%233-%E2%80%90-01.10.2024)

---

### Soner Kuyar

1. **Responsibilities**: In this milestone I was responsible for the creating a maintainable backend-database structure, commiting to software and system designs, creating a project plan and deployment of the products. 
2. **Main contributions**:
- I've created Django-Mysql based backend and create maintanable and modular backend structure by versionizing it.
- I've created and maintained the deployment environment from scratch, added Self Signed SSL key, arrange port numbers, choosing the machine for our requirements. Creating SSH keys for access to deploy environments, arranging firewalls, cors access.Deployed backend and frontend.
- I've created token base authentication to backend, manage the creating-expiration process of tokens , wrote login-signup functionalities.Created User model. 
- I try to help my backend teammate both at the designing phase of backend, fixing the issues and bugs.
- I created 2 User scenarios while creating it I gave feedback to the also requirements.

3. **Code-related significant issues**:
(If there is enough explanation under related issue I only gave the link)
- [Initialize backend with Django](https://github.com/bounswe/bounswe2024group12/issues/259)
- [Initalize database with MySQL](https://github.com/bounswe/bounswe2024group12/issues/261): I created a docker file which ensures database is running and up before building Backend (which we dealt too much last semester)
- [Integrate Swagger for API Documentation](https://github.com/bounswe/bounswe2024group12/issues/261): I fixed the problem at the not-rendering UI of Swagger by adding staticfiles.
- [Define Endpoints for Milestone 1](https://github.com/bounswe/bounswe2024group12/issues/284): I created apps for accounts and posts. Define accounts endpoints before implementing it to help frontend and mobile to ease their work.
- [Implement Authorization Logic](https://github.com/bounswe/bounswe2024group12/issues/291)
- [Deployment of Backend](https://github.com/bounswe/bounswe2024group12/issues/282)
- [Deployment of Frontend](https://github.com/bounswe/bounswe2024group12/issues/298)

The issues that you have personally resolved or reviewed that contribute to the code base demonstrated during the demo. You must provide the relevant PRs and commits.
5. **Non-code-related significant issues**: 
(If there is enough explanation under related issue I only gave the link)
- [Create an Extensive Project Plan](https://github.com/bounswe/bounswe2024group12/issues/257)
- [Create Scenarios for the Project](https://github.com/bounswe/bounswe2024group12/issues/264): I've created 2nd and 4th Scenarios.
- [Preparing Github Projects on Projects Tab](https://github.com/bounswe/bounswe2024group12/issues/272)
- [Setup Instructions](https://github.com/bounswe/bounswe2024group12/issues/293)

The issues that you have personally resolved or reviewed, with brief explanations.
4. **Pull requests**: 
[Create Backend Pre-Release Endpoints](https://github.com/bounswe/bounswe2024group12/pull/292):
    There is two but but a big PR that I contribute it, at each commit in PR.There are detailed explanations about the bug fix, feature etc.
    
[Backend Swagger and Deployment](https://github.com/bounswe/bounswe2024group12/pull/283)
5. **Additional information**: 
 Beside the work I've done. I generally contributed to fixing errors, wrong structures at the backend or deployment due to deployment side is not visible at Github I want to indicate it.
[Commit 1](https://github.com/bounswe/bounswe2024group12/pull/292/commits/329db9681fa0bc9881f983f8788dbe55145263f0)
[Commit 2](https://github.com/bounswe/bounswe2024group12/pull/292/commits/ed3dfa8646106b8a5de46f28f48cb93cefecf306)
[Commit 3](https://github.com/bounswe/bounswe2024group12/pull/292/commits/2b35b011c829bb69c3aeff4dc856c6465cdd1581)

---

### Orhan Unuvar
1. **Responsibilities**: I was responsible for the creating the mobile application, contributing to the codebase, and defining the requirements. 
1. **Main contributions**:
- I wrote the requirements document, took feedback from my team members regarding it, and then fixed these issues in the requirements document.
- I created the home screen, the analysis screen, and the create post screen of the mobile app.
- I implemented the logic required on these screens and also the UI to make them visually appealing.
2. **Code-related significant issues**:
- [Add interactive chess board to the analysis page](https://github.com/bounswe/bounswe2024group12/issues/289)
    - Commits:
        - [Add interactive chess board under the analysis page](https://github.com/bounswe/bounswe2024group12/commit/2e3d8a70895f581fd01177232dde1434c4ab9740)
- [Initialize Mobile with React Native](https://github.com/bounswe/bounswe2024group12/issues/260)
    - Commits:
        - [Add initial mock home page with layout](https://github.com/bounswe/bounswe2024group12/commit/4b6c23fa245c1d2be315916a8713b819fd483a14)
        - [Add mock login and profile picture](https://github.com/bounswe/bounswe2024group12/commit/34cbd1aa5aa038594fbf36ba7f3ead95eb4d30c8)
- [Add "Create Post" page with FEN attachment feature](https://github.com/bounswe/bounswe2024group12/issues/299)
    - Commits:
        - [Add "Create Post" page with FEN attachment feature](https://github.com/bounswe/bounswe2024group12/commit/4b46f03f9f6e81846f50258931cfe263c6346afe)
3. **Non-code-related significant issues**:
- [Prepare Requirements for the Project](https://github.com/bounswe/bounswe2024group12/issues/256)
- [Organizing Personal Pages](https://github.com/bounswe/bounswe2024group12/issues/252)
- [Put the personal pages in the sidebar](https://github.com/bounswe/bounswe2024group12/issues/254)
- [Add lab report 3](https://github.com/bounswe/bounswe2024group12/issues/266)
4. **Pull requests**:
- [add mobile to main](https://github.com/bounswe/bounswe2024group12/pull/297)
    - There was a merge conflict and I resolved it by accepting everything that was coming from the main branch.
5. **Additional information**:
    - I attended all the lab meetings, attended all online (Zoom) meetings, and also actively discussed the planning of the project with my teammates all throughout.

---

### Ozan Kaymak
1. **Responsibilities**: I was responsible for creating the mobile application, contributing to the codebase, and preparing the sequence diagrams.
2. **Main contributions**: I wrote the Sequence diagrams.
- I created log in and home screen with Orhan Unuvar, created the sign up screen, and added the endpoints for the backend.
3. **Code-related significant issues**: [Initialize Mobile with React Native](https://github.com/bounswe/bounswe2024group12/issues/260)
    - Commits:
        - [Initial commit](https://github.com/bounswe/bounswe2024group12/commit/06186e20a6ba5907d7d7ceada2ece97727744048)
        - [Add login and signup endpoints with signup page](https://github.com/bounswe/bounswe2024group12/commit/728e9a3e281bec35f312ec868a67c46007eec150)
4. **Non-code-related significant issues**: 
- [Create Sequence Diagrams](https://github.com/bounswe/bounswe2024group12/issues/279)
- [Organizing Personal Pages](https://github.com/bounswe/bounswe2024group12/issues/252)
- [Put the personal pages in the sidebar](https://github.com/bounswe/bounswe2024group12/issues/254)
- **Pull requests**: None
5. **Additional information**: I attended all the lab meetings except Lab5 (due to health reasons), attended all online (Zoom) meetings, and also actively discussed the planning of the project with my teammates all throughout.


---

### Işıl Su Karakuzu
1. **Responsibilities**: I created mockups and wrote the Lab 1 report. Additionally, I took notes during our second online meeting and contributed as part of the frontend team.
2. **Main contributions**: I developed the Login and Signup pages with persistent login functionality and token management. I also implemented user/guest distinction on the home page and in the feed, controlling access to the "share posts" feature. Before the presentation, I quickly addressed bugs on the client side related to frontend and backend interactions, such as pagination and URL errors, to prevent crashes. I also merged all frontend branches, resolved conflicts, and updated sections to be presentation-ready. In addition to my coding contributions, I did customer presentation, I opened issues in labs, designed mockup pages, documented the Lab 1 report, took notes during the second online meeting, and created our communication plan. I reviewed the sequence diagram with Ozan and ensured our project wiki, including the home and sidebar sections, remains current and organized.
3. **Code-related significant issues**:
- [Initialize Frontend with React](https://github.com/bounswe/bounswe2024group12/issues/258)
- [Add Login Page](https://github.com/bounswe/bounswe2024group12/issues/268)
- [Add Signup Page](https://github.com/bounswe/bounswe2024group12/issues/269)
4. **Non-code-related Significant Issues**:
- [Create Mockups for the Project](https://github.com/bounswe/bounswe2024group12/issues/263)
- [Develop Project Scenarios](https://github.com/bounswe/bounswe2024group12/issues/264) I reviewed this issue.
- [Implement Feed Functionality](https://github.com/bounswe/bounswe2024group12/issues/287) I reviewed and fixed problems with this code. [Related Commit](https://github.com/bounswe/bounswe2024group12/pull/296/commits/cf75581519a67ccde08d6c92b2c62a18acb0fdb0)
- [Implement Post Functionality](https://github.com/bounswe/bounswe2024group12/issues/286) I reviewed and fixed problems with this code. [Related Commit](https://github.com/bounswe/bounswe2024group12/pull/296/commits/a5af68035aaf7b08b27a775599ecb2fffafa04fb)
- [Backend Deployment](https://github.com/bounswe/bounswe2024group12/issues/282) I suggested deploying backend for ease the development process, I reviewed it.
- [Create Sequence Diagrams](https://github.com/bounswe/bounswe2024group12/issues/279) I reviewed and talked with Ozan.
- [Create Communication Plan](https://github.com/bounswe/bounswe2024group12/issues/253)
- [Document Meeting 1 Report (Lab)](https://github.com/bounswe/bounswe2024group12/issues/251)
5. **Pull Requests**:
- [Init Frontend](https://github.com/bounswe/bounswe2024group12/pull/267)
- [Login Page](https://github.com/bounswe/bounswe2024group12/pull/294)
- [Sign Up Page](https://github.com/bounswe/bounswe2024group12/pull/295)
- [Add Frontend to Main](https://github.com/bounswe/bounswe2024group12/pull/296) This had merge conflicts. I solved them.
6. **Additional information**: I attended all lab and online meetings, organized task distribution, and was actively involved in initial discussions about frontend design and implementation.

---


### Yusuf Aygün

1. **Responsibilities**: In this milestone, I was responsible for designing and developing the backend architecture, implementing database models and API endpoints, managing Posts app functionality, adding Swagger UI and creating class diagrams and user scenarios.
2. **Main contributions**:
- I set up the backend project with API documentation using Swagger and explored various API documentation tools like DRF-Spectacular and DRF-YASG to support the frontend and mobile teams.
- I created a post model and established user-post relationships.
- I've implemented endpoints in Posts app such as get_post, create_post and list_posts. 
- I created 3 User scenarios.
- I created the Class Diagram.

3. **Code-related significant issues**:
- [Define Endpoints for Milestone 1](https://github.com/bounswe/bounswe2024group12/issues/284)
- [Integrate Swagger for API Documentation](https://github.com/bounswe/bounswe2024group12/issues/270)
- [Implement Logic of Posts App](https://github.com/bounswe/bounswe2024group12/issues/285):


The issues that you have personally resolved or reviewed that contribute to the code base demonstrated during the demo. You must provide the relevant PRs and commits.
5. **Non-code-related significant issues**: 
- [Create Class Diagram](https://github.com/bounswe/bounswe2024group12/issues/281)
- [Create Scenarios for the Project](https://github.com/bounswe/bounswe2024group12/issues/264): I've created 1st and 3rd and 5th Scenarios.


The issues that you have personally resolved or reviewed, with brief explanations.
4. **Pull requests**: 
[Create Backend Pre-Release Endpoints](https://github.com/bounswe/bounswe2024group12/pull/292)
    
[Backend Swagger and Deployment](https://github.com/bounswe/bounswe2024group12/pull/283)

5. **Additional information**: 
 - I attended all the meetings.
 - Also, I maintained constant communication with my backend teammate to quickly gain knowledge about backend-related tasks and worked in alignment with his guidance to write clean and well-structured code together

