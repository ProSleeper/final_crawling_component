String.prototype.toNumber = require("./utils");
const { accoSelector } = require("./utils");

const { iconNameList, download, makeFolder, numberOfPictures, readTitle } = require("./CommonMethod");

module.exports = {
  crawlTitle: async (page) => {
    const titleSelector = accoSelector.TITLE;

    return await readTitle(page, titleSelector);
  },
  crawlRating: async (page) => {
    const rating = await page.$(`${accoSelector.RATING}.css-189aa3t`);
    const ratingCount = await page.$(`${accoSelector.RATING}.css-15gzbke`);

    let strRating = "-1";
    let strRatingCount = "-1";
    try {
      strRating = await page.evaluate((el) => el.textContent, rating);
      strRatingCount = await page.evaluate((el) => el.textContent, ratingCount);
    } catch (error) {}
    return [strRating.toNumber(), strRatingCount.toNumber()];
  },
  facilityList: async (page) => {
    const facilitySelector = accoSelector.FACILITY;
    const attr = "img";
    return iconNameList(page, facilitySelector, attr);
  },
  crawlSellerInfo: async (page) => {
    const btn = await page.waitForSelector(accoSelector.SELLER_INFO);
    await btn.evaluate((b) => b.click());

    //element의 부모를 읽어와서 자식을 번호로 사용함
    let ELEMENT_NUMBER = 3;

    const address = await page.$(accoSelector.DATA);
    ELEMENT_NUMBER = 5;
    const tel = await page.$(accoSelector.DATA);
    const strAddr = await page.evaluate((el) => el.textContent, address);
    const strTel = await page.evaluate((el) => el.textContent, tel);

    return [strTel, strAddr];
  },
  crawlLowPrice: async (page) => {
    const result = await page.$$(accoSelector.LOWEST_AND_URL);
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
    const result = await page.$$(accoSelector.LOWEST_AND_URL);
    let LowPrice = [];

    for await (const price of result) {
      const roomUrl = await price.$eval("a", (el) => el.getAttribute("href"));
      LowPrice.push(roomUrl);
    }
    return LowPrice;
  },
};
