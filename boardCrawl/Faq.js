const puppeteer = require("puppeteer");
const fs = require("fs");
const { download, makeFolder } = require("../src/accoCrawl/CommonMethod");

// https://board.yanolja.com/faq/list/index.html?tab=product  //상품 서비스
// https://board.yanolja.com/faq/list/index.html?tab=payment  //예약/결제/영수증
// https://board.yanolja.com/faq/list/index.html?tab=refund  //변경/취소/환불
// https://board.yanolja.com/faq/list/index.html?tab=discount  //쿠폰/할인
// https://board.yanolja.com/faq/list/index.html?tab=point  //코인/포인트
// https://board.yanolja.com/faq/list/index.html?tab=review  //후기/댓글
// https://board.yanolja.com/faq/list/index.html?tab=account  //회원/개인정보
// https://board.yanolja.com/faq/list/index.html?tab=yanolja-service  //믿고쓰는 야놀자 ;; 이건 전부 사진이네??
const faqCategory = [
  "https://board.yanolja.com/faq/list/index.html?tab=product",
  "https://board.yanolja.com/faq/list/index.html?tab=payment",
  "https://board.yanolja.com/faq/list/index.html?tab=refund",
  "https://board.yanolja.com/faq/list/index.html?tab=discount",
  "https://board.yanolja.com/faq/list/index.html?tab=point",
  "https://board.yanolja.com/faq/list/index.html?tab=review",
  "https://board.yanolja.com/faq/list/index.html?tab=account",
];
(async () => {
  for await (const url of faqCategory) {
    await runCrawl(url);
  }
})();

async function runCrawl(faqUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(faqUrl);

  /****************************************** 초기화 부분 ******************************************************/
  await page.waitForSelector("#__next > div > div > div.contents-root > div.faq-list-items.css-181p7kg"); //공지 리스트 페이지 로딩 대기

  const result = await page.$$(
    "#__next > div > div > div.contents-root > div.faq-list-items.css-181p7kg > div.list-item.css-1ksufaa"
  );
  const resultLength = result.length;
  //console.log(resultLength);

  /****************************************** 여기서 공지사항 리스트의 개수를 읽음 ******************************************************/

  //위에서 읽은 리스트의 개수를 가지고 반복함.
  for (let index = 0; index < resultLength; index++) {
    await page.waitForSelector("#__next > div > div > div.contents-root > div.faq-list-items.css-181p7kg"); //공지 리스트 페이지 로딩 대기

    const result = await page.$$(
      "#__next > div > div > div.contents-root > div.faq-list-items.css-181p7kg > div.list-item.css-1ksufaa"
    );

    await result[index].evaluate((b) => b.click());
    await page.waitForSelector("#__next > div > div > div:nth-child(2) > div > div.css-1h4q9a8"); //개별 공지 로딩 대기
    const pages = await browser.pages(); // get all pages
    const page2 = pages[pages.length - 1]; // get the new page
    //console.log(page2.url());

    const title = await page.$eval(
      "#__next > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-13vdlhe > div > div > div",
      (el) => el.textContent
    );
    //console.log(title);

    let content = await page.$eval(
      "#__next > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-1fj6chl > div > div",
      (el) => el.textContent
    );

    //console.log(content);

    console.log(content.length);
    content = content.replaceAll("\n", "");
    const data = {
      title: title,
      content: content,
      url: page2.url(),
    };

    const folder = faqUrl.slice(faqUrl.indexOf("tab=") + 4);
    //console.log(folder);

    makeFolder(`${__dirname}\\faq\\${folder}`);

    let fileTitle = `${index + 1}. ${title}.json`;
    fileTitle = fileTitle.replaceAll(/[\n\t\/\:\*\?\"\<\>\|]/gi, "");

    fs.writeFile(`${__dirname}\\faq\\${folder}\\${fileTitle}`, JSON.stringify(data), (err) => {
      if (err) throw err;
    });

    //크롤링 코드 부분
    const backButton = await page.$("#__next > div > header > div > div > div:nth-child(1) > div");
    await backButton.evaluate((b) => b.click());
  }
  page.close();
}

//runCrawl('https://board.yanolja.com/faq/list/index.html?tab=product');
