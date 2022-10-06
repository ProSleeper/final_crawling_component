const { accoSelector } = require("../utils/util");
const { iconNameList, download, makeFolder, numberOfPictures, readTitle } = require("./CommonMethod");
String.prototype.toNumber = require("../utils/util");

const crawlTitle = async (page) => {
  const titleSelector = accoSelector.TITLE;

  return await readTitle(page, titleSelector);
};
const crawlRating = async (page) => {
  const rating = await page.$(`${accoSelector.RATING}.css-189aa3t`);
  const ratingCount = await page.$(`${accoSelector.RATING}.css-15gzbke`);

  let strRating = "-1";
  let strRatingCount = "-1";
  try {
    strRating = await page.evaluate((el) => el.textContent, rating);
    strRatingCount = await page.evaluate((el) => el.textContent, ratingCount);
  } catch (error) {}
  return [strRating.toNumber(), strRatingCount.toNumber()];
};
const facilityList = async (page) => {
  const facilitySelector = accoSelector.FACILITY;
  const attr = "img";
  return iconNameList(page, facilitySelector, attr);
};
const crawlSellerInfo = async (page) => {
  const btn = await page.waitForSelector(accoSelector.SELLER_INFO.BUTTON);
  await btn.evaluate((b) => b.click());

  const address = await page.$(accoSelector.SELLER_INFO.ADDRESS);
  const tel = await page.$(accoSelector.SELLER_INFO.TEL);
  const strAddr = await page.evaluate((el) => el.textContent, address);
  const strTel = await page.evaluate((el) => el.textContent, tel);

  return [strTel, strAddr];
};
const crawlLowPrice = async (page) => {
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
};
const crawlRoomUrl = async (page) => {
  const result = await page.$$(accoSelector.LOWEST_AND_URL);
  let LowPrice = [];

  for await (const price of result) {
    const roomUrl = await price.$eval("a", (el) => el.getAttribute("href"));
    LowPrice.push(roomUrl);
  }
  return LowPrice;
};
const startDownloadPicture = async (page, title) => {
  const temp = await page.waitForSelector(accoSelector.DOWNLOAD_PICTURE);

  let pictureCount = await countPicture(page);
  // pictureCount = pictureCount > 10 ? 10 : pictureCount;
  for (let index = 0; index < pictureCount; index++) {
    await page.waitForTimeout(200);
    await temp.evaluate((b) => b.click());
    await savePicture(page, index, title);
  }
};
const savePicture = async (page, index, title) => {
  const [target] = await page.$x(`//*[@id='${index}']/div/span/img`);
  const src = await target.getProperty("src");
  const image = await src.jsonValue();

  makeFolder(`${__dirname}\\..\\lowData\\${title}\\images`);
  await download(image, `${__dirname}\\..\\lowData\\${title}\\images\\image${index}.jpg`);
};
const countPicture = async (page) => {
  const numberOfPictureSelector = accoSelector.COUNT_PICTURE;
  return numberOfPictures(page, numberOfPictureSelector);
};

module.exports = {
  crawlTitle,
  crawlRating,
  facilityList,
  crawlSellerInfo,
  crawlLowPrice,
  crawlRoomUrl,
  startDownloadPicture,
  savePicture,
  countPicture,
};
