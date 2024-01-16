# PixelChat

PixelChat is a website clone of [Slack](https://www.slack.com/) populated with content inspired by famous video game characters like Mario, Minecraft Steve, Kirby, and Zelda. PixelChat allows users to create and join unique servers and channels designed to host fun conversations between server members. To help express themselves, users can customize their profile and add emoji reactions to any message they like! [Click here to view the PixelChat Live Site](https://slack-deploy.onrender.com/)

## 🌐 Wiki Link

* [Database Schema](https://github.com/Promingy/SlackProject/wiki/Slack-Clone-DB-Schema)
* [Feature List](https://github.com/Promingy/SlackProject/wiki/Feature-list)
* [User Stories](https://github.com/Promingy/SlackProject/wiki/User-Stories)
* [API Routes](https://github.com/Promingy/SlackProject/wiki/API-routes)
* [Frontend Routes](https://github.com/Promingy/SlackProject/wiki/Frontend-routes)
* [React Components List](https://github.com/Promingy/SlackProject/wiki/React-Components-list)

## 💻 Languages and Technologies

This is a concise list of what was utilized to develop this project.

<div>
   <img src="https://raw.githubusercontent.com/devicons/devicon/55609aa5bd817ff167afce0d965585c92040787a/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40">
   <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" title="HTML5" alt="HTML" width="40" height="40"/>&nbsp;
   <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-plain-wordmark.svg"  title="CSS3" alt="CSS" width="40" height="40"/>&nbsp;
   <img src="https://github.com/devicons/devicon/blob/master/icons/react/react-original-wordmark.svg" title="React" alt="React" width="40" height="40"/>&nbsp;
   <img src="https://github.com/devicons/devicon/blob/master/icons/redux/redux-original.svg" title="Redux" alt="Redux " width="40" height="40"/>&nbsp;
   <img src="https://cdn.freebiesupply.com/logos/large/2x/flask-logo-png-transparent.png" title="Flask" alt="Flask " width="40" height="40"/>&nbsp;
   <img src="https://github.com/devicons/devicon/blob/master/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" title="AWS" alt="AWS" width="40" height="40"/>&nbsp;
   <img src="https://github.com/devicons/devicon/blob/master/icons/git/git-original-wordmark.svg" title="Git" **alt="Git" width="40" height="40"/>
</div>

* Python
* PostgreSQL
* Websockets

## ⚙️ Getting started

1. Clone this repository (only the main branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

   to regenerate requirements.txt run `pipenv requirements > requirements.txt`

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the __.env__ file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React frontend in development, `cd` into the __react-vite__
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the __dist__
   folder whenever you change your code, keeping the production version up to
   date. Finally, run `npm run dev` to open the application on the local browser.

## 📷 Landing Page:

You will be able to test the features without sign up by clicking on one of the "Demo User" buttons in the Signup Page. You will then be directed to the landing page, where you can create a server, join a server, or open a server.

<img src='./images/readme_img_1.png'>
<img src='./images/readme_img_2.png'>
<img src='./images/readme_image_main.png'>

## ⏩ Future Features
* Huddles
* Direct Messages
* Threads
* Search
