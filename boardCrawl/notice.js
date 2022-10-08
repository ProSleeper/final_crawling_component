const puppeteer = require("puppeteer");
const fs = require("fs");
const { download, makeFolder } = require("../src/accoCrawl/CommonMethod");

async function runCrawl() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://board.yanolja.com/info/list/index.html?tab=notice");

  /****************************************** 초기화 부분 ******************************************************/
  await page.waitForSelector("#__next > div > div > div.contents-root > div.info-list-items.css-181p7kg"); //공지 리스트 페이지 로딩 대기

  const result = await page.$$(
    "#__next > div > div > div.contents-root > div.info-list-items.css-181p7kg > div.list-item.css-j6u2oz"
  );
  const resultLength = result.length;
  //console.log(resultLength);

  /****************************************** 여기서 공지사항 리스트의 개수를 읽음 ******************************************************/

  //위에서 읽은 리스트의 개수를 가지고 반복함.
  for (let index = 0; index < resultLength; index++) {
    await page.waitForSelector("#__next > div > div > div.contents-root > div.info-list-items.css-181p7kg"); //공지 리스트 페이지 로딩 대기

    const result = await page.$$(
      "#__next > div > div > div.contents-root > div.info-list-items.css-181p7kg > div.list-item.css-j6u2oz"
    );

    await result[index].evaluate((b) => b.click());
    await page.waitForSelector("#__next > div > div > div > div:nth-child(2) > div > div.css-1h4q9a8"); //개별 공지 로딩 대기
    const pages = await browser.pages(); // get all pages
    const page2 = pages[pages.length - 1]; // get the new page
    // console.log(page2.url());

    const title = await page.$eval(
      "#__next > div > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-13vdlhe > div > div > div.css-11kevbc",
      (el) => el.textContent
    );
    const date = await page.$eval(
      "#__next > div > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-13vdlhe > div > div > div.css-m60qz8 > div.css-1beyzow",
      (el) => el.textContent
    );

    let content = await page.$$(
      "#__next > div > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-1fj6chl > div > div > div"
    );

    if (content.length === 0) {
      content = await page.$$(
        "#__next > div > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-1fj6chl > div > div > p"
      );
    }

    if (content.length === 0) {
      content = await page.$$("#docs-internal-guid-d3aae9be-7fff-8fe6-5863-9a9e5c01674e > p");
    }

    if (content.length === 0) {
      content = await page.$$("#docs-internal-guid-e4f98ecf-7fff-0d15-8ba0-7c8de8f82dec > p");
    }

    if (content.length === 0) {
      content = await page.$$(
        "#__next > div > div > div > div:nth-child(2) > div > div.css-1h4q9a8 > div.css-1fj6chl > div > div"
      );
    }

    console.log(content.length);
    let writing = "";

    for await (const element of content) {
      const row = await page.evaluate((el) => el.textContent, element);
      writing += row;
    }

    writing = writing.replaceAll("\n", "");
    writing = writing.replaceAll('"', "");

    const data = {
      title: title,
      date: date,
      content: writing,
      url: page2.url(),
    };

    let fileTitle = `${index + 1}. ${title}.json`;
    fileTitle = fileTitle.replaceAll(/[\/\:\*\?\"\<\>\|\\]/gi, "");

    fs.writeFile(`${__dirname}\\notice\\${fileTitle}`, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    //console.log(writing);
    //console.log(content);

    //크롤링 코드 부분
    const backButton = await page.$("#__next > div > div > header > div > div > div:nth-child(1) > div");
    await backButton.evaluate((b) => b.click());
  }
}

runCrawl();
