const fs = require("fs");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";
const filePath = "D:\\카테고리별 숙소\\motel\\인천(검단) 3S BOTIQUE HOTEL\\rooms";

fs.readdir(filePath, (err, files) => {
  files.forEach((item) => {
    // console.log(`${filePath}\\item\\data.json`);
    convertJson(`${filePath}\\${item}\\roomData.json`);
  });
});

const convertJson = (path) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    //console.log(data);
    const acco = JSON.parse(data);
    //const acco = JSON.parse(data);
    //console.log(acco);
    writeSql(acco, 3, 1);
  });
};

const writeSql = (data, accoNum, region) => {
  const roomInfo = [...data.basicInfo].map((item) => {
    return item.replaceAll("\n", "");
  });

  const strData = `(${accoNum},"${data.title}",${data.defaultGuest},${data.maxGuest},${data.price},"${data.checkIn}","${
    data.checkOut
  }","${[...roomInfo]}"),
`;

  console.log(strData);

  fs.appendFile(`${__dirname}\\roomData.sql`, strData, (err) => {
    if (err) throw err;
  });
  // fs.writeFile(`${__dirname}\\data.sql`, JSON.stringify(accoData), (err) => {
  //   if (err) throw err;
  // });

  // const splitFunc = (dataArray) => {};

  // [
  //   "역삼 컬리넌",
  //   44,
  //   3074,
  //   ["스파/월풀\n/욕조", "주차가능", "거울룸", "와이파이", "트윈베드", "부티크\n브랜드"],
  //   30000,
  //   "050350524475",
  //   "서울 강남구 언주로87길 11 (역삼동)",
  //   "https://place-site.yanolja.com/places/25986",
  // ];

  // data.title, data.tel, (data.categoryNum = category);
  // data.regionNum = region;
  // data.address;
  // data.rating, (data.wishCount = data.ratingCount / 10);
  // data.ratingCount;
  // data.latitude = 0.0;
  // data.longitude = 0.0;
  // data.lowPrice;
  // data.reserveRange = 60;
};

// fs.writeFile(`${__dirname}\\data.sql`, JSON.stringify(accoData), (err) => {
//   if (err) throw err;
// });
