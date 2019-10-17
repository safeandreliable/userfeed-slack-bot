const Rollbar = require("rollbar");
const http = require("http");
const express = require("express");
const { createMessageAdapter } = require("@slack/interactive-messages");
const bodyParser = require("body-parser");
const app = express();

if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
}

const port = process.env.PORT || 3000;

const config = require("./config");
const ufConfig = config.userfeed;
const slackConfig = config.slack;
const rollbarConfig = config.rollbar;

const rollbar = new Rollbar({
  accessToken: rollbarConfig.accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const slackPusherClass = require("./slackPusher");
const ufPusherClass = require("./userfeedPusher");

const slackPusher = new slackPusherClass(
  slackConfig.token,
  slackConfig.urls,
  rollbar
);
const ufPusher = new ufPusherClass(
  ufConfig.urls,
  ufConfig.nameToFeedId,
  ufConfig.cookies
);

const slackInteractions = createMessageAdapter(slackConfig.signingSecret);

// ROUTING
app.use("/slack/actions", slackInteractions.expressMiddleware());

// SLACK ACTIONS
slackInteractions.action("uf_open_dialog", (payload, respond) => {
  rollbar.log("-- UF Modal requested");
  console.log("-- UF Modal requested");
  slackPusher.sendModal(payload);
});

slackInteractions.action("uf_create", (payload, respond) => {
  let data = payload.submission;
  respond({ text: "Creating..." });
  rollbar.log("-- Creation started");
  console.log("-- Creation started");

  slackPusher.getMessagePermalink(payload).then(permalink => {
    data.permalink = permalink;
    ufPusher.createStory(data).then(postUrl => {
      respond({
        text: "Created new Userfeed post: " + postUrl
      });
      rollbar.log("-- Creation complete: " + postUrl);
      console.log("-- Creation complete: " + postUrl);
    });
  });
});

// SERVER STARTUP
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
