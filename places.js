const puppeteer = require("puppeteer");

// cheerio를 가져온다.
const cheerio = require("cheerio");
const MAIN_URL = "https://place-site.yanolja.com/places/3006283";
/** 
 
https://place-site.yanolja.com/places/25986
https://place-site.yanolja.com/places/3006283
https://place-site.yanolja.com/places/1007912
https://place-site.yanolja.com/places/1000099554

뒤에 숫자만 바꾸면 된다. 근데 숫자의 기준을 모르겠다 뭐가 지역인지 아니면 숙소의 종류인지

*/

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
  const shortCuts_addr = main_shortCut(page);
  //console.log(shortCuts_addr);
  // const d1_Recommended_Motel = await d1_Region_Select(page, shortCuts_addr[0]);

  // console.log("이거지?" + d1_Recommended_Motel);
  // 브라우저를 종료한다.
  //browser.close();
})();

//#BOTTOM_SHEET > div.css-qu3ao > div > div.right.css-oq3qu5

/**
  메인화면의 바로가기 버튼들의 주소 반환
 */
async function main_shortCut(page) {
  const templa = await page.waitForSelector("#BOTTOM_SHEET > div.css-qu3ao > div > div.right.css-oq3qu5"); //해당 요소가 로딩될때까지 기다려주는 코드
  const btn = await page.$("#__next > div > div > main > article > div:nth-child(1) > section > div.carousel-root > div > div.css-ln49wb");


  await templa.click();
  await templa.click();
  await templa.click();
  console.log(btn)
 
  await btn.click();
  
  // const btn = page.waitForSelector("#__next > div > div > main > article > div:nth-child(1) > section > div.carousel-root > div > div.css-ln49wb:before");
  // console.log(btn.length)
  //await btn.click();
  //console.log(btn.click)
  // btn.click();
  // btn.click();
  // await btn.click();
  // btn.click();
  // btn.click();
  // await btn.click();
  // btn.click();
  // btn.click();
  //console.log(typeof btn);
  //await btn.click();
 
}

/**
  모텔 페이지에서 지역선택 부분이 spa로 되어 있어서 그 부분을 눌러서 하위 메뉴가 나오도록 해주는 함수
  나머지 페이지들도 class이름이 동일해서 url만 바꿔주면 모두 동일하게 찾아준다.
  현재는 테스트 모드로 index증가하면서 한개씩 클릭이 잘 되네 해봤다.
  내일은 눌렀을 때 모든 메뉴가 나오면 다음 코드 실행하는 것으로 만들어보자
  wait어쩌구 메서드 쓰면 되는 것 같다.
 */
async function d1_Region_Select(page, url) {
  await loadCheerio(page, url);

  //요 아래에서 에러 나네

  
 
}

async function loadCheerio(page, url) {
  /* 페이지에 접속한다. */
  await page.goto(url);
  /* 페이지의 HTML을 가져온다. */
  const content = await page.content();
  // $에 cheerio를 로드한다.
  return cheerio.load(content);
}
