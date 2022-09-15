String.prototype.toNumber = require("./utils");
const { iconNameList, download, makeFolder, numberOfPictures, readTitle } = require("./CommonMethod");
const aa = {a:1, b:2}
module.exports = {
  crawlTitle: async (page) => {
    const titleSelector = "#__next > div > div > main > article > div:nth-child(1) > div.css-arr6gp > div.css-jyf8pg > div.property-title.css-fie5xt";

    return await readTitle(page, titleSelector);
  },
  crawlRating: async (page) => {
    const rating = await page.$("#__next > div > div > main > article > div:nth-child(1) > div.css-arr6gp > div.css-1wbp5wz > span.css-189aa3t");
    const ratingCount = await page.$("#__next > div > div > main > article > div:nth-child(1) > div.css-arr6gp > div.css-1wbp5wz > span.css-15gzbke");

    let strRating = "-1";
    let strRatingCount = "-1";
    try {
      strRating = await page.evaluate((el) => el.textContent, rating);
      strRatingCount = await page.evaluate((el) => el.textContent, ratingCount);
    } catch (error) {}
    return [strRating.toNumber(), strRatingCount.toNumber()];
  },
  facilityList: async (page) => {
    const facilitySelector = "#__next > div > div > main > article > div:nth-child(1) > div.css-11sbcds > section > ul > div";
    const attr = "img";
    return iconNameList(page, facilitySelector, attr);
  },
  crawlSellerInfo: async (page) => {
    const result = await page.waitForSelector("#__next > div > div > main > article > div:nth-child(3) > div > div > div.css-1830rfa");
    await result.evaluate((b) => b.click());

    const address = await page.$("#_MODAL_DIM_ > div > div > div > main > article > div > div:nth-child(3) > div:nth-child(2) > div");
    const tel = await page.$("#_MODAL_DIM_ > div > div > div > main > article > div > div:nth-child(5) > div:nth-child(2) > div");
    const strAddr = await page.evaluate((el) => el.textContent, address);
    const strTel = await page.evaluate((el) => el.textContent, tel);

    return [strTel, strAddr];
  },
  crawlLowPrice: async (page) => {
    const result = await page.$$("#__next > div > div > main > article > div:nth-child(2) > div > div.css-17c0wg8 > div > div.css-1audv06 > div");
    let LowPrice = 0;

    for await (const price of result) {
      const value = await price.$(".css-w3imtf");
      const priceText = await page.evaluate((el) => el.textContent, value);
      const priceNumber = Number(priceText.toNumber());
      if (LowPrice === 0 || LowPrice > priceNumber) {
        LowPrice = priceNumber;
      }
    }
    return LowPrice;
  },
  crawlRoomUrl: async (page) => {
    const result = await page.$$("#__next > div > div > main > article > div:nth-child(2) > div > div.css-17c0wg8 > div > div.css-1audv06 > div");
    let LowPrice = [];

    for await (const price of result) {
      const roomUrl = await price.$eval("a", (el) => el.getAttribute("href"));
      LowPrice.push(roomUrl);
    }
    return LowPrice;
  },
};
