# Userfeed Slack Bot

It is easiest to configure this slackbot by forking this repo.

To get this app running first setup all the following variables in the global env:

```
TOKEN - OAuth Token that you will get when you set up Slack permissions
SIGNING_SECRET - Will get this when you create a new app on Slack
COOKIES - These are the cookies that can be seen with request to userfeed within the network tab on the dev console, JSON stringified
NODE_ENV - Set to "PROD" if you dont want to load from a local env file.
PORT - Port number if you want to set it (Defaults: 3000)
```

To get the app setup and running first run: `npm install` (I may have forgotten a package or too)

Then just run `node app.js` or `npm start`

Also make sure you go through the `config.js` file and setup your dashboard URL and nameToIds of the different feeds.

### Heroku Configuration

- Create new app
- Run `heroku buildpacks:add jontewks/puppeteer` ([github](<[https://github.com/jontewks/puppeteer-heroku-buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack)>)) to add buildpack for headless browser.
- Then push the code up to your dyno.
- Configure you environment variables in the settings tab on the Heroku site for your app.
- Check the logs to make sure everything is running happily.

### Slack Configuration

- Go to [https://api.slack.com/apps](https://api.slack.com/apps)

- Click on "Create New App" and give it a name and add it to your organization.

##### Basic Information Page

- On the basic information page click on "Add features and functionality" and then "Interactive components"

- Add the request url is your `heroku app url` + `/slack/actions`

- Create an action called `uf_open_dialog` and call it whatever you want

##### OAuth & Permissions Page

- Click on the `OAuth & Permission` link on the sidebar.
- Scroll down and add the following permissions: `calls:write` and `commands`
- Once you save, this will give you the OAuth Token that you need above.

##### Basic Information

- Go back to the basic information page and install the app to your workspace.
- Should be good to go after that. Just click on the ellipsis diagram on the far right of a message in slack and scroll down until you see the action you created!
