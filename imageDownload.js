const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");

const TEST_URL = "https://place-site.yanolja.com/places/3006283";
/** 

https://place-site.yanolja.com/places/25986
https://place-site.yanolja.com/places/3006283
https://place-site.yanolja.com/places/1007912
https://place-site.yanolja.com/places/1000099554

뒤에 숫자만 바꾸면 된다. 근데 숫자의 기준을 모르겠다 뭐가 지역인지 아니면 숙소의 종류인지
*/

async function startCrawl() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(TEST_URL);
  //숙소 크롤링 시작
  accoCrawl(page);
}

//숙소 정보 크롤링(일단 사진부터)
async function accoCrawl(page) {
  await readyDownload(page);
  await startDownloadPicture(page);

  // const fileName = image.split("/").pop();
  // const filePath = path.resolve("c:\\", fileName);
  // const writeStream = fs.createWriteStream(filePath);
  // writeStream.write(file);
}

async function readyDownload(page) {
  const templa = await page.waitForSelector("#BOTTOM_SHEET > div.css-qu3ao > div > div.right.css-oq3qu5"); //해당 요소가 로딩될때까지 기다려주는 코드
  // const btn = await page.$("#__next > div > div > main > article > div:nth-child(1) > section > div.carousel-root > div > div.css-ln49wb");
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

async function startDownloadPicture(page) {
  //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
  const temp = await page.waitForSelector("#__next > div > div > main > article > div:nth-child(1) > section > div.carousel-root > div > div.css-ln49wb");

  const pictureCount = await countPicture(page);
  for (let index = 0; index < 3; index++) {
    await page.waitForTimeout(1000);
    await temp.click();
    await savePicture(page, index);
  }
}

async function savePicture(page, index) {
  const [target] = await page.$x("//*[@id='" + index + "']/div/span/img");
  const src = await target.getProperty("src");
  const image = await src.jsonValue();

  const data = await download(image, `C:\\image\\image${index}.jpg`);
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
 * 숙박 시작일
 * 숙박 종료일
 * 가격
 * 이미지
 *
 */
