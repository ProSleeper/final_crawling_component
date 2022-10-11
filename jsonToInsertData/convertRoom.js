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
};

// fs.writeFile(`${__dirname}\\data.sql`, JSON.stringify(accoData), (err) => {
//   if (err) throw err;
// });
