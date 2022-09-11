const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const bi = require("./basicInfo");

const TEST_URL = "https://place-site.yanolja.com/places/3012800";
/** 
https://place-site.yanolja.com/places/3012800
https://place-site.yanolja.com/places/3016420
https://place-site.yanolja.com/places/25986
https://place-site.yanolja.com/places/3006283
https://place-site.yanolja.com/places/1007912
https://place-site.yanolja.com/places/1000099554

뒤에 숫자만 바꾸면 된다. 근데 숫자의 기준을 모르겠다 뭐가 지역인지 아니면 숙소의 종류인지
*/

class Accomodation {
  constructor(title, rating, facility, lowPrice, basicInfo) {
    this.title = title;
    this.rating = rating[0];
    this.ratingCount = rating[1];
    this.facility = facility;
    this.lowPrice = lowPrice;
    this.tel = basicInfo[0];
    this.address = basicInfo[1];
  }
}

async function startCrawl() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(TEST_URL);

  await readyDownload(page); //로딩

  const title = await bi.crawlTitle(page); //숙소명
  await startDownloadPicture(page, title); //숙소 이미지 다운
  const rating = await bi.crawlRating(page); //평점, 평점준 인원
  const fac = await bi.crawlFacility(page); //시설종류
  const lowPrice = await bi.crawlLowPrice(page); //최저가격
  const basicInfo = await bi.crawlSellerInfo(page); //전화번호, 주소

  // console.log(title);
  // console.log(rating);
  // console.log(fac);
  // console.log(lowPrice);
  // console.log(basicInfo);

  const accoData = new Accomodation(title, rating, fac, lowPrice, basicInfo);
  console.log(accoData);

  fs.writeFile(`${__dirname}\\lowData\\${title}\\data.json`, JSON.stringify(accoData), () => {});

  //await readyDownload(page);

  //숙소 크롤링 시작
}

async function readyDownload(page) {
  const templa = await page.waitForSelector("#BOTTOM_SHEET > div.css-qu3ao > div > div.right.css-oq3qu5"); //해당 요소가 로딩될때까지 기다려주는 코드

  try {
    //원래는 3번만 클릭하면 되는데 이렇게 한 이유는
    //puppeteer에서 지원하는데 내가 구현을 못하는 건지 모르겠는데
    //어떤 event(보통 클릭)으로 애니메이션이나 트랜지션이 발생했다면 그걸 끝나고 다음 클릭을 해야하는데
    //정확히 그렇게 구현하는 방법을 모르겠다.
    //await는 결국 비동기를 동기적으로 만들어주긴 하지만 그게 크롤링할때 애니메이션까지 보장해주지는 못한다.
    await templa.click();
    await templa.click();
    await templa.click();
    await templa.click();
    await templa.click();
  } catch (error) {
    //console.error(error);
  }
}

async function startDownloadPicture(page, title) {
  //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
  const temp = await page.waitForSelector("#__next > div > div > main > article > div:nth-child(1) > section > div.carousel-root > div > div.css-ln49wb");

  const pictureCount = await countPicture(page);
  for (let index = 0; index < 3; index++) {
    await page.waitForTimeout(1000);
    await temp.click();
    await savePicture(page, index, title);
  }
}

async function savePicture(page, index, title) {
  const [target] = await page.$x("//*[@id='" + index + "']/div/span/img");
  const src = await target.getProperty("src");
  const image = await src.jsonValue();
  const makeFolder = (dir) => {
    console.log(dir);
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

startCrawl();



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
 * 체크인
 * 체크아웃
 * 가격
 * 이미지
 *
 */
/**
 * 숙소 객실,후기 외에
위치/교통이나 숙소정책
지금안하더라도 나중에 할 계획인거면
미리 데이터 받아놓는게 좋을 것 같아

모텔도 대실 나중에 넣을거면
그 금액도 마찬가지로 넣어야 할 듯 ㅎㅎ;

근데 이 부분은 숙소 구현할 사람이 봐야할 것 같은데

모텔, 호텔별, 그리고 숙소별 보여지는게 조금씩 달라서
숙소 파트 담당하는 사람이 어디까지 만들건지(1,2차 포함) 정해서 말해주세요~
 * 
 * 
 */