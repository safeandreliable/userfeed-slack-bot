const http = require("http");
const express = require("express");
const { createMessageAdapter } = require("@slack/interactive-messages");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
}

const modal = require("./slackbot-modal");
const config = require("./config");
const ufConfig = config.userfeed;

const ufPusherClass = require("./userfeedPusher");
const ufPusher = new ufPusherClass(
  ufConfig.urls,
  ufConfig.nameToFeedId,
  ufConfig.cookies
);

const port = process.env.PORT || 3000;
const slackSigningSecret = config.slack.signingSecret;
const slackToken = config.slack.token;

const slackInteractions = createMessageAdapter(slackSigningSecret);

// ROUTING
app.use("/slack/actions", slackInteractions.expressMiddleware());

// SLACK ACTIONS
slackInteractions.action("uf_open_dialog", (payload, respond) => {
  console.log("-- UF Modal requested");
  sendModal(payload);
});

slackInteractions.action("uf_create", (payload, respond) => {
  const data = payload.submission;
  respond({ text: "Creating..." });
  console.log("-- Creation started");

  ufPusher.createStory(data).then(postUrl => {
    respond({
      text: "Created new Userfeed post: " + postUrl
    });
    console.log("-- Creation complete: " + postUrl);
  });
});

// SERVER STARTUP
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});

const sendModal = payload => {
  const options = {
    method: "POST",
    params: {
      token: slackToken,
      trigger_id: payload.trigger_id,
      dialog: {
        callback_id: "uf_create",
        title: "Create Userfeed Story",
        submit_label: "Create",
        elements: modal(payload.message.text)
      }
    },
    url: "https://slack.com/api/dialog.open"
  };

  axios(options)
    .then(res => {
      console.log("-- UF Modal opened");
    })
    .catch(err => {
      console.log("Error");
      console.log(err);
    });
};
