const puppeteer = require("puppeteer");
const fs = require("fs");
const abi = require("./AccommodationInfoRead");
const roomCrawl = require("./RoomInfoRead");
const { ACCOMODATION_URL } = require("../utils/util");
const Accomodation = require("../class/Accomodation");
String.prototype.toNumber = require("../utils/util").toNumber;

async function runCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);

    const title = await abi.crawlTitle(page);
    console.log("숙소명: " + title);
    const arrUrl = await abi.crawlRoomUrl(page);
    console.log("룸 크롤링 시작");
    let count = 0;
    for await (const roomUrl of arrUrl) {
      await roomCrawl(browser, `https://place-site.yanolja.com${roomUrl}`, title);
      if (count > 10) {
        //break;
      }
      count++;
    }
    console.log("룸 크롤링 끝");
    console.log("숙소 크롤링 시작");
    await abi.startDownloadPicture(page, title);
    const rating = await abi.crawlRating(page);
    const fac = await abi.facilityList(page);
    const lowPrice = await abi.crawlLowPrice(page);
    const basicInfo = await abi.crawlSellerInfo(page);
    console.log("숙소 크롤링 끝");
    console.log("파일 저장");
    const accoData = new Accomodation(title, rating, fac, lowPrice, basicInfo, url);
    fs.writeFile(`${__dirname}\\..\\lowData\\${title}\\data.json`, JSON.stringify(accoData), (err) => {
      if (err) throw err;
    });
    console.log("파일 저장 끝");
    browser.close();
  } catch (error) {
    console.error(error);
  }
}

async function initCrawling() {
  for await (const url of ACCOMODATION_URL) {
    try {
      await runCrawl(url);
    } catch (error) {
      console.error(error);
    }
  }
}

initCrawling();
