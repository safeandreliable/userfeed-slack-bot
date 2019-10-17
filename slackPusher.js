const axios = require("axios");
const modal = require("./slackbot-modal");

module.exports = class slackPusher {
  constructor(token, urls, rollbar) {
    this.token = token;
    this.urls = urls;
    this.rollbar = rollbar;
  }

  async sendModal(payload) {
    const options = {
      method: "POST",
      params: {
        token: this.token,
        trigger_id: payload.trigger_id,
        dialog: {
          callback_id: "uf_create",
          title: "Create Userfeed Story",
          submit_label: "Create",
          elements: modal(payload.message.text),
          state: payload.message_ts
        }
      },
      url: this.urls.openDialog
    };

    return await axios(options)
      .then(res => {
        console.log("-- UF Modal opened");
        return;
      })
      .catch(err => {
        this.rollbar.error("-- Error on UF Modal opening", err);
        console.log("-- Error on UF Modal opening", err);
      });
  }

  async getMessagePermalink(payload) {
    const options = {
      method: "GET",
      params: {
        token: this.token,
        channel: payload.channel.id,
        message_ts: payload.state
      },
      url: this.urls.getPermalink
    };

    return await axios(options)
      .then(res => {
        return res.data.permalink;
      })
      .catch(err => {
        this.rollbar.error("Error on message permalink retrevial", err);
        console.log("Error on message permalink retrevial", err);
      });
  }
};
