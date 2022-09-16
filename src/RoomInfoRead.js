const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const bi = require("./AccommodationInfoRead");
String.prototype.toNumber = require("./utils/util");
const { iconNameList, download, makeFolder, numberOfPictures, readTitle } = require("./CommonMethod");
const Room = require("./class/Room");
const { roomSelector } = require("./utils/util");

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
  const result = await page.$$(roomSelector.PRICE);
  const LowPrice = await page.evaluate((el) => el.textContent, result[0]);
  return LowPrice.replaceAll(",", "");
};

const crawlRoomRules = async (page) => {
  const guest = await page.$(roomSelector.RULES.GUEST);
  const checkIn = await page.$(roomSelector.RULES.CHECK_IN);
  const checkOut = await page.$(roomSelector.RULES.CHECK_OUT);

  const strGuest = await page.evaluate((el) => el.textContent, guest);
  const strChkIn = await page.evaluate((el) => el.textContent, checkIn);
  const strChkOut = await page.evaluate((el) => el.textContent, checkOut);

  return [strGuest, strChkIn, strChkOut];
};

const crawlRoomInfo = async (page) => {
  const basicInfoSelector = roomSelector.INFO;
  const attr = "div > img";
  return iconNameList(page, basicInfoSelector, attr);
};

const crawlRoomTitle = async (page, accoTitle) => {
  const titleSelector = roomSelector.TITLE;

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
    picture = await page.waitForSelector(roomSelector.DOWNLOAD_PICTURE);
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
  const numberOfPictureSelector = roomSelector.COUNT_PICTURE;

  return numberOfPictures(page, numberOfPictureSelector);
}

async function savePicture(page, index, accoTitle, roomTitle) {
  const [target] = await page.$x(`//*[@id='${index}']/div/span/img`);
  const src = await target.getProperty("src");
  const image = await src.jsonValue();

  makeFolder(__dirname + "\\lowData\\" + accoTitle);
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\");
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\" + roomTitle);
  makeFolder(__dirname + "\\lowData\\" + accoTitle + "\\rooms\\" + roomTitle + "\\images");
  const data = await download(image, `${__dirname}\\lowData\\${accoTitle}\\rooms\\${roomTitle}\\images\\image${index}.jpg`);
}
