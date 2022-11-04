const puppeteer = require("puppeteer");
const fs = require("fs");
const abi = require("../accoCrawl/AccommodationInfoRead");
const roomCrawl = require("../accoCrawl/RoomInfoRead");
const Accomodation = require("../class/Accomodation");
String.prototype.toNumber = require("../utils/util").toNumber;

const coordUrl = "https://address.dawul.co.kr/";

const inputData = "#input_juso";
const inputButton = "#btnSch";
const coordText = "#insert_data_5";
const xxx = "#infoDiv2 > table > tbody:nth-child(1) > tr > td:nth-child(1) > table > tbody > tr:nth-child(6)";



async function runCrawl(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);
    await page.waitForSelector(inputData);
    await page.$eval(inputData, el => el.value = '경기도 성남시 수정구 태평동 2764번지');
    await page.$eval(inputButton, el => el.click());
    const test = await page.$eval(xxx, el => el.innerHTML);
    console.log(test);
    
  } catch (error) {
    console.error(error);
  }
}

async function initCrawling() {
    try {
      await runCrawl(coordUrl);
    } catch (error) {
      console.error(error);
    }
}

initCrawling();
