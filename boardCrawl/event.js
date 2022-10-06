const puppeteer = require("puppeteer");
const fs = require("fs");
const { download } = require("../src/accoCrawl/CommonMethod");

async function runCrawl() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://www.yanolja.com/event");

  // const picture = await page.waitForSelector(
  //   "#__next > div.SunnyLayout_container__3PLag.event_layout__1vS45 > main > div.event_body__205SD > section > ul"
  // );
  await page.waitForSelector(
    "#__next > div.SunnyLayout_container__3PLag.event_layout__1vS45 > main > div.event_body__205SD > section > ul > li"
  );

  await page.keyboard.press("End");
  await page.waitForTimeout(1000);
  await page.keyboard.press("End");
  await page.waitForTimeout(1000);
  await page.keyboard.press("End");
  await page.waitForTimeout(1000);

  const result = await page.$$(
    "#__next > div.SunnyLayout_container__3PLag.event_layout__1vS45 > main > div.event_body__205SD > section > ul > li"
  );

  for await (const write of result) {
    const roomUrl = await write.$eval("a", (el) => el.getAttribute("href"));
    const banner = await write.waitForSelector("div.EventListItem_banner__23BRW");

    const test = await (await banner.getProperty("style")).jsonValue();
    console.log(test);
    //await roomCrawl(browser, "https://www.yanolja.com" + roomUrl);
  }

  //console.log(result.length);
}

const roomCrawl = async (browser, url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);

  await page.waitForSelector(
    "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div"
  );

  let result = await page.$$(
    "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div > p > img"
  );

  if (result.length === 0) {
    result = await page.$$(
      "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div > img"
    );
  }

  //console.log(url);
  //console.log(result.length);
  let index = 0;
  for await (const image of result) {
    const imageUrl = await (await image.getProperty("src")).jsonValue();

    console.log(imageUrl);
    console.log(__dirname);
    download(imageUrl, `${__dirname}\\test\\image${index++}.png`);
  }
  // console.log("여기 못오는듯?");
  // page.close();
};

// const crawlRoomUrl = async (page) => {
//   const result = await page.$$(accoSelector.LOWEST_AND_URL);
//   let LowPrice = [];

//   for await (const price of result) {
//     const roomUrl = await price.$eval("a", (el) => el.getAttribute("href"));
//     LowPrice.push(roomUrl);
//   }
//   return LowPrice;
// };

runCrawl();
