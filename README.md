# Golf Leaderboard Application

## Specification Deliverable

### Elevator Pitch

Have you ever wanted to play golf with a big group and all track all of the scores and compete together in different formats? The Golf Leaderboard application provides a place for individuals to group together and compete against one another. One user can create a tournament, choosing the group’s desired format. Each golfer can then login to the application, join the tournament, and submit their scores hole by hole, allowing each player to see where they stack up against their competition.

### Design

<img width="1101" alt="StartupPg1" src="https://github.com/user-attachments/assets/c1629d0b-7b58-46f9-b6e4-fc3167cc0b65">
<img width="881" alt="StartupPg2" src="https://github.com/user-attachments/assets/85654e1d-68f6-436c-8d5a-40f64d6cd14b">
<img width="1017" alt="StartupPg3" src="https://github.com/user-attachments/assets/29b44332-3a08-4f86-845e-eb3d31e4b6bb">

### Key Features

* Secure login over HTTPS
* Ability to create a new tournament in different formats such as standard strokeplay, skins game, or stableford
* Ability for users to enter their scores hole by hole
* Scores are displayed on the leaderboard page in order from best to worst
* Weather forecast available on leaderboard page
* Leaders in under-par scores available on leaderboard page
* Recent scores from players in the tournament will be broadcast to players when they add a score.

### Technologies
I will use the required technologies in the following ways.
* **HTML** - Uses correct HTML structure for application. Four HTML pages. One for login, one to create a new leaderboard or join an existing leaderboard, one for the main leaderboard page, and one for entering scores.
*  **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
*  **React** - Provides login, leaderboard display, display of leaders in under-par scores, and use of React for routing and components.
*  **Service** - Backend service with endpoints for:
    - login
    - submitting scores
    - retrieving weather information
    - retrieving leaderboard status
* **DB/Login** - Store users, scores, and tournament results in database. Register and login users. Credentials securely stored in database. Can't join tournaments and enter scores unless authenticated.
*  **Websocket** - As each user enters a score, their score and current hole are broadcast to all other users and recent scores are broadcast to players when they add a score.

## HTML Deliverable
For this deliverable I built out the html structure of the application
- [X] **HTML Pages** - 4 html pages that represent the ability to log in, create or join new tournaments, a leaderboard page, and the ability to add a score.
- [X] **Links** - The header has links to every page. Additionally, the login button links to the new tournament page, and the create new / join tournament button links to the leaderboard page, and the add score button on the leaderboard page links to the add score page.
- [X] **Text** - The titles of the pages and the name of the tournament and the golf course are represented by textual description.
- [X] **Images** - The leaderboard page contains an image of the golf course that the tournament is at.
- [X] **DB/Login** - Input box and submit button for login. Also scores on leaderboards are stored in DB.
- [X] **WebSocket** - The scores on the leaderboard represent real time scores from the players. Additionally, recent scores on the add page represent the most recent real time scores from the players in the tournament.
