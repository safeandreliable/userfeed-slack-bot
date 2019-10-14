const puppeteer = require("puppeteer");

module.exports = class userfeedPusher {
  constructor(urls, nameToFeedId, cookies) {
    this.urls = urls;
    this.nameToFeedId = nameToFeedId;
    this.cookies = cookies;
  }

  processData(data) {
    let newData = {};

    const feedName = data["uf-feed"];
    newData.feed_id = this.nameToFeedId[feedName];
    newData.title = data["uf-title"];
    newData.description = data["uf-desc"];

    return newData;
  }

  async submitForm(fieldValues) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    await page.setCookie(...this.cookies);
    await page.goto(this.urls.dashboard, {
      waitUntil: "load"
    });

    await page.click("#new-post-button");
    await page.waitForSelector("#userfeed-modal", { visible: true });

    await page.evaluate(fieldValues => {
      document.querySelector("#userfeed-modal #post_title").value =
        fieldValues.title;
      document.querySelector("#userfeed-modal #post_description").value =
        fieldValues.description;
      document.querySelector("#userfeed-modal select#post_feed_id").value =
        fieldValues.feed_id;
    }, fieldValues);

    await page.click('#userfeed-modal button[type="submit"]');
    await page.waitForSelector("#post-main-content", { visible: true });
    const pageUrl = await page.url();

    await browser.close();
    return pageUrl;
  }

  // Updates the status of a userfeed story
  async createStory(data) {
    const fieldValues = this.processData(data);
    return await this.submitForm(fieldValues);
  }
};
