const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const fs = require("fs");
const bi = require("./AccoBasicInfo");

const TEST_URL = "https://place-site.yanolja.com/places/25986";
/** 
  https://place-site.yanolja.com/places/3012800
  https://place-site.yanolja.com/places/3016420
  https://place-site.yanolja.com/places/25986
  https://place-site.yanolja.com/places/3006283
  https://place-site.yanolja.com/places/1007912
  https://place-site.yanolja.com/places/1000099554
*/
class Room {
  constructor(title, basicInfo, roomRules, price) {
    this.title = title;
    this.basicInfo = basicInfo;
    const arrRules = roomRules[0].match(/\d/gi);
    this.defaultGuest = arrRules[0];
    this.maxGuest = arrRules[1];
    this.checkIn = roomRules[1];
    this.checkOut = roomRules[2];
    this.price = price;
  }
}

module.exports = {
  roomConnect: async (browser, roomUrl, accoTitle) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(roomUrl);
    //await page.waitForNavigation("load");
    const roomTitle = await crawlRoomTitle(page, accoTitle);
    console.log("객실명: " + roomTitle);
    const roomInfo = await crawlRoomInfo(page);
    const roomRules = await crawlRoomRules(page);
    const roomPrice = await crawlLowPrice(page);

    const roomData = new Room(roomTitle, roomInfo, roomRules, roomPrice);
    await startDownloadPicture(page, accoTitle, roomTitle); //객실 이미지 다운
    // console.log(roomTitle);
    // console.log(roomInfo);
    // console.log(roomRules);
    // console.log(roomPrice);

    fs.writeFile(`${__dirname}\\lowData\\${accoTitle}\\rooms\\${roomTitle}\\roomData.json`, JSON.stringify(roomData), () => {});

    page.close();
  },
};

const crawlLowPrice = async (page) => {
  //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
  const result = await page.$$("#__next > div > div > main > article > section:nth-child(3) > ul > li > div > div.css-1tv79r0 > div > div.css-1d2dkx7 > span");
  const LowPrice = await page.evaluate((el) => el.textContent, result[0]);
  return LowPrice.replaceAll(",", "");
};

const crawlRoomRules = async (page) => {
  //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
  const guest = await page.$("#__next > div > div > main > article > section:nth-child(3) > ul > li:nth-child(1) > div > div.css-1xcx7se > span:nth-child(2)");
  const checkIn = await page.$("#__next > div > div > main > article > section:nth-child(3) > ul > li:nth-child(1) > div > div.css-1xcx7se > span:nth-child(4)");
  const checkOut = await page.$("#__next > div > div > main > article > section:nth-child(3) > ul > li:nth-child(1) > div > div.css-1xcx7se > span:nth-child(6)");

  const strGuest = await page.evaluate((el) => el.textContent, guest);
  const strChkIn = await page.evaluate((el) => el.textContent, checkIn);
  const strChkOut = await page.evaluate((el) => el.textContent, checkOut);

  return [strGuest, strChkIn, strChkOut];
};

const crawlRoomInfo = async (page) => {
  //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
  const result = await page.$$("#__next > div > div > main > article > section:nth-child(2) > article.css-11faxjx > ul > li");

  let arrRoom = [];
  for (const roomInfo of result) {
    const roomInfoName = await roomInfo.$eval("div > img", (el) => el.getAttribute("alt"));
    //console.log(roomInfoName);
    arrRoom.push(roomInfoName.replace(" 아이콘", ""));
  }
  return arrRoom;
};

const crawlRoomTitle = async (page, accoTitle) => {
  const result = await page.$("#__next > div > div > main > article > section:nth-child(2) > article.css-zddhdk > div.css-cwsr4f > div.css-x62baa");

  let title = await page.evaluate((el) => el.textContent, result);
  title = title.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "");
  const makeFolderDupl = (dir) => {
    //console.log(dir);
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

  //console.log(title);
  return title;
};
async function startDownloadPicture(page, accoTitle, roomTitle) {
  
  let picture = null;
  try {
    picture = await page.waitForSelector("#__next > div > div > main > article > section.css-1wpv5ik > div.carousel-root > div > div.css-ln49wb");
  } catch (error) {
    //console.error(error);
  }
  
  const pictureCount = await countPicture(page);
  for (let index = 0; index < pictureCount; index++) {
    await page.waitForTimeout(200);
    //await picture.click();
    if (picture != undefined && picture != null) {
      await picture.evaluate((b) => b.click());
    }
    await savePicture(page, index, accoTitle, roomTitle);
  }
}

async function countPicture(page) {
  const result = await page.$("#__next > div > div > main > article > section.css-1wpv5ik > div.css-3yjbuh > figcaption > figcaption > p.css-0");
  const value = await page.evaluate((el) => el.textContent, result);

  const regex = /\d/gi;

  const imageCount = value.match(regex).join().replaceAll(",", "");
  return Number(imageCount);
  //console.log(startEval);
}

const makeFolder = (dir) => {
  //console.log(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
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

async function download(url, dest) {
  const fetchResponse = await fetch(url);
  const myBlob = await fetchResponse.blob();
  const myArrayBuffer = await myBlob.arrayBuffer();
  const myImageArray = Buffer.from(myArrayBuffer);

  fs.appendFile(dest, myImageArray, () => {});
}
