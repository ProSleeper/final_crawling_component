const puppeteer = require("puppeteer");
const crawling = require("../accoCrawl/Crawling")
const { CATEGORY_URL } = require("../utils/util");
String.prototype.toNumber = require("../utils/util").toNumber;

//대도시 버튼 리스트 엘리먼트 셀렉터
const motel_area = "#__next > div:nth-child(1) > div.StyleComponent_container__1jS9A.SubhomeBody_layout__3oFMz > main > div.SubhomeRegionList_regionListWrap__3VC7Z > ul > li";

//각 대도시별 리스트 엘리먼트 셀렉터
const local_area = "#__next > div:nth-child(1) > div.StyleComponent_container__1jS9A.SubhomeBody_layout__3oFMz > main > div.SubhomeRegionList_regionListWrap__3VC7Z > ul > li.SubhomeRegionList_regionActive__39Bnt > div > a[href]";

//소분류 페이지 들어가서 숙소 리스트 셀렉터
const local_accom = "#__next > div.StyleComponent_container__1jS9A.list_listContainer__2kL99.list_bottomPadding__xvWzu > section.PlaceListBody_placeListBodyContainer__1u70R > div:nth-child(1) > div > div";

async function runCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);

    const result = await page.$$(motel_area);

    for await (const cityBtn of result) {
      const city = await cityBtn.$eval('a', el => el.textContent); //대도시 이름 출력
      console.log(city);
      await cityBtn.$eval('a', el => el.click());
      await cityBtn.waitForSelector(local_area);
      
      const localButtons = await page.$$(local_area);
      
      for await (const localbtn of localButtons) {

        const result = await localbtn.getProperty('href');
        const url = await result.jsonValue();
        const localName = await localbtn.evaluate(el => el.textContent);
        console.log(url);       //소분류 url
        console.log(localName); //소분류 지역 이름

        const secondPage = await browser.newPage();
        await secondPage.setViewport({ width: 1920, height: 1080 });

        await secondPage.goto(url);
        
        await secondPage.waitForSelector(local_accom);
        
        const localAccomList = await secondPage.$$(local_accom);
        for await (const localAccom of localAccomList) {
          const uri = await localAccom.$eval('a', el => el.getAttribute('href'));
          console.log("https://www.yanolja.com" + uri);

          const regionText = `\\${city.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "")}\\${localName.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "")}`;
          // console.log(regionText);
          await crawling.runCrawl("https://www.yanolja.com" + uri, regionText);
        }

        // const localName = await localbtn.evaluate(el => el.textContent);
        await secondPage.close();
      }
    }
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
