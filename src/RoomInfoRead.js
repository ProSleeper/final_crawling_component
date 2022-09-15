const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const bi = require("./AccommodationInfoRead");
String.prototype.toNumber = require("./utils");
const { iconNameList, download, makeFolder, numberOfPictures, readTitle } = require("./CommonMethod");
const Room = require("./Room");

module.exports = {
  roomConnect: async (browser, roomUrl, accoTitle) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(roomUrl);
    const roomTitle = await crawlRoomTitle(page, accoTitle);
    console.log("객실명: " + roomTitle);
    const roomInfo = await crawlRoomInfo(page);
    const roomRules = await crawlRoomRules(page);
    const roomPrice = await crawlPrice(page);

    const roomData = new Room(roomTitle, roomInfo, roomRules, roomPrice);
    await startDownloadPicture(page, accoTitle, roomTitle);

    fs.writeFile(`${__dirname}\\lowData\\${accoTitle}\\rooms\\${roomTitle}\\roomData.json`, JSON.stringify(roomData), () => {});

    page.close();
  },
};

const crawlPrice = async (page) => {
  const result = await page.$$("#__next > div > div > main > article > section:nth-child(3) > ul > li > div > div.css-1tv79r0 > div > div.css-1d2dkx7 > span");
  const LowPrice = await page.evaluate((el) => el.textContent, result[0]);
  return LowPrice.replaceAll(",", "");
};

const crawlRoomRules = async (page) => {
  const guest = await page.$("#__next > div > div > main > article > section:nth-child(3) > ul > li:nth-child(1) > div > div.css-1xcx7se > span:nth-child(2)");
  const checkIn = await page.$("#__next > div > div > main > article > section:nth-child(3) > ul > li:nth-child(1) > div > div.css-1xcx7se > span:nth-child(4)");
  const checkOut = await page.$("#__next > div > div > main > article > section:nth-child(3) > ul > li:nth-child(1) > div > div.css-1xcx7se > span:nth-child(6)");

  const strGuest = await page.evaluate((el) => el.textContent, guest);
  const strChkIn = await page.evaluate((el) => el.textContent, checkIn);
  const strChkOut = await page.evaluate((el) => el.textContent, checkOut);

  return [strGuest, strChkIn, strChkOut];
};

const crawlRoomInfo = async (page) => {
  const basicInfoSelector = "#__next > div > div > main > article > section:nth-child(2) > article.css-11faxjx > ul > li";
  const attr = "div > img";
  return iconNameList(page, basicInfoSelector, attr);
};

const crawlRoomTitle = async (page, accoTitle) => {
  const titleSelector = "#__next > div > div > main > article > section:nth-child(2) > article.css-zddhdk > div.css-cwsr4f > div.css-x62baa";

  title = await readTitle(page, titleSelector);
  const makeFolderDupl = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      const mil = new Date().getMilliseconds();
      fs.mkdirSync(`${dir}${mil}`);
      title = `${title}${mil}`;
    }
  };
  makeFolder(__dirname + "\\lowData\\" + accoTitle);
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\");
  makeFolderDupl(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\" + title);

  return title;
};
async function startDownloadPicture(page, accoTitle, roomTitle) {
  let picture = null;
  try {
    picture = await page.waitForSelector("#__next > div > div > main > article > section.css-1wpv5ik > div.carousel-root > div > div.css-ln49wb");
  } catch (error) {}

  const pictureCount = await countPicture(page);
  for (let index = 0; index < pictureCount; index++) {
    await page.waitForTimeout(200);
    if (picture != undefined && picture != null) {
      await picture.evaluate((b) => b.click());
    }
    await savePicture(page, index, accoTitle, roomTitle);
  }
}
async function countPicture(page) {
  const numberOfPictureSelector = "#__next > div > div > main > article > section.css-1wpv5ik > div.css-3yjbuh > figcaption > figcaption > p.css-0";

  return numberOfPictures(page, numberOfPictureSelector);
}

async function savePicture(page, index, accoTitle, roomTitle) {
  const [target] = await page.$x(`//*[@id='${index}']/div/span/img`);
  const src = await target.getProperty("src");
  const image = await src.jsonValue();

  // console.log("page" + page);
  // console.log("index" + index);
  // console.log("accoTitle" + accoTitle);
  // console.log("roomTitle" + roomTitle);
  // console.log("target" + target);
  // console.log("src" + src);
  // console.log("image" + image);
  // console.log("------------------------------");

  makeFolder(__dirname + "\\lowData\\" + accoTitle);
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\");
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\" + roomTitle);
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\" + roomTitle + "\\images");
  const data = await download(image, `${__dirname}\\lowData\\${accoTitle}\\rooms\\${roomTitle}\\images\\image${index}.jpg`);
}
