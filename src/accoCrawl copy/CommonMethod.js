const fs = require("fs");
const fetch = require("node-fetch");
String.prototype.toNumber = require("../utils/util");

const iconNameList = async (page, selector, attr) => {
  const elements = await page.$$(selector);

  let iconNameList = [];
  for (const element of elements) {
    const iconName = await element.$eval(attr, (el) => el.getAttribute("alt"));
    iconNameList.push(iconName.replace(" 아이콘", ""));
  }
  return iconNameList;
};

const download = async (url, dest) => {
  const fetchResponse = await fetch(url);
  const myBlob = await fetchResponse.blob();
  const myArrayBuffer = await myBlob.arrayBuffer();
  const myImageArray = Buffer.from(myArrayBuffer);

  fs.appendFile(dest, myImageArray, () => {});
};

const makeFolder = (dir) => {
  //폴더없으면 폴더 여러개 생성
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const numberOfPictures = async (page, numberOfPictureSelector) => {
  const numberOfPictures = await page.$(numberOfPictureSelector);
  const count = await page.evaluate((el) => el.textContent, numberOfPictures);
  return count.toNumber();
};

const readTitle = async (page, titleSelector) => {
  const result = await page.$(titleSelector);
  let title = await page.evaluate((el) => el.textContent, result);
  
  return title.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "");
};

module.exports = {
  iconNameList,
  download,
  makeFolder,
  numberOfPictures,
  readTitle
};
