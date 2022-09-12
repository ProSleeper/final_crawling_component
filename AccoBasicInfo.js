String.prototype.toNumber = function () {
  return Number(this.match(/\d/gi).join().replaceAll(",", ""));
};
//이렇게 전역 공간에 prototype으로 선언해두면 export안해도 어느 파일에서도 사용이 가능하다.

module.exports = {
  crawlTitle: async (page) => {
    //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
    const result = await page.$("#__next > div > div > main > article > div:nth-child(1) > div.css-arr6gp > div.css-jyf8pg > div.property-title.css-fie5xt");

    let title = await page.evaluate((el) => el.textContent, result);
    title = title.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "");
    return title;
  },
  crawlRating: async (page) => {
    //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
    const rating = await page.$("#__next > div > div > main > article > div:nth-child(1) > div.css-arr6gp > div.css-1wbp5wz > span.css-189aa3t");
    const ratingCount = await page.$("#__next > div > div > main > article > div:nth-child(1) > div.css-arr6gp > div.css-1wbp5wz > span.css-15gzbke");

    let strRating = "평점 없음";
    let strRatingCount = "평점 없음";
    try {
      strRating = await page.evaluate((el) => el.textContent, rating);
      strRatingCount = await page.evaluate((el) => el.textContent, ratingCount);
    } catch (error) {
      console.error(error);
    }

    //console.log(value);
    return [strRating.toNumber(), strRatingCount.toNumber()];
  },
  crawlFacility: async (page) => {
    //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
    const result = await page.$$("#__next > div > div > main > article > div:nth-child(1) > div.css-11sbcds > section > ul > div");

    let arrFac = [];
    for (const facility of result) {
      const facilityName = await facility.$eval("img", (el) => el.getAttribute("alt"));
      //console.log(facilityName);
      arrFac.push(facilityName.replace(" 아이콘", ""));
    }
    return arrFac;
  },
  crawlSellerInfo: async (page) => {
    //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
    const result = await page.waitForSelector("#__next > div > div > main > article > div:nth-child(3) > div > div > div.css-1830rfa");
    // await result.click();
    // await result.click();
    // await result.click();
    // await result.click();
    await result.evaluate((b) => b.click());

    const address = await page.$("#_MODAL_DIM_ > div > div > div > main > article > div > div:nth-child(3) > div:nth-child(2) > div");
    const tel = await page.$("#_MODAL_DIM_ > div > div > div > main > article > div > div:nth-child(5) > div:nth-child(2) > div");
    const strAddr = await page.evaluate((el) => el.textContent, address);
    const strTel = await page.evaluate((el) => el.textContent, tel);

    return [strTel, strAddr];
  },
  crawlLowPrice: async (page) => {
    //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
    const result = await page.$$("#__next > div > div > main > article > div:nth-child(2) > div > div.css-17c0wg8 > div > div.css-1audv06 > div");
    let LowPrice = 0;

    for await (const price of result) {
      const value = await price.$(".css-w3imtf");
      const priceText = await page.evaluate((el) => el.textContent, value);
      const priceNumber = Number(priceText.toNumber());
      //console.log(telDetail);
      if (LowPrice === 0 || LowPrice > priceNumber) {
        LowPrice = priceNumber;
      }
    }
    //console.log(LowPrice);
    return LowPrice;
  },
  crawlRoomUrl: async (page) => {
    //const elements = await page.$x("/html/body/div[1]/div/div/main/article/div[1]/section/div[1]/div/div[3]");
    const result = await page.$$("#__next > div > div > main > article > div:nth-child(2) > div > div.css-17c0wg8 > div > div.css-1audv06 > div");
    let LowPrice = [];

    for await (const price of result) {
      const roomUrl = await price.$eval("a", (el) => el.getAttribute("href"));
      LowPrice.push(roomUrl);
      // const priceText = await page.evaluate((el) => el.textContent, value);
      // const priceNumber = Number(priceText.toNumber());
      // //console.log(telDetail);
      // if (LowPrice === 0 || LowPrice > priceNumber) {
      //   LowPrice = priceNumber;
      // }
    }
    //console.log(LowPrice);
    return LowPrice;
  },
  // 위치/교통, 숙소정책등 크롤링 하려다가 포기. 너무 예외사항이 많음.
  // crawlLocationAndTraffic: async (page) => {
  //   const btn = await page.$$("#__next > div > div > main > article > div:nth-child(2) > div > div.css-ca9ity > div > button");
  //   let LowPrice = [];

  //   try {
  //     await btn[1].click();
  //     await btn[1].click();
  //   } catch (error) {}

  //   const result = await page.$$("#__next > div > div > main > article > div:nth-child(2) > div > div.css-17c0wg8 > div > div > div > div.css-1830rfa > div > div");

  //   console.log(result);

  //   // for (let index = 1; index < array.length; index++) {
  //   //   const element = array[index];
  //   // }
  //   //#__next > div > div > main > article > div:nth-child(2) > div > div.css-17c0wg8 > div > div > div > div.css-1830rfa > div > div.css-dps5x9 > div > div
  //   // for await (const price of result) {
  //   //   const roomUrl = await price.$eval("a", (el) => el.getAttribute("href"));
  //   //   LowPrice.push(roomUrl);
  //   //   // const priceText = await page.evaluate((el) => el.textContent, value);
  //   //   // const priceNumber = Number(priceText.toNumber());
  //   //   // //console.log(telDetail);
  //   //   // if (LowPrice === 0 || LowPrice > priceNumber) {
  //   //   //   LowPrice = priceNumber;
  //   //   // }
  //   // }
  //   // //console.log(LowPrice);
  //   // return LowPrice;
  // },
};
