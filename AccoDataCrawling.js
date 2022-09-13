const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const abi = require("./AccoBasicInfo");
const rbi = require("./RoomBasicInfo");

const ACCO_URL = [
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

const TEST_URL = "https://place-site.yanolja.com/places/10041549";

/** 
뒤에 숫자만 바꾸면 된다. 근데 숫자의 기준을 모르겠다 뭐가 지역인지 아니면 숙소의 종류인지
*/

class Accomodation {
  constructor(title, rating, facility, lowPrice, basicInfo, url) {
    this.title = title;
    this.rating = rating[0];
    this.ratingCount = rating[1];
    this.facility = facility;
    this.lowPrice = lowPrice;
    this.tel = basicInfo[0];
    this.address = basicInfo[1];
    this.url = url;
  }
}

async function startCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);
    await readyDownload(page); //로딩

    console.log("룸 시작");
    //객실 크롤링start
    const title = await abi.crawlTitle(page); //숙소명
    console.log("숙소명: " + title);
    const arrUrl = await abi.crawlRoomUrl(page); //객실 Url
    for await (const roomUrl of arrUrl) {
      await rbi.roomConnect(browser, `https://place-site.yanolja.com${roomUrl}`, title);
    }
    //객실 크롤링end
    console.log("룸 끝");

    console.log("숙소 시작");
    //숙소 크롤링start
    await startDownloadPicture(page, title); //숙소 이미지 다운
    const rating = await abi.crawlRating(page); //평점, 평점준 인원
    const fac = await abi.crawlFacility(page); //시설종류
    const lowPrice = await abi.crawlLowPrice(page); //최저가격
    const basicInfo = await abi.crawlSellerInfo(page); //전화번호, 주소
    //위치, 교통, 숙소정책 크롤링

    const accoData = new Accomodation(title, rating, fac, lowPrice, basicInfo, url); //객체 생성
    fs.writeFile(`${__dirname}\\lowData\\${title}\\data.json`, JSON.stringify(accoData), () => {}); //json 파일 저장
    //숙소 크롤링end
    console.log("숙소 크롤링 끝");
    
    browser.close();
  } catch (error) {
    console.error(error);
  }
}
async function readyDownload(page) {
  //await page.waitForNavigation();
  const templa = await page.waitForSelector("#BOTTOM_SHEET > div.css-qu3ao > div > div.right.css-oq3qu5"); //해당 요소가 로딩될때까지 기다려주는 코드

  //try 주석처리 함. startCrawl을 실행하는 곳에서 모든 에러 처리를 하는데
  //이러면 일정한 곳에서 에러처리가 되는 장점이 있지만, 에러가 발생하는 곳에서 처리를 하고 그 후의 코드를 실행해야 하는데
  //그러지 못하고 빠져나오게 됨. 
  //
  //try {
    //원래는 3번만 클릭하면 되는데 이렇게 한 이유는
    //puppeteer에서 지원하는데 내가 구현을 못하는 건지 모르겠는데
    //어떤 event(보통 클릭)으로 애니메이션이나 트랜지션이 발생했다면 그걸 끝나고 다음 클릭을 해야하는데
    //정확히 그렇게 구현하는 방법을 모르겠다.
    //await는 결국 비동기를 동기적으로 만들어주긴 하지만 그게 크롤링할때 애니메이션까지 보장해주지는 못한다.
    // await templa.click();
    // await templa.click();
    // await templa.click();
    // await templa.click();
    // await templa.click();
    // await templa.click();
    // templa.click();
    // templa.click();
    // templa.click();

    await templa.evaluate((b) => b.click());
  //} catch (error) {
    //console.error(error);
  //}
}

async function startDownloadPicture(page, title) {
  //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
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
  const makeFolder = (dir) => {
    //console.log(dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  };
  makeFolder(__dirname + "\\lowData\\" + title);
  makeFolder(__dirname + "\\lowData\\" + title + "\\images");
  const data = await download(image, `${__dirname}\\lowData\\${title}\\images\\image${index}.jpg`);
  //console.log(data); // The file is finished downloading.
}

//NodeJS에서 이미지 URL로 다운받기
async function download(url, dest) {
  const fetchResponse = await fetch(url);
  const myBlob = await fetchResponse.blob();
  const myArrayBuffer = await myBlob.arrayBuffer();
  const myImageArray = Buffer.from(myArrayBuffer);

  fs.appendFile(dest, myImageArray, () => {});
}

async function countPicture(page) {
  const result = await page.$("#__next > div > div > main > article > div:nth-child(1) > section > div.css-3yjbuh > figcaption > figcaption > p.css-0");
  const value = await page.evaluate((el) => el.textContent, result);

  const regex = /\d/gi;

  const imageCount = value.match(regex).join().replaceAll(",", "");
  return Number(imageCount);
  //console.log(startEval);
}
(async () => {
  for await (const url of ACCO_URL) {
    try {
      await startCrawl(url);
    } catch (error) {
      console.error(error);
    }
  }
})();

/**
 * 숙소에서 크롤링할 데이터
 *
 * 숙소명
 * 평점
 * 평점인원
 * 인기시설 및 서비스(편의시설)
 * 전화번호
 * 주소
 * 최저가격
 * 이미지
 */

/**
 * 객실에서 크롤링할 데이터
 *
 * 객실명
 * 기본정보(인원수, 금연 등)
 * 기준인원
 * 최대인원
 * 숙박 시작일
 * 숙박 종료일
 * 가격
 * 이미지
 *
 */
