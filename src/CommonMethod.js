const fs = require("fs");
const fetch = require("node-fetch");
String.prototype.toNumber = require("./utils");

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
  //console.log("유알" + url);
  const fetchResponse = await fetch(url);
  const myBlob = await fetchResponse.blob();
  const myArrayBuffer = await myBlob.arrayBuffer();
  const myImageArray = Buffer.from(myArrayBuffer);

  fs.appendFile(dest, myImageArray, () => {});
};

const makeFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
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
  title = title.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "");
  return title;
};

module.exports = { iconNameList, download, makeFolder, numberOfPictures, readTitle };
