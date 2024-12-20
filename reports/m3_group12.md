# Group Milestone 3 Report

## 1. Executive Summary
### Project Status Summary

The project has achieved a comprehensive chess social platform with core features implemented and deployed. Key accomplishments include:

- **Frontend & Mobile**: Fully functional user interface with chess game visualization, posting, commenting, profile management, and semantic browsing
- **Backend**: Robust API supporting user authentication, game data management, annotations (W3C compliant), and social features
- **Database**: Successfully populated with 28,000 chess games and supporting data structures

**Remaining Items**:
- Puzzle creation/solving functionality
- Engine analysis integration
- Advanced game analysis features
- Administrative tools
- Opening explorer

Product maturity is high for core social and chess viewing features, with refined UI/UX and stable backend services. The platform is production-ready for basic chess content sharing and game exploration.
### Status of Deliverables

**Frontend Features**
✓ Fully Complete (Implemented, Tested, Documented, Deployed):
- User Authentication
- Post Creation/Management
- Feed Systems (Main & Follow)
- Game Archive Features
- Semantic Browsing
- Annotations (W3C compliant)

⚡ In Progress:
- Full-Text Search
- Autocomplete Features
- Result Categorization

**Backend Features**
✓ Fully Complete:
- API Endpoints (Authentication, Posts, Games, Users)
- Database Integration
- Tournament Management
- Puzzle System
- Bookmarking Features
- W3C Annotation Implementation
- User Follow System

⚡ In Progress:
- Advanced Search Optimization
- User Leveling System

**Mobile Features**
✓ Fully Complete:
- User Authentication
- Profile Management
- Post/Game Bookmarking
- Game Analysis Features
- Post Creation/Viewing

❌ Not Started:
- Puzzle Creation System
- Advanced Analysis Tools
- Endgame Tablebases

### Final Release Notes

#### Major Improvements
- Implemented W3C-compliant annotation system for games and positions
- Added semantic browsing with position-based game exploration
- Introduced bookmarking for posts, games, and game moves
- Added user profiles with follow/unfollow functionality
- Enhanced search capabilities with player, tournament, and game filters
- Integrated tournament data and viewing features
- Added post tagging and filtering system
- Implemented multi-step commenting on games

#### Known Issues
- Tournament page comments feature not yet implemented
- Full-text search functionality partially implemented
- Auto-complete suggestions in search bar pending
- Retweeting posts feature pending
- Admin moderation features partially implemented
- Email verification system pending
- Engine analysis tool pending implementation

### Changes Made to Improve Development Process

1. Strengthened code review process by requiring 2 reviewers per PR and implementing mandatory unit test coverage checks, improving code quality and reducing bugs.
2. Enhanced CI/CD pipeline by:
   - Adding automated test runs before merges
   - Implementing Docker container health checks
   - Setting up automated deployment to production environment
3. Improved sprint planning with:
   - Weekly sync meetings focused on blockers
   - Clear task dependencies documentation
   - Individual progress tracking in GitHub Projects
4. Standardized API documentation using Swagger, facilitating better frontend-backend integration.

### Reflections on the Final Milestone Demo
#### Lessons Learned
- Demo success: Strong user interface demos across web/mobile platforms, well-executed annotation features, and seamless navigation between games/tournaments
- Technical challenges: Integration issues between frontend and backend for complex features like semantic browsing and annotations required last-minute fixes
- Performance bottlenecks discovered in handling large game datasets and position-based searches during live demo
- Team coordination improved through regular sync meetings and clear API documentation

#### What Could Have Been Done Differently
- Earlier implementation of core features like annotations and semantic browsing to allow more testing time
- More frequent integration testing between frontend/backend teams to catch compatibility issues earlier
- Better initial database design to handle game relationships and annotations more efficiently
- Earlier focus on performance optimization for large dataset handling
- More structured approach to API documentation from project start to reduce integration friction

## 2. Progress Based on Teamwork
- **Team Contributions Table**: 

| Member Name        | Subgroup | Key Features Implemented                                                                                   | Issues Resolved                                                                                                                                                                                                                                                                                                                                                                                                                                              | Tests Written                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Documentation & Other Contributions |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| Ahmet Fırat Gamsız | Frontend | Semantic Browsing, Annotate Steps, Multistep Comments, Fix Unit Tests for Home Page, Annotation Unit Tests | [Frontend: Adapt Feed Logic](https://github.com/bounswe/bounswe2024group12/issues/379), [Frontend: Duplicate Post Issue](https://github.com/bounswe/bounswe2024group12/issues/378), [Frontend: Bookmarking](https://github.com/bounswe/bounswe2024group12/issues/363), [Frontend: Enhance Post Tags](https://github.com/bounswe/bounswe2024group12/issues/362), [Frontend: Implement profile page](https://github.com/bounswe/bounswe2024group12/issues/361) | [Annotation Features tests](https://github.com/bounswe/bounswe2024group12/blob/main/frontend/src/components/archivepage/__tests__/AnnotationFeatures.test.jsx), [Comment Features tests](https://github.com/bounswe/bounswe2024group12/blob/main/frontend/src/components/archivepage/__tests__/CommentFeatures.test.jsx), [Game Screen tests](https://github.com/bounswe/bounswe2024group12/blob/main/frontend/src/components/archivepage/__tests__/GameScreen.test.jsx) | ...                                 |
| Orhan Ünüvar       | Mobile   | Profile Page, Post Bookmarking, Game Bookmarking                                                                                                        | [Mobile: Remove Search Post by id from the Main Screen](https://github.com/bounswe/bounswe2024group12/issues/371), [Mobile: Implement profile page for users](https://github.com/bounswe/bounswe2024group12/issues/359), [Mobile: Implement saving](https://github.com/bounswe/bounswe2024group12/issues/360)                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [LikeButton Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/components/LikeButton.test.js), [PgnViewer Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/components/PgnViewer.test.js), [ThemedText Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/components/ThemedText.test.js), [AuthContext Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/contexts/AuthContext.test.js), [CreatePostScreen Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/screens/CreatePostScreen.test.js), [LoginScreen Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/screens/LoginScreen.test.js), [AuthService Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/services/AuthService.test.js), [LikeService Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/services/LikeService.test.js), [MasterGameService Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/services/MasterGameService.test.js)                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | - Reviewed and provided feedback on team member pull requests <br> - Actively participated in all lab sessions <br> - Coordinated closely with frontend, backend, and my mobile teammate to ensure a consistent user experience (UX) and smooth collaboration <br> - Contributed towards presentation story                                 |
| Ozan Kaymak        | Mobile   | Fixing APK generation, Fixing or improving many UI/UX components, Add Puzzles and Playgorund, Implement Search flow, Implement Feedbacks                                                                                                        |     [Mobile: Add tags button doesn't work](https://github.com/bounswe/bounswe2024group12/issues/339) [Mobile: Add FEN doesn't work](https://github.com/bounswe/bounswe2024group12/issues/340) [Mobile: Fix APK generation](https://github.com/bounswe/bounswe2024group12/issues/347) [Mobile: Add puzzles screen](https://github.com/bounswe/bounswe2024group12/issues/354) [Mobile: Add playground](https://github.com/bounswe/bounswe2024group12/issues/355) [Implement Player/Tournament Search Flow](https://github.com/bounswe/bounswe2024group12/issues/367) [Mobile: Make Position Copyable on Game Analysis Screen](https://github.com/bounswe/bounswe2024group12/issues/372)                                                                                                                                                                                                                                                                                                                                                                                                                                                          | None | - Reviewed and provided feedback on team member pull requests <br> - Actively participated in all lab sessions <br> - Coordinated closely with frontend, backend, and my mobile teammate to ensure a consistent user experience (UX) and smooth collaboration <br> - Helped with presentation and its story                                 |
| Işıl Su Karakuzu   | Frontend |    Profile page with liked/bookmarked posts, Follow/unfollow, viewing feeds, Feed filtering and duplicate post fix                                                                                                | ...                                                                                                                                                                                                                                                                                                                                                                                                                                                          | ...                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Contributed to documentation, including UX-related sections and personal contributions.                               |
| Yusuf Aygün    | Backend  |- Bookmark endpoints for posts, games, and game moves <br> - Follow/unfollow functionality<br> - User page endpoints for user-specific information (likes, bookmarks, follow details)<br> - Annotation endpoints compliant with W3C Web Annotation Data Model | - [Backend: Implement Bookmarking Feature](https://github.com/bounswe/bounswe2024group12/issues/366)<br> - [Backend: Create Follow/Unfollow User Endpoint](https://github.com/bounswe/bounswe2024group12/issues/370)<br> - [Backend: Create Backend Structure for Annotations](https://github.com/bounswe/bounswe2024group12/issues/373)<br> - [Backend: Create User Page Endpoints](https://github.com/bounswe/bounswe2024group12/issues/377) | - [Annotation Test Suite](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/games/tests.py)<br> - [User Page Test Suite](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/accounts/tests.py)<br> - [Follow/Unfollow Test Suite](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/accounts/tests.py)<br> - [Bookmark Test Suite for Games and Game Moves](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/games/tests.py)<br> - [Bookmark Test Suite for Posts](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/posts/tests.py) | - Contributed to Swagger documentation and endpoint descriptions<br> - Reviewed and provided feedback on team member pull requests|
| Soner Kuyar        | Backend  | - Fetching puzzles feature ([PR #381](https://github.com/bounswe/bounswe2024group12/pull/381)) <br>- Tournament endpoints ([PR #397](https://github.com/bounswe/bounswe2024group12/pull/397)) <br>- Edit-Delete endpoints for posts ([PR #383](https://github.com/bounswe/bounswe2024group12/pull/383)) <br>- Enhancing post listing ([PR #384](https://github.com/bounswe/bounswe2024group12/pull/384)) <br>- Opening retrieval ([PR #395](https://github.com/bounswe/bounswe2024group12/pull/395)) <br>- Backend deployment ([PR #414](https://github.com/bounswe/bounswe2024group12/pull/414)) <br>- Bug fixes during deployment ([PR #414](https://github.com/bounswe/bounswe2024group12/pull/414)) <br>- Data preparation ([PR #407](https://github.com/bounswe/bounswe2024group12/pull/407)) <br>- Integration with Lichess API | - [Backend: Implement Fetching Puzzles feature](https://github.com/bounswe/bounswe2024group12/issues/365) <br>- [Backend: Create Tournaments Endpoints](https://github.com/bounswe/bounswe2024group12/issues/396) <br>- [Backend: Create Edit-Delete endpoints for Posts](https://github.com/bounswe/bounswe2024group12/issues/368) <br>- [Backend: Enhance List post items endpoint](https://github.com/bounswe/bounswe2024group12/issues/369) <br>- [Backend: Create get opening endpoint](https://github.com/bounswe/bounswe2024group12/issues/394) <br>- [Backend: Deploy the backend app](https://github.com/bounswe/bounswe2024group12/issues/420) <br>- [Backend: Solve backend init before db healthy](https://github.com/bounswe/bounswe2024group12/issues/410) <br>- [Backend: Fix the try it out bug at deployment](https://github.com/bounswe/bounswe2024group12/issues/393) <br>- [Database: Add deployment dataset into final product](https://github.com/bounswe/bounswe2024group12/issues/399) | - [Puzzle Tests](https://github.com/bounswe/bounswe2024group12/pull/381/commits) <br>- [Tournament Tests](https://github.com/bounswe/bounswe2024group12/pull/397/commits/ec766883bb26381b386ae31a37230506b5253b83) <br>- [Opening Tests](https://github.com/bounswe/bounswe2024group12/pull/395/commits/8131ef4c7ffd14e3e15f41cddd2a0daaabd225c1) | - Customer Milestone Presentation lead with Ozan <br>- Backend & Frontend deployments <br>- Database scripts/maintenance <br>- Provided feedback under issues actively                                                                                 |


## 3. Status of Requirements
- **Requirements Progress**: 
- ### 1. Functional Requirements

#### 1.1. User Requirements

##### 1.1.1. Account Management
- 1.1.1.1. Users shall be able to sign up by providing email, username, and password. (Frontend: Complete)
- 1.1.1.2. Registered users shall be able to log in using email and password.(Frontend: Complete)
- 1.1.1.3. Registered users shall be able to securely log out of their accounts.(Frontend: Complete)
- 1.1.1.4. Registered users shall be able to delete their accounts, which will:
    - 1.1.1.4.1. Remove their profile from visibility.
    - 1.1.1.4.2. Remove all of their content (e.g., posts, comments) from the platform.
    - 1.1.1.4.3. Free up their email and username for future registrations.
- 1.1.1.5. Registered users shall be able to change their passwords.
- 1.1.1.6. Registered users shall be able to reset their passwords via email authentication.
- 1.1.1.7. Email addresses shall be verified for account activation.

##### 1.1.2. Leveling System
- 1.1.2.1. Levels shall be assigned based on the forum rating.
- 1.1.2.2. Forum rating shall accumulate based on user interactions such as posts, likes, puzzle upvotes, and comments.
- 1.1.2.3. There should be four levels: Rookie, Specialist, Expert, and Legend.

##### 1.1.3. Social Interaction
- 1.1.3.1. Registered users shall be able to follow or unfollow other registered users.(Frontend: Complete)
- 1.1.3.2. Legend users' likes/dislikes and puzzle upvotes/downvotes should be displayed separately, distinguishing their significance.

##### 1.1.4. Content Interaction

###### 1.1.4.1. Posts
- 1.1.4.1.1. ~~Specialist~~ users shall be able to create posts.(Frontend: Complete)
- 1.1.4.1.2. The platform shall support text, images, FEN notation, and PGN notation inside posts.(Frontend: Complete)
- 1.1.4.1.3. Users shall be able to add tags to categorize their posts.(Frontend: Complete)
- 1.1.4.1.4. Posts shall be commentable by specialist users.
    - 1.1.4.1.3.1. Comments shall support text, images, FEN notation, and PGN files similar to posts.
- 1.1.4.1.5. The platform shall support hyperlinks and internal referencing:
    - 1.1.4.1.4.1. External hyperlinks shall be supported.
    - 1.1.4.1.4.2. Internal page references shall feature auto-completion for easy navigation.
- 1.1.4.1.6. Users shall be able to interact with posts as follows:(Frontend: Complete)
    - 1.1.4.1.5.1. Like/Dislike functionality shall be available for all registered users.
    - 1.1.4.1.5.2. Sharing posts via external links shall be supported.
    - 1.1.4.1.5.3. Retweeting posts to add to their feeds shall be available to specialist users. (Frontend: Not started)
    - 1.1.4.1.5.3. Bookmarking posts should be an available feature.
- 1.1.4.1.7. A main feed shall display posts from the entire site. (Frontend: Complete)
- 1.1.4.1.6. A follow feed shall display posts from users that the logged-in user follows.(Frontend: Complete)
- 1.1.4.1.8. Users shall be able to filter posts by tags:(Frontend: Complete)
    - 1.1.4.1.8.1. Available tags shall include tournament organization, coaching, tip, recommendation, gathering, player, fun fact, and meme.
    - 1.1.4.1.8.2. Administrators shall be able to add new tags as needed.


###### 1.1.4.2. Archive
- 1.1.4.2.1. Games:
    - 1.1.4.2.1.1. Users shall be able to jump from a game to the players who played the game.(Frontend: Complete)
    - 1.1.4.2.1.2. Users shall be able to jump from a game to the tournament it was played in.(Frontend: Complete)
    - 1.1.4.2.1.3. Games shall be explored with a visually animated chess board.(Frontend: Complete)
    - 1.1.4.2.1.4. Games shall display the name of its opening.
    - 1.1.4.2.1.5. At every board position, several other games which reached that position shall be listed.(Frontend: Complete)
    - 1.1.4.2.1.6. Comments shall be able to be made under each board position of the game.(Frontend: Complete)


- 1.1.4.2.2. Players:
    - 1.1.4.2.2.1. Users shall be able to jump from a player to games he/she played.(Frontend: Complete)
    - 1.1.4.2.2.2. Users shall be able to jump from a player to tournaments he/she played in.(Frontend: Complete)
    - 1.1.4.2.2.3. Players' information shall be listed (name, age, nationality, etc.).
    - 1.1.4.2.2.4. Comments should be able to be made under each player profile.


- 1.1.4.2.3. Tournaments:
    - 1.1.4.2.3.1. Users shall be able to jump from a tournament to games played in it.(Frontend: Complete)
    - 1.1.4.2.3.2. Users shall be able to jump from a tournament to players who played in it.(Frontend: Complete)
    - 1.1.4.2.3.3. Tournament information shall be listed (year, place, etc.).
    - 1.1.4.2.3.4. Comments should be able to be made under each tournament.

###### 1.1.4.3. Puzzles
- 1.1.4.3.1. Users shall be able to play puzzles.
- 1.1.4.3.2. Expert users shall be able to create puzzles, and other users shall be able to upvote/downvote them, affecting the original poster's forum rating.


##### 1.1.5. Search
   - 1.1.5.1. The platform shall support advanced search capabilities across all content types within the platform.(Frontend: Complete)
     - 1.1.5.1.1. Full-Text Search: Users shall be able to perform full-text searches across posts, comments, games, and user profiles.(Frontend: Not started)
     - 1.1.5.1.2. Faceted Filtering: Users shall be able to filter search results based on content type, tags, game properties, and date ranges.(Frontend: Complete)
     - 1.1.5.1.3. Autocomplete and Suggestions: The search bar should provide real-time autocomplete suggestions and relevant search prompts.(Frontend: Not started)
     - 1.1.5.1.4. Result Categorization: Search results shall be categorized by content type (e.g., posts, users, games) to facilitate easy navigation.(Frontend: Not started)

##### 1.1.6. Analysis
- 1.1.6.1. The platform shall provide an analysis tool similar to Lichess's analysis board.
    - 1.1.6.1.1. Interactive Chess Board
        - 1.1.6.1.1.1. Users shall be able to input moves manually to set up positions.
        - 1.1.6.1.1.2. The chess board shall support drag-and-drop functionality for moving pieces.
    - 1.1.6.1.2. Game Analysis
        - 1.1.6.1.2.1. The analysis tool should provide engine-based move suggestions and evaluations.
        - 1.1.6.1.2.2. Users should be able to toggle engine analysis on and off.
        - 1.1.6.1.2.3. The tool shall display move numbers, annotations, and evaluations.
    - 1.1.6.1.3. Annotations and Comments
        - 1.1.6.1.3.1. Users should be able to add comments to specific moves or positions.
        - 1.1.6.1.3.2. The analysis board should support saving annotated games for future reference.
    - 1.1.6.1.4. Import and Export
        - 1.1.6.1.4.1. Users shall be able to import games using PGN files into the analysis tool.
        - 1.1.6.1.4.2. Users shall be able to export analyzed games as PGN files.
    - 1.1.6.1.5. Sharing Analysis
        - 1.1.6.1.5.1. Users should be able to share their analysis boards or specific positions via links.
        - 1.1.6.1.5.2. Shared analyses should be viewable by other users without requiring authentication.
    - 1.1.6.1.6. Advanced Features
        - 1.1.6.1.6.1. Opening Explorer: The tool should include an opening explorer to analyze common openings and their variations.
        - 1.1.6.1.6.2. Endgame Tablebases: Integration with endgame tablebases should be available for precise endgame analysis.
        - 1.1.6.1.6.3. Blunder Detection: The analysis tool should highlight blunders, mistakes, and inaccuracies in the game.
    - 1.1.6.1.7. Semantic Browsing
        - 1.1.6.1.7.1. Users shall be able to see top several games that were played in the past (in real life) and reached that analyzed position.

#### 1.2. System Requirements

##### 1.2.1. Moderation Capabilities
- 1.2.1.1. Admins shall be able to delete user accounts.
- 1.2.1.2. Admins shall be able to ban or unban users for a specified period.
- 1.2.1.3. Admins shall be able to edit or delete any post or comment.
- 1.2.1.4. Admins shall be able to manage (add, edit, delete) tags used for categorizing posts.
- 1.2.1.5. Admins shall be able to change users' profile pictures and details if necessary.

##### 1.2.2. Content Management
- 1.2.2.1. Admins shall be able to approve or reject reported content flagged for violating community guidelines.
- 1.2.2.2. Admins should be able to feature or pin certain posts to the main feed.

### 2. Non-Functional Requirements

#### 2.1. Usability
- 2.1.1. The application shall feature an intuitive user interface with clear navigation paths and interactive elements.
- 2.1.2. Users shall be able to easily find and access all essential features and functionalities.
- 2.1.3. The application shall provide informative feedback for user actions, such as successful registrations, login attempts, and error messages.
- 2.1.4. Design elements and layout shall be consistent across different pages to enhance user familiarity and usability.

#### 2.2. Accessibility and Availability
- 2.2.1. The application shall be accessible via various web browsers, including Chrome, Firefox, Safari, and Edge.
- 2.2.2. The application shall be available in English.
- 2.2.3. The application shall comply with Web Content Accessibility Guidelines to ensure accessibility for all users.
- 2.2.4. The Android application shall support Android 5.0 and above.

#### 2.3. Security
- 2.3.1. All passwords stored in the database shall be encrypted using industry-standard encryption methods.
- 2.3.2. User data shall be securely stored and protected against unauthorized access.
- 2.3.3. Email verification shall be required to prevent fraudulent account registrations.

#### 2.4. Performance and Reliability
- 2.4.1. The application shall have response times of less than 100 ms for user interactions.
- 2.4.2. The application shall be capable of handling a large number of concurrent user requests efficiently.
- 2.4.3. The application shall maintain high availability with minimal downtime to ensure users can access the platform reliably.

#### 2.5. Legal
- 2.5.1. The application shall comply with KVCC privacy regulations.

#### 2.6. Standards
- 2.6.1. The system shall comply with W3C Standards to ensure interoperability and accessibility.
- **Summary**: *(Highlight major achievements and any requirements that remain incomplete. Explain why some requirements might not be fully completed.)*

## 4. API Endpoints
- [API Documentation](https://buchessocial.online/api/swagger/)
To get yaml or json file add the ".json" or ".yaml" end of the given link.
- [API Link](https://buchessocial.online/api/v1/)
- **Core API Calls**:
- !!(You may consider to sign-up before using endpoints due to most of them uses authentication)
- !!(If you are runing code locally you should provide LICHESS_TOKEN)
    1. **Example Endpoint 1**: **Login Endpoint (`POST /accounts/login/`)**  
       **Description:**  
       This endpoint allows a user to log in with their email and password.  
       
       **Request Method:**  
       `POST /accounts/login/`
       
       **Required Parameters:**  
       - **Body (JSON)**:
         ```json
         {
           "mail": "user@example.com",
           "password": "user_password"
         }
         ```
       
       **Authentication:**  
       - No bearer token is required for this endpoint.
       
       **Example Request (cURL):**
       ```bash
       curl -X POST https://buchessocial.online/api/v1/accounts/login/ \
         -H "Content-Type: application/json" \
         -d '{
           "mail": "user@example.com",
           "password": "user_password"
         }'
       ```
       
       **Example Successful Response (200):**
       ```json
       {
         "username": "user123",
         "token": "eyJ0eXAiOiJKV1Q..."
       }
       ```
       
       If login is successful, the response body includes a `token`. Use this token for subsequent authenticated requests (e.g., `Bearer eyJ0eXAiOiJKV1Q...`).

    2. **Example Endpoint 2**: **Get User Page Data (`GET /accounts/me/`)**  
       **Description:**  
       This endpoint retrieves all user-related information (including bookmarks, likes, followers, etc.) for the **authenticated** user’s profile page.
       
       **Request Method:**  
       `GET /accounts/me/`
       
       **Required Parameters:**  
       - **Headers**:
         - **Authorization**: `Bearer <token>`
           
           Replace `<token>` with the JWT obtained from the login endpoint.
       
       **Example Request (cURL):**
       ```bash
       curl -X GET https://buchessocial.online/api/v1/accounts/me/ \
         -H "Authorization: Bearer eyJ0eXAiOiJKV1Q..."
       ```
       
       **Example Successful Response (200):**
       ```json
       {
         "username": "chessmaster",
         "email": "chessmaster@example.com",
         "first_name": "Chess",
         "last_name": "Master",
         "date_joined": "2024-01-12T15:23:45Z",
         "post_bookmarks": [
           {"post__id": 1, "post__title": "The Greatest Chess Game of All Time"},
           {"post__id": 2, "post__title": "How to Win in 10 Moves"}
         ],
         "game_bookmarks": [
           {
             "game__id": 7,
             "game__event": "World Championship",
             "game__site": "Reykjavik",
             "game__white": "Kasparov",
             "game__black": "Deep Blue",
             "game__result": "1-0",
             "game__year": 1997,
             "game__month": 3,
             "game__day": 15,
             "game__pgn": "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"
           }
         ],
         "game_move_bookmarks": [
           {
             "game__id": 7,
             "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
           }
         ],
         "post_likes": [
           {"post__id": 5, "post__title": "Top 5 Chess Strategies"}
         ],
         "followers": [
           {"follower__id": 2, "follower__username": "another_user"}
         ],
         "following": [
           {"following__id": 5, "following__username": "grandmaster"}
         ],
         "posts": [
           {"id": 1, "title": "My First Post"},
           {"id": 2, "title": "Analyzing Chess Openings"}
         ]
       }
       ```
       
       **Error Response (401 - Authentication required):**
       ```json
       {
         "detail": "Authentication credentials were not provided."
       }
       ```

    3. **Example Endpoint 3**: **Like/Unlike a Post (`POST /posts/like/{post_id}/`)**  
       **Description:**  
       This endpoint toggles the like status on a specified post. If the post is not liked by the user, it will be liked. If it is already liked, it will be unliked.
       
       **Request Method:**  
       `POST /posts/like/{post_id}/`  
       Replace `{post_id}` with the actual post ID (e.g., `1`).
       
       **Required Parameters:**  
       - **Headers**:
         - **Authorization**: `Bearer <token>`
           
           Use the token obtained from the login endpoint.
       - **Path parameter**:
         - `post_id`: The ID of the post to like/unlike.
       
       **Example Request (cURL):**
       ```bash
       curl -X POST https://buchessocial.online/api/v1/posts/like/1/ \
         -H "Authorization: Bearer eyJ0eXAiOiJKV1Q..."
       ```
       
       **Example Response (201 - Post Liked):**
       ```json
       {
         "message": "Post liked"
       }
       ```
       
       **Example Response (200 - Post Unliked):**
       ```json
       {
         "message": "Post unliked"
       }
       ```
       
       **Error Response (404 - Post not found):**
       ```json
       {
         "error": "Post not found"
       }
       ```
       
       **Error Response (401 - Authentication required):**
       ```json
       {
         "detail": "Authentication credentials were not provided."
       }
       ```

*(To replicate these calls, first call the login endpoint to retrieve your JWT token. Then include the token in the Authorization header as `Bearer <token>` for any subsequent authenticated requests.)*
- **Postman Collection**: Instead of Postman Collection we are highly suggested you to user Swagger UI, and you can easily try all the endpoints wit "try it out" button for the authenticated ones don't miss to add token as Bearer. Details are at the documentation.

## 5. User Interface / User Experience
- **Screenshots of Web and Mobile Interfaces**: 
### Frontend Images
<img width="1710" alt="BJcqklQBkl" src="https://github.com/user-attachments/assets/4b497e93-c378-4259-b9ad-995889d0d951" />
<img width="1710" alt="BJY9yxQrke" src="https://github.com/user-attachments/assets/3261afbc-4e2b-4710-a99a-b957fc325883" />
<img width="1710" alt="By6q1xmB1g" src="https://github.com/user-attachments/assets/42a2be17-5571-4cad-a4da-48e0866175f9" />
<img width="1710" alt="H18cklXr1x" src="https://github.com/user-attachments/assets/a681a6df-b0e3-4b1b-b1d7-676b3eb0a45c" />
<img width="1710" alt="HJr9kgmBkg" src="https://github.com/user-attachments/assets/c0dace9d-b210-4a0d-9c26-178062504b78" />
<img width="1710" alt="r1O5ylmB1e" src="https://github.com/user-attachments/assets/1925e58f-e046-456f-b2ff-82152a74f6af" />
<img width="1710" alt="rk_q1eQrye" src="https://github.com/user-attachments/assets/7d7edba2-8e60-4fa5-9b21-56aedb9e6d90" />
<img width="1710" alt="rk0FkxmBJx" src="https://github.com/user-attachments/assets/7b4c5d34-ee21-4a57-93b7-a42a849517d3" />
<img width="1710" alt="rya9yl7Syx" src="https://github.com/user-attachments/assets/396c5605-0391-4532-8988-fbcdc6d548a0" />
<img width="1710" alt="S1w5kxmr1g" src="https://github.com/user-attachments/assets/ae22abaa-1598-427d-a06a-756b2eb544ca" />
<img width="1280" alt="upload_6d8fc9067f349aa7af9365d7847ce8c4" src="https://github.com/user-attachments/assets/f934896e-20ef-4648-9526-6a277ace9979" />
<img width="1280" alt="upload_7d85f76f8f535c0c4c09fcfcea5ed9a2" src="https://github.com/user-attachments/assets/c8c282ee-a13e-4896-afa3-b5a1bb36282e" />
<img width="1280" alt="upload_9a25bc5d51f1fd912f4962ab49507294" src="https://github.com/user-attachments/assets/72a7f04a-7a47-4f91-9ede-38e40be5455c" />
<img width="1280" alt="upload_13bbec0e79531ac868bd109f99063b64" src="https://github.com/user-attachments/assets/0f2b7e5e-cf82-42e7-a4eb-bd36bb558310" />
<img width="1280" alt="upload_6022ef549f9c3e33d35bfb23de37ca56" src="https://github.com/user-attachments/assets/6074f313-0a9f-4db2-a0f2-c1e3a8671480" />
<img width="1280" alt="upload_24016e71adca51f42de6a3ddd685d816" src="https://github.com/user-attachments/assets/0e2f1eaa-73a8-4eb3-9e8a-b9114e8f12a6" />
<img width="1280" alt="upload_1039522341857c7bec7e937166ec5ad0" src="https://github.com/user-attachments/assets/933e6c0f-4e3e-4c9f-bd83-efb4cdc45130" />
<img width="1280" alt="upload_e8451e5da7ae6bef6a6f24a072a31983" src="https://github.com/user-attachments/assets/ecab3844-4d16-4f9a-9a90-cc58e8d5fd0d" />
<img width="1280" alt="upload_f4f104ecdab70b42c4cc95b14dcf42a1" src="https://github.com/user-attachments/assets/320f06da-a688-4e68-8019-f88033b1f325" />

### Mobile Images
![WhatsApp Image 2024-12-20 at 21 31 28](https://github.com/user-attachments/assets/1c1d1e2f-747a-43fc-9d23-51c0104a4552)
![WhatsApp Image 2024-12-20 at 21 32 33](https://github.com/user-attachments/assets/e49545d7-910e-401c-a861-6a47f5fa0a6b)
![WhatsApp Image 2024-12-20 at 21 32 20](https://github.com/user-attachments/assets/b590b6af-8908-4c3a-84d9-d7df39538e73)
![WhatsApp Image 2024-12-20 at 21 32 49](https://github.com/user-attachments/assets/11ff13e1-5264-4772-badf-9cfeaa3948ad)
![WhatsApp Image 2024-12-20 at 21 33 07](https://github.com/user-attachments/assets/f633b4b0-91c6-4c10-96ba-7079b9df989f)
![WhatsApp Image 2024-12-20 at 21 33 42](https://github.com/user-attachments/assets/ceea0c4d-9ae9-4adc-bdcb-826429461c76)
![WhatsApp Image 2024-12-20 at 21 33 55](https://github.com/user-attachments/assets/e081b364-4312-49fe-9312-c57b808487f4)

- **UX Considerations**: Based on user feedback and testing throughout the milestones, several key UX improvements were implemented:

1. Navigation & Information Architecture
- Streamlined main navigation with clearer labels and consistent menu structure
- Added semantic browsing capabilities to connect related content (games, players, tournaments)
- Improved search functionality with advanced filtering options

2. Interactive Features
- Enhanced chess board interface with move-by-move navigation and position exploration
- Added position-specific annotations and comments for deeper game analysis
- Implemented bookmarking for easier content saving and retrieval

3. Content Organization
- Restructured feeds to clearly separate main content from followed content
- Added tags for better content categorization and discovery
- Improved profile pages to better showcase user activity and saved content

4. Mobile Responsiveness
- Optimized layouts and components for mobile devices
- Improved touch interactions for chess board navigation
- Added native app-specific features like copyable FEN positions

These changes resulted from direct user feedback during testing and adherence to chess platform best practices.

## 6. Standards
### **Application of W3C Standards**
Our project strictly adheres to the **W3C Web Annotation Data Model** as outlined by the [W3C Web Annotation Working Group](https://www.w3.org/TR/annotation-model/). This standard defines a framework for creating, managing, and sharing annotations in a structured and interoperable manner. Below is a summary of how this standard was integrated into our project, along with validation and documentation measures.
#### **1. Integration of W3C Web Annotation Data Model**
- **Annotation Structure**: 
  - Each annotation follows the W3C-defined structure, containing required properties such as `@context`, `id`, `type`, `creator`, `created`, `modified`, `body`, `target`, and `motivation`. 
  - The **type** of each annotation is set to **"Annotation"** as required by the W3C standard. 
  - **UUIDs** are used for annotation `id`s to ensure each annotation has a globally unique identifier, which aligns with the W3C's guidance to make annotations resolvable and uniquely identifiable.
- **Annotation Fields**: 
  - **@context**: This field is included to establish the semantic context for the annotation. For all annotations, the value is set to `http://www.w3.org/ns/anno.jsonld`, which is the canonical URL for the W3C Web Annotation vocabulary.
  - **Body**: The annotation body follows the **TextualBody** format, as recommended by the W3C. This includes subfields such as:
    - **type**: Always set to **"TextualBody"**.
    - **value**: The core content of the annotation, representing the user's comment or note.
    - **format**: Specifies the format of the content. In our case, it is set to **"text/plain"**.
  - **Target**: This indicates the context or specific part of the game being annotated. Our project uses the **ChessPosition** target type, which contains:
    - **source**: Refers to the URL of the chess game to which the annotation applies.
    - **state**: A nested object that captures the **FEN** (Forsyth–Edwards Notation) representing the chessboard position and **moveNumber**, ensuring precise identification of the game state being annotated.
  - **Creator**: The creator of the annotation is represented as a **Person** object with the following attributes:
    - **id**: A unique identifier for the user.
    - **name**: The name or username of the creator.
    - **type**: Always set to **"Person"**, as required by the W3C data model.
  - **Motivation**: This describes the purpose of the annotation. Our project primarily uses the **"commenting"** motivation to allow users to annotate specific chess moves, game states, or positions.
#### **2. Validation and Compliance Measures**
- **Schema Validation**: 
  - We implemented **strict input validation** for the annotation endpoints to ensure that incoming data conforms to the W3C structure. For instance:
    - The **@context** field is required and must match **http://www.w3.org/ns/anno.jsonld**.
    - **Body**, **Target**, **Motivation**, and other required fields are validated before processing any annotation requests.
    - If any field is missing or formatted incorrectly, the server returns a **400 Bad Request** response with detailed error information.
- **Error Handling**: 
  - If an annotation is submitted with missing required fields (like **body** or **target**), the API returns an error following a standardized error response format. This ensures clear feedback to developers and frontend users.
- **Testing for W3C Compliance**: 
  - **Unit Tests**: We developed unit tests to ensure that all responses from the API match the W3C annotation format. Tests assert that the response includes all required fields in the correct structure.
  - **Integration Tests**: Our integration tests verify that annotations created through API requests follow the W3C data model. Tests confirm that all required fields are present and conform to the correct types and formats.
#### **3. Documentation of W3C Compliance**
- **Swagger API Documentation**: 
  - The **API documentation** for annotation endpoints was created using **DRF Spectacular**, which automatically generates **OpenAPI-compliant documentation**. 
  - Each field in the annotation is documented in Swagger, with clear definitions for **@context**, **body**, **target**, **creator**, and other fields. This allows external developers and frontend collaborators to understand how to interact with the annotation endpoints.
  - Example request and response bodies were included for **GET**, **POST**, **PUT**, and **DELETE** annotation endpoints, showcasing valid W3C-compliant annotation objects.
- **Compliance Verification**: 
  - Before the final milestone, we manually validated that annotations stored in the database and returned by the API conform to the W3C data model.
  - We ensured that the data could be used in other W3C-compliant systems, allowing for future system interoperability.
#### **4. Benefits of W3C Compliance**
- **Interoperability**: By following W3C's Web Annotation Data Model, our annotations can be easily shared, processed, or reused by other systems that comply with the same standard.
- **Future Compatibility**: If we decide to integrate with external systems, such as annotation aggregation platforms or other chess analysis tools, our data format will already be compatible with industry standards.
- **Data Consistency**: Strict validation and adherence to the W3C structure ensure that annotations have a consistent, predictable format. This improves the user experience and enables smooth development between backend and frontend teams.
- **Developer Clarity**: With Swagger documentation and adherence to the W3C structure, developers working on the frontend and backend have a clear understanding of the annotation model, reducing confusion and errors.



## 7. Scenarios
#### **Nina**
Nina is a meticulous and curious chess enthusiast who loves deepening her understanding of classic games. She enjoys exploring archives of well-known players to study their strategies move-by-move. When she discovers valuable insights, she shares them with the community, often highlighting specific tactical moments.

Nina logs into the platform and clicks on the **Archive** tab, encountering a search screen with input fields. She types "Carlsen" into the **Player** field, resulting in a list of games featuring player names (both black and white), tournament names, and results. She selects a particular encounter from the **Grand Slam Final** tournament and studies it on the analysis board. While reviewing the moves, she clicks the **Next** button to progress through positions. Upon discovering a critical position, she clicks the **Explore Position** button, which displays detailed statistics about that position. 

After exploring its critical moments, Nina clicks on the **Tournament Name** link to view other games from the same event. She finds another match with a decisive finish and saves it using the **Bookmark** button. Later in the day, eager to share her insights, Nina revisits the platform, checks her profile page, and reopens the bookmarked game in the analysis board. From this game, she copies a pivotal position and proceeds to the **Community Feed** to create a new post. She clicks the **Create** button, enters her insights, and pastes the FEN position into the designated **FEN** area. To improve visibility, she adds the tag "Tactics" using the **Tag Input Field** and publishes the post.

---

#### **Arjun**
Arjun is a socially engaged chess player who enjoys reacting to others’ posts and testing alternative ideas. He loves solving tactical puzzles, suggesting improvements, and verifying his lines by consulting reference games and patterns.

Arjun visits the **Chess Social** website. During his first visit, he signs up and logs in using the credentials he defined on the signup page. While exploring the feed, he comes across Nina’s newly posted position tagged with "Tactics." Intrigued, he clicks on the **Tactics** tag, causing the feed to update with posts tagged as "Tactics." While browsing, he finds a post related to "Ding Liren," engages with it, and likes the post. Curious about the author, he navigates to their profile page and clicks **Follow** to stay updated.

Arjun then decides to explore more games by Ding Liren. He clicks on the **Archive** button in the navigation bar and enters "Liren" into the **Player** field and "1-0" into the **Result** field to filter for games where Ding Liren won as White. After finding a relevant game, he clicks on it, navigating to the game screen, which displays the moves. While analyzing the moves, he finds the 4th position interesting and clicks the **More Games** button, which shows a list of related games. He selects another game, navigates to its game screen, and scrolls down to a position with annotations for **Move 7**. Wanting to inform others, he adds an annotation for Move 7, providing his insights into the position.

---

##### Implemented Features and Work Completed

1. **JWT Authentication and Django User Model Integration**  
   - Integrated JWT-based authentication for secure sign-ups and logins, exchanging tokens between the client and server.  
   - The Django user model manages user credentials, while the backend validates and issues JWTs upon successful login.  
   - Enabled secure access control, allowing users like Nina and Arjun to bookmark, post, or follow users without frequent re-authentication.  

2. **Data Scraping and PGN Parsing (28K Chess Games from PGNMentor)**  
   - Scraped 28,000 chess games from PGNMentor and standardized them into a structured format.  
   - Backend filtering functions process client parameters (e.g., player name, tournament, result) for targeted search results.  
   - Pre-processed and indexed data supports rapid queries and efficient retrieval for mobile and web interfaces.  

3. **Displaying Search Results with Backend Filtering**  
   - Backend queries against pre-processed data based on search parameters (e.g., player names, result filters).  
   - Returned results in a paginated, structured format for easy navigation of game listings.  
   - Ensured seamless functionality for scenarios like Nina’s search for “Carlsen” or Arjun’s filtered search for “Liren.”  

4. **Chessboard.js and Chess.js Integration for Game View**  
   - Integrated Chessboard.js and Chess.js for interactive game viewing on mobile and React-based web platforms.  
   - Enabled move navigation, validation, and accurate rendering of positions through Chess.js.  

5. **Using FEN (Forsyth–Edwards Notation) for Move Navigation**  
   - Utilized FEN strings for flexible navigation of specific positions within games.  
   - Empowered users like Nina to share critical positions in posts without manually replaying games.  

6. **Lichess API Integration for Exploring Positions**  
   - Queried the Lichess API for additional reference games and alternative lines based on positions.  
   - Provided richer analytical experiences by displaying related games and insights.  

7. **“More Games” Feature with Route Pushing and Site Parameter**  
   - Enabled seamless exploration of additional games through router push actions.  
   - Dynamic retrieval and display of related games deepened user engagement.  

8. **Bookmarking and Database Integration for Saved Items**  
   - Allowed users to bookmark games, saving references to their profile data for later access.  
   - Simplified recalling of interesting games and positions to support continuous learning.  

9. **Profile Page and Backend Endpoints for Bookmarked/Liked Content**  
   - Designed profile pages to fetch and display bookmarked and liked content via dedicated backend endpoints.  
   - Offered personalized overviews for users like Nina and Arjun.  

10. **React Native Features and Chess.js for Copying FEN**  
    - Combined React Native with Chess.js for easy copying of FEN strings.  
    - Simplified capturing and sharing of game snapshots for posts or analyses.  

11. **Creating Posts with FEN and Tagging via Backend Endpoints**  
    - Provided fields for FEN strings and tags in post creation.  
    - Stored and validated posts via backend endpoints, enriching community content.  

12. **User Registration and Login for Arjun’s Scenario**  
    - Designed straightforward sign-up and login processes, securing user sessions with JWT tokens.  

13. **Lichess API for Exploring and Parsing Additional Games**  
    - Fetched, parsed, and stored Lichess-derived games for faster on-demand retrieval and filtering.  
14. **W3C Web Annotation Data Model for Community Interaction**  
    - Adopted the W3C Web Annotation Data Model to structure and manage annotations made by users on games and positions.  
    - Enabled users to annotate specific moves or positions with rich metadata, such as tags, comments, and references.  
    - This standardization ensures interoperability and compatibility, making it easier to integrate annotations with other platforms and services.  
    - Leveraged the model to support Nina's and Arjun's ability to annotate positions, share insights, and interact with community-generated content efficiently.

## 8. Individual Documentation

### Ahmet Fırat Gamsız
- **Member**: Ahmet Fırat Gamsız, Frontend
- **Responsibilities**: *(Overall assigned tasks.)*
- **Main Contributions**: I was responsible for implementing annotations and improving comments and archieve page.
- **Code-Related Significant Issues**: 
    - [Frontend: Semantic Browsing](https://github.com/bounswe/bounswe2024group12/issues/364)
    - [Frontend: Annotate Steps](https://github.com/bounswe/bounswe2024group12/issues/374)
    - [Frontend: Multistep comments](https://github.com/bounswe/bounswe2024group12/issues/375)
    - [Frontend: Fix Unit Tests for Home Page](https://github.com/bounswe/bounswe2024group12/issues/402)
    - [Frontend: Annotation Unit Tests](https://github.com/bounswe/bounswe2024group12/issues/404)
    - Reviewed:
        - [Frontend: Adapt Feed Logic](https://github.com/bounswe/bounswe2024group12/issues/379)
        - [Frontend: Duplicate Post Issue](https://github.com/bounswe/bounswe2024group12/issues/378)
        - [Frontend: Bookmarking](https://github.com/bounswe/bounswe2024group12/issues/363)
        - [Frontend: Enhance Post Tags](https://github.com/bounswe/bounswe2024group12/issues/362)
        - [Frontend: Implement profile page](https://github.com/bounswe/bounswe2024group12/issues/361)
- **Management-Related Significant Issues**:
    - [Write Milestone 3 Report](https://github.com/bounswe/bounswe2024group12/issues/423)
- **Pull Requests**: 
    - [Firat/annotation](https://github.com/bounswe/bounswe2024group12/pull/400)
    - [Firat/more games](https://github.com/bounswe/bounswe2024group12/pull/408)
    - [Firat/semantic browsing](https://github.com/bounswe/bounswe2024group12/pull/409)
    - [Firat/multistep comments](https://github.com/bounswe/bounswe2024group12/pull/417)
    - [semantic browsing and its unit tests](https://github.com/bounswe/bounswe2024group12/pull/422)
- **Unit Tests**: 
    - [Annotation Features tests](https://github.com/bounswe/bounswe2024group12/blob/main/frontend/src/components/archivepage/__tests__/AnnotationFeatures.test.jsx)
    - [Comment Features tests](https://github.com/bounswe/bounswe2024group12/blob/main/frontend/src/components/archivepage/__tests__/CommentFeatures.test.jsx)
    - [Game Screen tests](https://github.com/bounswe/bounswe2024group12/blob/main/frontend/src/components/archivepage/__tests__/GameScreen.test.jsx)
- **Additional Information**: I have joined all the labs and contributed towards presentation story.

### Soner Kuyar
- **Member**: Soner Kuyar, Backend
- **Responsibilities**:
  In this milestone, I was responsible for:  
  - Creating and testing endpoints for puzzles, tournaments, posts, and openings.  
  - Fetching chess games, user posts, and chess openings to populate the database.  
  - Integrating with Lichess API for advanced features like fetching games or move-related data.  
  - Performing all deployment tasks, including building the backend app and database using existing database snapshots.  
  - Resolving deployment-related bugs and ensuring the backend initializes correctly.  

- **Main Contributions**:  
  1. **Implemented Fetching Puzzles Feature**  
     - Developed functionality to fetch chess puzzles, including filtering options for daily and random puzzles.  
     - Issue link: [Backend: Implement Fetching Puzzles feature](https://github.com/bounswe/bounswe2024group12/issues/365)  

  2. **Created Tournaments Endpoints**  
     - Built API endpoints to manage chess tournaments and retrieve tournament-related games and details.  
     - Issue link: [Backend: Create Tournaments Endpoints](https://github.com/bounswe/bounswe2024group12/issues/396)  

  3. **Created Endpoints for Posts**  
     - Developed endpoints for creating, editing, and deleting user posts, ensuring proper authorization.  
     - Issue link: [Backend: Create Edit-Delete endpoints for Posts](https://github.com/bounswe/bounswe2024group12/issues/368)  

  4. **Enhanced List Post Items Endpoint**  
     - Improved the endpoint for listing post items by adding filtering, ordering, and efficient data retrieval features.  
     - Issue link: [Backend: Enhance List post items endpoint](https://github.com/bounswe/bounswe2024group12/issues/369)  

  5. **Created Opening Endpoint**  
     - Created an API endpoint for retrieving chess openings using their ECO codes and descriptions.  
     - Issue link: [Backend: Create get opening endpoint](https://github.com/bounswe/bounswe2024group12/issues/394)  

  6. **Integrated Lichess API**  
     - Added support for interacting with the Lichess API to fetch games, analyze positions, and enhance the data provided to the platform.  

  7. **Deployment and Database Tasks**  
     - Deployed the backend application and database, ensuring compatibility with snapshots and seamless user access.  
     - Issue link: [Backend: Deploy the backend app](https://github.com/bounswe/bounswe2024group12/issues/420)  
     - Added deployment datasets into the final product database.  
     - Issue link: [Database: Add deployment dataset into final product](https://github.com/bounswe/bounswe2024group12/issues/399)  

  8. **Resolved Backend Initialization Bug**  
     - Fixed a critical bug where the backend initialized before the database was healthy, ensuring proper startup sequencing.  
     - Issue link: [Backend: Solve backend init before db healthy](https://github.com/bounswe/bounswe2024group12/issues/410)  

  9. **Frontend Deployment Assistance**  
     - Supported the deployment of the frontend application to ensure seamless integration with the backend.  
     - Issue link: [Frontend: Deploy the frontend app](https://github.com/bounswe/bounswe2024group12/issues/421)  

- **Code-Related Significant Issues**:  
  - **Fetching Puzzles Feature**: Implemented advanced puzzle-fetching functionality with filtering options.  
    - Issue link: [Backend: Implement Fetching Puzzles feature](https://github.com/bounswe/bounswe2024group12/issues/365)  
  - **Post Management Endpoints**: Developed comprehensive endpoints for user posts (create, edit, delete).  
    - Issue link: [Backend: Create Edit-Delete endpoints for Posts](https://github.com/bounswe/bounswe2024group12/issues/368)  
  - **Opening Retrieval Endpoint**: Built a chess opening retrieval feature using ECO codes.  
    - Issue link: [Backend: Create get opening endpoint](https://github.com/bounswe/bounswe2024group12/issues/394)  
  - **Backend Initialization Bug**: Resolved backend initialization issues related to database health.  
    - Issue link: [Backend: Solve backend init before db healthy](https://github.com/bounswe/bounswe2024group12/issues/410)  

- **Management-Related Significant Issues**:  
  - **Database Deployment**: Added the final deployment dataset to the database, ensuring data accuracy and usability.  
    - Issue link: [Database: Add deployment dataset into final product](https://github.com/bounswe/bounswe2024group12/issues/399)  
  - **Backend and Frontend Deployment**: Successfully deployed both backend and frontend apps.  
    - Backend deployment issue link: [Backend: Deploy the backend app](https://github.com/bounswe/bounswe2024group12/issues/420)  
    - Frontend deployment issue link: [Frontend: Deploy the frontend app](https://github.com/bounswe/bounswe2024group12/issues/421)  
  - **Bug Fixes During Deployment**: Fixed critical bugs in deployment, such as the "try it out" bug.  
    - Issue link: [Backend: Fix the try it out bug at deployment](https://github.com/bounswe/bounswe2024group12/issues/393)  
- **Pull Requests**:  
1. [Backend: Milestone 3 Developments](https://github.com/bounswe/bounswe2024group12/pull/418)
2. [Backend build bug](https://github.com/bounswe/bounswe2024group12/pull/414)
3. [Backend Data Preparation](https://github.com/bounswe/bounswe2024group12/pull/407)
4. [Improve Master Games endpoint](https://github.com/bounswe/bounswe2024group12/pull/403)
5. [Backend Tournaments](https://github.com/bounswe/bounswe2024group12/pull/397)
6. [Backend Openings](https://github.com/bounswe/bounswe2024group12/pull/395)
7. [Backend enhance post listing](https://github.com/bounswe/bounswe2024group12/pull/384)
8. [Backend posts edit-delete endpoints](https://github.com/bounswe/bounswe2024group12/pull/383)
9. [Backend puzzles](https://github.com/bounswe/bounswe2024group12/pull/381)

- **Unit Tests**:
    - [Tournament Tests](https://github.com/bounswe/bounswe2024group12/pull/397/commits/ec766883bb26381b386ae31a37230506b5253b83)
    - [Opening Tests](https://github.com/bounswe/bounswe2024group12/pull/395/commits/8131ef4c7ffd14e3e15f41cddd2a0daaabd225c1)
    - [Puzzle Tests](https://github.com/bounswe/bounswe2024group12/pull/381/commits) (Available at each endpoints commit test.py changes)
- **Additional Information**: I have joined all the labs and I lead the preparing Customer Milestone Presentation Scenario with Ozan. I was the only reponsible for maintaining  backend and frontend app, their deployments, database changes, privilages all the unseen works at deployment machine. 
Also I wrote scripts and searches in composition of database insertions and maintains.Give feedback to the teammates under the issues actively.


### Orhan Ünüvar
- **Member**: Orhan Ünüvar, Mobile
- **Responsibilities**:  In this milestone, I was responsible for:
    - Implementing the user profile page in the mobile application.
    - Implementing the game/post bookmarking (saving) feature in the mobile application.
    - Reviewing the puzzles page implementation.
    - Reviewing the playground page implementation.
- **Main Contributions**:
    - Implemented **user profile page** UI & functionality.
    - Implemented **game/post bookmarking** (saving) UI & functionality.
    - Reviewed the implementation of the **puzzles page**.
    - Reviewed the implementation of the **playground page**.
- **Code-Related Significant Issues**:
    - [Mobile: Remove Search Post by id from the Main Screen](https://github.com/bounswe/bounswe2024group12/issues/371) - Removed the search post by id feature from the main screen.
    - [Mobile: Implement profile page for users](https://github.com/bounswe/bounswe2024group12/issues/359) - Implemented the user profile page UI & functionality.
    - [Mobile: Implement saving](https://github.com/bounswe/bounswe2024group12/issues/360) - Implemented game/post bookmarking UI & functionality.
    - Reviewed:
        - [Mobile: Add puzzles screen](https://github.com/bounswe/bounswe2024group12/issues/354)
        - [Mobile: Add playground](https://github.com/bounswe/bounswe2024group12/issues/355)
        - [Mobile: Add FEN to comments](https://github.com/bounswe/bounswe2024group12/issues/357)
        - [Mobile: Add FEN to in-game comments](https://github.com/bounswe/bounswe2024group12/issues/358)
        - [Implement Player/Tournament Search Flow](https://github.com/bounswe/bounswe2024group12/issues/367)
        - [Mobile: Make Position Copyable on Game Analysis Screen](https://github.com/bounswe/bounswe2024group12/issues/372)
- **Management-Related Significant Issues**:
    - [Write Milestone 3 Report](https://github.com/bounswe/bounswe2024group12/issues/423) - Contributed to the milestone report.
- **Pull Requests**:
    - [add: profile screen](https://github.com/bounswe/bounswe2024group12/pull/386) - Implemented user profile page UI & functionality.
    - [Mobile/app icon](https://github.com/bounswe/bounswe2024group12/pull/387) - Added app icon.
    - [Mobile/fixes](https://github.com/bounswe/bounswe2024group12/pull/388) - Fixed some issues regarding profile page.
    - [Mobile/game card](https://github.com/bounswe/bounswe2024group12/pull/390) - Implemented game card component.
    - [Mobile/bookmarks](https://github.com/bounswe/bounswe2024group12/pull/391) - Implemented game/post bookmarking UI & functionality.
    - [Mobile/screen changes](https://github.com/bounswe/bounswe2024group12/pull/392) - Made changes regarding screen navigation.
    - Reviewed:
        - [Mobile Improvements](https://github.com/bounswe/bounswe2024group12/pull/348)
        - [Mobile/ozan final fixes](https://github.com/bounswe/bounswe2024group12/pull/413)
        - [Mobile/ozan milestone 3](https://github.com/bounswe/bounswe2024group12/pull/376)
- **Unit Tests**:
    - Component Test Suite - Verified that the components are rendering correctly and the state is being updated as expected.
        - [LikeButton Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/components/LikeButton.test.js)
        - [PgnViewer Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/components/PgnViewer.test.js)
        - [ThemedText Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/components/ThemedText.test.js)
    - Context Test Suite - Tested the context providers to ensure that the state is being managed correctly.
        - [AuthContext Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/contexts/AuthContext.test.js)
    - Screen Test Suite - Verified that the screens are rendering correctly and the navigation is working as expected.
        - [CreatePostScreen Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/screens/CreatePostScreen.test.js)
        - [LoginScreen Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/screens/LoginScreen.test.js)
    - Service Test Suite - Tested the services to ensure that the API calls are working correctly and the data is being fetched and updated as expected.
        - [AuthService Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/services/AuthService.test.js)
        - [LikeService Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/services/LikeService.test.js)
        - [MasterGameService Test](https://github.com/bounswe/bounswe2024group12/blob/main/project/Mobile/__tests__/services/MasterGameService.test.js)
- **Additional Information**:
    - Reviewed and provided feedback on team member pull requests.
    - Actively participated in all lab sessions.
    - Coordinated closely with frontend, backend, and my mobile teammate to ensure a consistent user experience (UX) and smooth collaboration.
    - Contributed towards presentation story.

### Ozan Kaymak
- **Member**: Ozan Kaymak, Mobile
- **Responsibilities**: In this milestone, I was responsible for (all in mobile application):
    - Making board position copyable on Game Analysis
    - Adding Playground
    - Adding Puzzles
    - Fixing apk file generation
    - Fixing/improving many UI/UX elements in many different parts.
- **Main Contributions**:
- **Code-Related Significant Issues**:
    - [Mobile: Add tags button doesn't work](https://github.com/bounswe/bounswe2024group12/issues/339)
    - [Mobile: Add FEN doesn't work](https://github.com/bounswe/bounswe2024group12/issues/340)
    - [Mobile: Fix APK generation](https://github.com/bounswe/bounswe2024group12/issues/347)
    - [Mobile: Add puzzles screen](https://github.com/bounswe/bounswe2024group12/issues/354)
    - [Mobile: Add playground](https://github.com/bounswe/bounswe2024group12/issues/355)
    - [Implement Player/Tournament Search Flow](https://github.com/bounswe/bounswe2024group12/issues/367)
    - [Mobile: Make Position Copyable on Game Analysis Screen](https://github.com/bounswe/bounswe2024group12/issues/372)
- **Management-Related Significant Issues**: None
- **Pull Requests**:
    - [Mobile/ozan final fixes](https://github.com/bounswe/bounswe2024group12/pull/413)
    - [Mobile/ozan milestone 3](https://github.com/bounswe/bounswe2024group12/pull/376)
    - [Mobile/ozan improvements](https://github.com/bounswe/bounswe2024group12/pull/343)
    - Reviewed:
        - [add: profile screen](https://github.com/bounswe/bounswe2024group12/pull/386)
        - [Mobile/app icon](https://github.com/bounswe/bounswe2024group12/pull/387)
        - [Mobile/fixes](https://github.com/bounswe/bounswe2024group12/pull/388)
        - [Mobile/game card](https://github.com/bounswe/bounswe2024group12/pull/390)
        - [Mobile/bookmarks](https://github.com/bounswe/bounswe2024group12/pull/391)
        - [Mobile/screen changes](https://github.com/bounswe/bounswe2024group12/pull/392)
- **Unit Tests**: None
- **Additional Information**:
    - Reviewed and provided feedback on team member pull requests.
    - Actively participated in all lab sessions.
    - Coordinated closely with frontend, backend, and my mobile teammate to ensure a consistent user experience (UX) and smooth collaboration.
    - Helped with the presentation story/presentation.

### Işıl Su Karakuzu
- **Member**: Işıl Su Karakuzu, Frontend
- **Responsibilities**:
  - Implemented the profile page with liked and bookmarked (only user can see) posts and made posts in users' profile pages functional, not just showcases.
  - Developed user-to-user interactions such as follow, unfollow, and viewing others' feeds.
  - Added filtering functionality to the feed for both guest and logged-in user scenarios and fixed bugs in the feed, ensuring no duplicate posts.
- **Main Contributions**:
  - Enhanced profile features, user interactions, tag options, and feed filtering.
- **Code-Related Significant Issues**:
  - [Frontend: Implement Profile Page](https://github.com/bounswe/bounswe2024group12/issues/361) 
  - [Frontend: Add Feed Filtering](https://github.com/bounswe/bounswe2024group12/issues/379)
  - [Frontend: Bookmarking](https://github.com/bounswe/bounswe2024group12/issues/363)
  - [Frontend: Enhance Post Tags](https://github.com/bounswe/bounswe2024group12/issues/362)
  - [Frontend: Duplicate Post Issue](https://github.com/bounswe/bounswe2024group12/issues/378)

- **Management-Related Significant Issues**:
  - [Contribute to Milestone Report](https://github.com/bounswe/bounswe2024group12/issues/423)

- **Pull Requests**:
  - [Final deliverables for Milestone 3](https://github.com/bounswe/bounswe2024group12/pull/419)
  - [Bookmarking Feature](https://github.com/bounswe/bounswe2024group12/pull/411)
  - [Profile and Feed Enhancements: Filtering, Pagination, and Post Features](https://github.com/bounswe/bounswe2024group12/pull/401)

- **Unit Tests**:
  - Unable to create unit tests due to missing three labs, including one due to a health issue with a valid health report.

- **Additional Information**:
  - Actively participated in labs this semester and contributed to presentation development, except for three labs, one of which was missed due to a health issue with a valid health report.
  - Reviewed Fırat's style enhancements.
  - Provided feedback to the Backend team regarding some areas of the API Swagger and JSON documentation that could use clarification or improvement.



### **Yusuf Aygün**

- **Member**: Yusuf Aygün, Backend
- **Responsibilities**:  In this milestone, I was responsible for:
    -  The endpoints for bookmarks on posts, games, and game moves
    -  Follow/unfollow functionality. 
    -  User page endpoints, which displays user-specific information such as likes, bookmarks, and follow details for both current user and another users. 
    -  The annotation endpoints, ensuring they aligned with project standards and frontend requirements.
- **Main Contributions**:
    - **Development of Key Endpoints**: 
        - Created and maintained API endpoints for **bookmarks** on posts, games, and game moves.
        - Developed **follow/unfollow** functionality for users, ensuring proper authentication and logic.
        - Implemented **user page endpoints** to display user-specific information, such as likes, bookmarks, and follow details for both the current user and other users.
        - Built **annotation endpoints**, ensuring alignment with **W3C Web Annotation Data Model** and project standards.
  - **Testing and Validation**: 
    - Wrote comprehensive **unit tests** for all newly implemented endpoints, covering error handling, authentication, and data validation.
    - Developed separate test suites for **bookmarks**, **follow/unfollow**, **user page**, and **annotations** to ensure the correctness of the backend logic.
  - **Documentation and Code Review**: 
    - Contributed to **Swagger documentation** for the endpoints, providing clear API guidelines for frontend and mobile teams.
    - Reviewed and provided feedback on pull requests from teammates, ensuring high code quality and adherence to best practices.
  - **Issue Resolution and Debugging**: 
    - Resolved key issues related to endpoint logic, data validation, and API responses.
    - Addressed issues arising from changing requirements and coordinated with the team to adjust backend services accordingly.
- **Code-Related Significant Issues**:
  - [Backend: Implement Bookmarking Feature](https://github.com/bounswe/bounswe2024group12/issues/366)
  - [Backend: Create Follow/Unfollow User Endpoint](https://github.com/bounswe/bounswe2024group12/issues/370)
  - [Backend: Create Backend Structure for Annotations](https://github.com/bounswe/bounswe2024group12/issues/373)
  - [Backend: Create User Page Endpoints](https://github.com/bounswe/bounswe2024group12/issues/377)
  - **Reviewed**:
    - [Backend: Implement Fetching Puzzles feature](https://github.com/bounswe/bounswe2024group12/issues/365)
    - [Backend: Enhance List post items endpoint](https://github.com/bounswe/bounswe2024group12/issues/369)
    - [Backend: Fix the try it out bug at deployment](https://github.com/bounswe/bounswe2024group12/issues/393)
    - [Backend: Create Tournaments Endpoints](https://github.com/bounswe/bounswe2024group12/issues/396)
    - [Database: Add deployment dataset into final product](https://github.com/bounswe/bounswe2024group12/issues/399)
    - [Backend: Solve backend init before db healthy](https://github.com/bounswe/bounswe2024group12/issues/410)
    - [Backend: Deploy the backend app](https://github.com/bounswe/bounswe2024group12/issues/420)
- **Management-Related Significant Issues**:
    - [Write Milestone 3 Report](https://github.com/bounswe/bounswe2024group12/issues/423)
- **Pull Requests**:
  - [Add bookmark endpoints for posts, games, and game moves](https://github.com/bounswe/bounswe2024group12/pull/380)
  - [Add follow/unfollow functionality with tests and Swagger docs](https://github.com/bounswe/bounswe2024group12/pull/382)
  - [Backend user page endpoint](https://github.com/bounswe/bounswe2024group12/pull/385)
  - [fix swagger docs, follow endpoint and get_user_page endpoint](https://github.com/bounswe/bounswe2024group12/pull/389)
  - [fix parameter for get_other_user_page endpoint](https://github.com/bounswe/bounswe2024group12/pull/405)
  - [Backend annotation endpoints](https://github.com/bounswe/bounswe2024group12/pull/406)
  - [Fix annotation endpoints](https://github.com/bounswe/bounswe2024group12/pull/412)
  - [Update test.sh](https://github.com/bounswe/bounswe2024group12/pull/416)
  - [Backend: Milestone 3 Developments](https://github.com/bounswe/bounswe2024group12/pull/418)
- **Unit Tests**:
  - [Annotation Test Suite](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/games/tests.py) - Verified CRUD operations for annotations, ensuring proper error handling, authentication, and validation of annotation data.
  - [User Page Test Suite](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/accounts/tests.py) - Tested user page features, including user information display, follower/following lists, and user activity.
  - [Follow/Unfollow Test Suite](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/accounts/tests.py) - Verified follow and unfollow functionalities for users, ensuring only valid actions are performed.
  - [Bookmark Test Suite for Games and Game Moves](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/games/tests.py) - Tested bookmark creation, retrieval, and deletion, ensuring users can properly manage their saved content for games and game moves.
  - [Bookmark Test Suite for Posts](https://github.com/bounswe/bounswe2024group12/blob/main/app/backend/v1/apps/posts/tests.py) - Similar tests for posts.
- **Additional Information**: 
   - Actively participated in all lab sessions.
   - With my teammate in backend, worked closely with frontend and mobile teams to align API functionality with client needs. Addressed endpoint logic and database structure issues, facilitated API usage guidance, and ensured smooth integration through timely updates to API and Swagger documentation.
