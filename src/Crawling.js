const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const abi = require("./AccommodationInfoRead");
const rbi = require("./RoomInfoRead");
const { ACCOMODATION_URL, accoSelector } = require("./utils/util");
const { iconNameList, download, makeFolder, numberOfPictures } = require("./CommonMethod");
const Accomodation = require("./class/Accomodation");
String.prototype.toNumber = require("./utils/util").toNumber;
//Rating, RatingCount 두개는 마지막 부분만 달라서 나눠도 됨.
//RoomRules 맨 뒤에 숫자만 2,4,6 3개로 변환해서 사용하면 됨
// const selector = JSON.parse(fs.readFileSync('./json/selector.json'));
// const ACCOMODATION_URL = JSON.parse(fs.readFileSync('./json/url.json')).URL;
// const accoSelector = selector.ACCO;
// const roomSelector = selector.ROOM;

// //현재 순환참고 문제 발생중. /*해결완료*/
// module.exports = {
//   ACCOMODATION_URL,
//   accoSelector,
//   roomSelector
// }

// console.log(accoSelector);
// console.log(roomSelector);
// console.log(ACCOMODATION_URL);

//const SAVE_DIRECTORY = `${__dirname}\\lowData\\${title}\\data.json`;//현재 임시

async function startCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);
    //await page.waitForSelector(accoSelector.READY_DOWNLOAD);

    console.log("룸 시작");
    const title = await abi.crawlTitle(page);
    console.log("숙소명: " + title);
    const arrUrl = await abi.crawlRoomUrl(page);
    for await (const roomUrl of arrUrl) {
      await rbi.roomConnect(browser, `https://place-site.yanolja.com${roomUrl}`, title);
    }

    console.log("룸 끝");

    console.log("숙소 시작");
    await startDownloadPicture(page, title);
    const rating = await abi.crawlRating(page);
    const fac = await abi.facilityList(page);
    const lowPrice = await abi.crawlLowPrice(page);
    const basicInfo = await abi.crawlSellerInfo(page);

    const accoData = new Accomodation(title, rating, fac, lowPrice, basicInfo, url);
    fs.writeFile(`${__dirname}\\lowData\\${title}\\data.json`, JSON.stringify(accoData), () => {});

    console.log("숙소 크롤링 끝");

    browser.close();
  } catch (error) {
    console.error(error);
  }
}
async function startDownloadPicture(page, title) {
  const temp = await page.waitForSelector(accoSelector.DOWNLOAD_PICTURE);

  const pictureCount = await countPicture(page);
  for (let index = 0; index < pictureCount; index++) {
    await page.waitForTimeout(200);
    await temp.evaluate((b) => b.click());
    await savePicture(page, index, title);
  }
}

async function savePicture(page, index, title) {
  const [target] = await page.$x("//*[@id='" + index + "']/div/span/img");
  //const [target] = await page.$x(accoSelector.SAVE_PICTURE_XPATH);
  const src = await target.getProperty("src");
  const image = await src.jsonValue();

  makeFolder(__dirname + "\\lowData\\" + title);
  makeFolder(__dirname + "\\lowData\\" + title + "\\images");
  const data = await download(image, `${__dirname}\\lowData\\${title}\\images\\image${index}.jpg`);
}

async function countPicture(page) {
  const numberOfPictureSelector = accoSelector.COUNT_PICTURE;

  return numberOfPictures(page, numberOfPictureSelector);
}

async function initCrawling() {
  for await (const url of ACCOMODATION_URL) {
    try {
      await startCrawl(url);
    } catch (error) {
      console.error(error);
    }
  }
}

initCrawling();
