const puppeteer = require("puppeteer");
const fs = require("fs");
const { download, makeFolder } = require("../src/accoCrawl/CommonMethod");

async function runCrawl() {
  const browser = await puppeteer.launch({ headless: true });
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

    //이벤트 기간
    const bannerDate = await write.$eval(
      "a > div.EventListItem_desc__2bTn2 > span > span.EventListItem_date__1dgz_",
      (el) => el.textContent
    );
    console.log(bannerDate);

    await roomCrawl(browser, "https://www.yanolja.com" + roomUrl, bannerDate);
    //await roomCrawl(browser, "https://www.yanolja.com/event/18860");
  }
}

const roomCrawl = async (browser, url, bannerDate) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);

  await page.waitForSelector(
    "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div"
  );

  //이 아래로 이미지 찾기
  //************************************************************** */
  let imgResult = await page.$$(
    "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div > p > img"
  );

  if (imgResult.length === 0) {
    imgResult = await page.$$(
      "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div > img"
    );
  }

  let aResult = await page.$$(
    "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div > p > a"
  );

  if (aResult.length === 0) {
    aResult = await page.$$(
      "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > main > div > section > div > a"
    );
  }
  //************************************************************** */

  const title =
    "#__next > div.SunnyLayout_container__3PLag._no__layout__AV2Tg > header > div.page-title.PageTitle_container__wVTJI.PageTitle_hasBottomBorder__1vShE.white._no__pageTitle__27sNO > div > h1";

  //await page.$eval(title, (el) => el.textContent);
  //위 방식이 가장 편한거 같네. title에 selector 넣고 콜백으로 찾을 방식 넣고
  let subject = await page.$eval(title, (el) => el.textContent);
  console.log(subject);
  subject = subject.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "");
  //console.log(url);
  //console.log(imgResult.length);

  const data = {
    title: subject,
    date: bannerDate,
    url: url,
  };

  makeFolder(`${__dirname}\\event\\${subject}`);

  fs.writeFile(`${__dirname}\\event\\${subject}\\data.json`, JSON.stringify(data), (err) => {
    if (err) throw err;
  });

  let index = 0;
  for await (const image of imgResult) {
    const imageUrl = await (await image.getProperty("src")).jsonValue();

    console.log(imageUrl);
    //console.log(__dirname);
    download(imageUrl, `${__dirname}\\event\\${subject}\\image${index++}.${imageUrl.slice(-3)}`);
  }
  let clickindex = 0;
  for await (const image of aResult) {
    // const imageUrl = await (await image.getProperty("src")).jsonValue();
    const imageUrl = await image.$eval("img", (el) => el.getAttribute("src"));
    //console.log(imageUrl.slice(-3));
    //console.log(__dirname);
    download(imageUrl, `${__dirname}\\event\\${subject}\\clickImage${clickindex++}.${imageUrl.slice(-3)}`);
  }
  page.close();
};

runCrawl();
