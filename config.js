module.exports = {
  slack: {
    token: process.env.TOKEN,
    signingSecret: process.env.SIGNING_SECRET
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
