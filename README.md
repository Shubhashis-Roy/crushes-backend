<div align="center">

<img src="https://as2.ftcdn.net/v2/jpg/08/86/96/65/1000_F_886966555_GxPibnZhRyy3e1RBXhxpLtGwCOVKsVfY.jpg"
alt="logo" width="570" height="auto" />

  <p>
Crushes – Social Matching App with React.js, Vite, Node, Express.js, MongoDB, React-Redux, Tailwind Css, 
  </p>

</div>

<hr>
<h3> <a href= "https://crushes.in/" >Live Demo</a> </h3>
<h4> <a href= "https://github.com/Shubhashis-Roy/crushes-web" >Front-end Repo Link</a> </h4>
<h2>Description</h2>

- Developed a highly scalable, <b> fully responsive </b> full-stack dating web application featuring <b> real-time chat </b>
  with Socket.IO, an <b> infinite swipe </b> animated card interface, and <b> JWT-based </b> authentication.
- Implemented daily match notification at 08:00 AM on emails using <b> cron jobs via AWS </b>.
- Deployed the project(front-end, back-end) on <b> AWS</b>.
- Users can add or update their details and upload or update up to three different images

<h2>Technologies</h2>
<table>
      <tbody>
        <tr>
          <th>Node</th>
          <th>React.js</th>
          <th>Vite</th>
           <th>React-Redux</th>
           <th>AWS SES</th>
        </tr>
          <tr>
           <th>MongoDB</th>
           <th>Socket.IO</th>
           <th>Tailwind CSS</th>
           <th>DaisyUI</th>
         </tr>
      </tbody>    
</table>

### <b> All API List: </b>

#### Auth

- POST /signup
- POST /login
- POST /logout

#### Profile

- GET /profile (view)
- PATCH /profile (update)
- PATCH /profile/password

#### Connection Request

- status: interested, ignore
- POST /request/send/:status/:userId
- status: accepted, rejected
- POST /request/review/:status/:requestId

#### User

- GET /user/requests/received (received connection)
- GET /user/connections (get all connection)
- GET /user/feed (get the others users)

### <b> Back-end NPM Packages </b>

- socket.io
- node-cron
- multer
- bcrypt
- cookie-parser
- validator
- jsonwebtoken
- firebase
- express
- cors

### <b> Front-end NPM Packages </b>

- react
- react-dom
- react-icons
- react-redux
- react-router
- react-toastify
- reduxjs/toolkit
- react-router-dom
- socket.io-client
- tailwindcss-animate
- heroicons/react

### Other Applications

- Postman
- Linux
- Vs Code

## How to setup locally and getting started to improve and add new features.

### 1. Create a new directory, cd into it and run 'git init' .

### 2. Clone this repository and the front-end repository. I’ve pasted the front-end repository link above.

### 3. Create a .gitignore file add node-modules, .env .

### 4. Run 'npm installl' , it will install all npm packages and dependencies .

### 5. Create and setup a app in google developer console and obtain CLIENT_ID and CLIENT_SECRET

### 6. Obtain Refresh token by providing CLIENT_ID, CLIENT_SECRET from google's OAuth 2.0 playground to access Gmail Api

### 7. Setup mongodb cloud database and obtain connection url

### 8. Create a .env in config directory inside projects root directory.

### 9. setupp .env variables

- FE_URL = "http://localhost:5173"
- SECRET_TOKEN = ""
- MONGODB_URL = ""
- AWS_SES_ACCESS_KEY = ""
- AWS_SES_SECRET_KEY = ""

### 10. Replace baseUrl with your host address (eg:- http://localhost:3000/ ) for Api call in client side scripts present inside root -> public -> js

### 11. Run 'npm run dev' to run the app in development mode

### 12. open host address to view the website.
