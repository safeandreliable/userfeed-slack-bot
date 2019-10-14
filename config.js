module.exports = {
  slack: {
    token: process.env.TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
    urls: {
      openDialog: "https://slack.com/api/dialog.open",
      getPermalink: "https://slack.com/api/chat.getPermalink"
    }
  },
  userfeed: {
    cookies: JSON.parse(process.env.COOKIES),
    nameToFeedId: {
      feature: "1088",
      bug: "1089"
    },
    urls: {
      dashboard: "https://www.userfeed.io/safeandreliable/dashboard"
    }
  }
};
