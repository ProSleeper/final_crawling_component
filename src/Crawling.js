const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const abi = require("./AccommodationInfoRead");
const rbi = require("./RoomInfoRead");
String.prototype.toNumber = require("./utils");
const { iconNameList, download, makeFolder, numberOfPictures } = require("./CommonMethod");
const Accomodation = require("./Accomodation");

const SAVE_DIRECTORY = `${__dirname}\\lowData\\${title}\\data.json`;//현재 임시

const ACCOMODATION_URL = [
  "https://place-site.yanolja.com/places/10041549",
  "https://place-site.yanolja.com/places/3008029",
  "https://place-site.yanolja.com/places/10041549",
  "https://place-site.yanolja.com/places/3002358",
  "https://place-site.yanolja.com/places/3012800",
  "https://place-site.yanolja.com/places/3016420",
  "https://place-site.yanolja.com/places/25986",
  "https://place-site.yanolja.com/places/3006283",
  "https://place-site.yanolja.com/places/1007912",
  "https://place-site.yanolja.com/places/1000099554",
  "https://place-site.yanolja.com/places/3007345",
  "https://place-site.yanolja.com/places/10040403",
  "https://place-site.yanolja.com/places/3001028",
  "https://place-site.yanolja.com/places/3013821",
  "https://place-site.yanolja.com/places/3004350",
  "https://place-site.yanolja.com/places/1000103175",
  "https://place-site.yanolja.com/places/10046272",
  "https://place-site.yanolja.com/places/10046312",
];

async function startCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);
    await readyDownload(page);

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
async function readyDownload(page) {
  const templa = await page.waitForSelector("#BOTTOM_SHEET > div.css-qu3ao > div > div.right.css-oq3qu5");
  // await templa.evaluate((b) => b.click());
  // await templa.evaluate((b) => b.click());
  // await templa.evaluate((b) => b.click());
  //이 클릭하는 코드 2개 3개 쓰면 에러나고
  //1개만 써도 헤드리스 아닌 상태로 실행하다가 마우스 클릭하면 에러나고
  //정확히 어떤 이유로 에러가 나는지 모르는 상태다.
  //찾아보자.

  //추가적인 문제 하나 더
  //헤드리스가 아닌 상태에서 실행하고 마우스 포커스를 내가 조종하면 브라우저가 꺼지지 않는 현상이 발생하면서 에러가 난다.
  //이유도 모르겠고... 여튼 아직 문제가 많다.
  //그래도 리팩토링 어느 정도 했어서 다행이다.
}

async function startDownloadPicture(page, title) {
  const temp = await page.waitForSelector("#__next > div > div > main > article > div:nth-child(1) > section > div.carousel-root > div > div.css-ln49wb");

  const pictureCount = await countPicture(page);
  for (let index = 0; index < pictureCount; index++) {
    await page.waitForTimeout(200);
    await temp.evaluate((b) => b.click());
    await savePicture(page, index, title);
  }
}

async function savePicture(page, index, title) {
  const [target] = await page.$x("//*[@id='" + index + "']/div/span/img");
  const src = await target.getProperty("src");
  const image = await src.jsonValue();

  makeFolder(__dirname + "\\lowData\\" + title);
  makeFolder(__dirname + "\\lowData\\" + title + "\\images");
  const data = await download(image, `${__dirname}\\lowData\\${title}\\images\\image${index}.jpg`);
}

async function countPicture(page) {
  const numberOfPictureSelector = "#__next > div > div > main > article > div:nth-child(1) > section > div.css-3yjbuh > figcaption > figcaption > p.css-0";

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
