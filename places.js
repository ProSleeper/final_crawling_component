const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { ServerResponse } = require("http");

const DEFAULT_URL = "https://place-site.yanolja.com/places/3006283";
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
  await page.goto(DEFAULT_URL);

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
  // console.log(temp);

  for (let index = 0; index < 5; index++) {
    await page.waitForTimeout(1000);
    await temp.click();
    await savePicture(page, index);
  }
}

//뭔가 다운이 되기는 하는데 이건 그냥 된다 느낌으로 행복감만 충족하자
//다른 구현으로 만들자. 내가 조종할 수 있는 코드로
async function savePicture(page, index) {
  await page.$x("//*[@id='" + index + "']/div/span/img");
  // const src = await target.getProperty("src");
  // const image = await src.jsonValue();
  page.on("response", async (response) => {
    const url = response.url();
    console.log(url);
    if (response.request().resourceType() === "image") {
      response.buffer().then((file) => {
        const fileName = url.split("/").pop();
        const filePath = path.resolve("/image/", fileName);
        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(file);
      });
    }
  });
}

startCrawl();