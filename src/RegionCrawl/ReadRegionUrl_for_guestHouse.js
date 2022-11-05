const puppeteer = require("puppeteer");
const crawling = require("../accoCrawl/Crawling");
const { CATEGORY_URL } = require("../utils/util");
String.prototype.toNumber = require("../utils/util").toNumber;

//대도시 버튼 리스트 엘리먼트 셀렉터
const motel_area =
  "#__next > div.StyleComponent_container__1jS9A.region_layoutStyle__15Phr > div.RegionList_regionListWrap__Bk-7R.region_motelRegionList__3ADIo > ul > li";

//각 대도시별 리스트 엘리먼트 셀렉터
const local_area =
  "#__next > div.StyleComponent_container__1jS9A.region_layoutStyle__15Phr > div.RegionList_regionListWrap__Bk-7R.region_motelRegionList__3ADIo > ul > li.RegionList_regionActive__3i-9u > div > a";

//소분류 페이지 들어가서 숙소 리스트 셀렉터
const local_accom =
  "#__next > div.StyleComponent_container__1jS9A.list_listContainer__2kL99.list_bottomPadding__xvWzu > section.PlaceListBody_placeListBodyContainer__1u70R.PlaceListBody_hideHeader__1iioo > div > div > div";

//부산은 바로 위 local_accom 태그로 읽을 수 있는 정보가 없다. 그래서 다른 태그로 따로 읽어야 한다.
const local_accom_ver2 =
  "#__next > div.StyleComponent_container__1jS9A.list_listContainer__2kL99.list_bottomPadding__xvWzu > section.PlaceListBody_placeListBodyContainer__1u70R > div:nth-child(2) > div > div";

process.setMaxListeners(1000);

async function runCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);

    let result = await page.$$(motel_area);

    for (let index = 0; index < result.length; index++) {
      let city = await result[index].$eval("a", (el) => el.textContent); //대도시 이름 출력
      console.log(city);
      await result[index].$eval("a", (el) => el.click());

      let localButtons = await page.$$(local_area);
      for (let j = 0; j < localButtons.length; j++) {
        //   const result = await localbtn.getProperty("href");
        //   const url = await result.jsonValue();
        const localName = await localButtons[j].evaluate((el) => el.textContent);
        await localButtons[j].evaluate((el) => el.click());
        let localAccomList;
        try {
          await page.waitForSelector(local_accom);
          console.log(page.url());
          localAccomList = await page.$$(local_accom);
        } catch (error) {
          await page.waitForSelector(local_accom_ver2);
          localAccomList = await page.$$(local_accom_ver2);
        }

        const elements2 = localAccomList.entries();
        for await (const [index, localAccom] of elements2) {
          const uri = await localAccom.$eval("a", (el) => el.getAttribute("href"));
          console.log("https://www.yanolja.com" + uri);

          const regionText = `\\${city.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "")}\\${localName.replaceAll(
            /[\/\:\*\?\"\<\>\|]/gi,
            ""
          )}`;
          // console.log(regionText);
          crawling.runCrawl("https://www.yanolja.com" + uri, regionText);

          if (index == 0) {
            break;
          }
        }

        await page.goBack();
        result = await page.$$(motel_area);
        city = await result[index].$eval("a", (el) => el.textContent); //대도시 이름 출력
        await result[index].$eval("a", (el) => el.click());
        localButtons = await page.$$(local_area);
        // await page.waitForNavigation(local_area);
        // result = await page.$$(motel_area);
        // localButtons = await page.$$(local_area);
        // elements = localButtons.entries();
      }
    }
    page.close().then((result) => console.log("모든 크롤링 끝"));
  } catch (error) {
    console.error(error);
  }
}

async function initCrawling() {
  for await (const url of CATEGORY_URL) {
    try {
      await runCrawl(url);
    } catch (error) {
      console.error(error);
    }
  }
}

initCrawling();
