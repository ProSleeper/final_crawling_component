// puppeteer을 가져온다.
const puppeteer = require("puppeteer");
// cheerio를 가져온다.
const cheerio = require("cheerio");

const MAIN_URL = "https://www.yanolja.com";

(async () => {
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
    headless: false,
  });
  // 새로운 창을 연다.
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  // 창의 크기를 설정한다.
  const $ = await loadCheerio(page, MAIN_URL);

  const shortCuts_addr = main_shortCut($);
  const d1_Recommended_Motel = await d1_Region_Select(page, shortCuts_addr[0]);

  //console.log(shortCuts_addr);
  // 브라우저를 종료한다.
  //browser.close();
})();

/**
  메인화면의 바로가기 버튼들의 주소 반환
 */
function main_shortCut($) {
  const shortCuts_addr = [];
  /** 야놀자 메인 페이지의 바로가기 버튼들의 엘리먼트를 배열로 담는다.*/
  const shortCuts = $(".ThemeStoreWidget_container__3kex- > div > a");
  /** 모든 배열을 순환한다. */
  shortCuts.each((index, list) => {
    /** 각 a태그에 있는 href 속성 값(실제 주소)을 가져와서 주소를 출력한다. */
    const categoryName = $(list).children("p").text();
    const url = $(list).attr("href");

    /* 리턴 데이터는 일단 여러개로 */

    /* 이름: 주소 */
    // shortCuts_addr.push(`${categoryName}: ${url}`);

    /* 주소 */
    shortCuts_addr.push(url);
  });

  return shortCuts_addr;
}

/**
  모텔 페이지에서 지역선택 부분이 spa로 되어 있어서 그 부분을 눌러서 하위 메뉴가 나오도록 해주는 함수
  나머지 페이지들도 class이름이 동일해서 url만 바꿔주면 모두 동일하게 찾아준다.
  현재는 테스트 모드로 index증가하면서 한개씩 클릭이 잘 되네 해봤다.
  내일은 눌렀을 때 모든 메뉴가 나오면 다음 코드 실행하는 것으로 만들어보자
  wait어쩌구 메서드 쓰면 되는 것 같다.
 */
async function d1_Region_Select(page, url) {
  const $ = await loadCheerio(page, url);
  let index = 1;
  let testInterval = setInterval(() => {
    page.click(".SubhomeRegionList_region1Depth__s6mmY > li:nth-child(" + index + ") > a");
    index++;
    if (index > 3) {
      clearInterval(testInterval);
    }
  }, 3000);

  // /** 모든 배열을 순환한다. */
  // console.log(recommend.length);
  // recommend.each((index, list) => {
  //   const regionButton = $(list).attr("a");
  //   regionButton.click();
  /** 각 a태그에 있는 href 속성 값(실제 주소)을 가져와서 주소를 출력한다. */
  //const name = $(list).find(".RecommendationElement_title__15h3T").text();
  //console.log(url);
  //});
}

async function loadCheerio(page, url) {
  /* 페이지에 접속한다. */
  await page.goto(url);
  /* 페이지의 HTML을 가져온다. */
  const content = await page.content();
  // $에 cheerio를 로드한다.
  return cheerio.load(content);
}