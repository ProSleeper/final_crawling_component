// puppeteer을 가져온다.
const puppeteer = require("puppeteer");
// cheerio를 가져온다.
const cheerio = require("cheerio");

(async () => {
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  const browser = await puppeteer.launch({
    headless: true,
  });

  // 새로운 페이지를 연다.
  const page = await browser.newPage();
  // 페이지의 크기를 설정한다.
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  /* 메인페이지에 접속한다. */
  await page.goto("https://www.yanolja.com/");
  /* 메인페이지의 HTML을 가져온다. */
  const content = await page.content();
  // $에 cheerio를 로드한다.
  const $ = cheerio.load(content);

  /** 야놀자 메인 페이지의 바로가기 버튼들의 엘리먼트를 배열로 담는다.*/
  const shortCuts = $(".ThemeStoreWidget_container__3kex- > div > a");
  /** 모든 배열을 순환한다. */
  shortCuts.each((index, list) => {
    /** 각 a태그에 있는 href 속성 값(실제 주소)을 가져와서 주소를 출력한다. */
    const addr = $(list).attr("href");

    // 인덱스와 함께 로그를 찍는다.
    console.log(index, addr);
  });
  // 브라우저를 종료한다.
  browser.close();
})();

function main_shortCut(params) {}

function d1_MotelRecommend(params) {}
