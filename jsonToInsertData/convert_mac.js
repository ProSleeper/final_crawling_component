const fs = require("fs");

let {
  findRoomDir,
  parseRoomPath,
  convertToRoom,
  convertToRoomImage,
  findRoomImage,
  saveRoomInfo,
  saveRoomImage,

  //변수
  accomNum,
  accomImageNum,
  roomNum,
  roomImageNum,
  accomData,
  accomImageData,
  roomData,
  roomImageData,

  //상수
  regionValue,
  category,
  filePath,
} = require("./convert_mac_by_room");

//recurPath의 경로부터 경로를 찾아서 폴더면 재귀로 계속해서 찾고
//이름이 data.json인 파일을 찾으면 작업 시작
const findDataJson = (recurPath) =>
  fs.readdir(recurPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((item) => {
        if (item.isDirectory()) {
          findDataJson(`${recurPath}/${item.name}`);
        } else if (item.name === "data.json") {
          parseDataJson(`${recurPath}/${item.name}`);
        }
      });
    }
  });

//path로 입력된 경로의 파일을 읽어서(여기서는 data.json)
const parseDataJson = (path) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const accomJson = JSON.parse(data);
    convertToAccom(accomJson, path);
  });
};

//숙소의 데이터를 가지고 있는 json파일을 읽어서 insert SQL문으로 만들어준다.
const convertToAccom = (data, path) => {
  const infoArray = path.split("/");

  const categoryNum = category.indexOf(infoArray[8]) + 1;
  const regionNum = regionValue.indexOf(infoArray[9]) + 1;

  accomData = `(${++accomNum},"${infoArray[9]}","${infoArray[9]}","${data.address}","${data.title}",${data.rating / 10},${data.tel},${0},NULL,NULL,NULL,NULL,${data.lowPrice},${60},${1},${categoryNum},${regionNum}),
  `;
  saveAccomInfo(accomData, infoArray);
  convertToAccomImage(data, path, accomNum); //이 부분이 중요해보인다.
  parseRoomPath(accomData, infoArray, accomNum);
};

//숙소의 정보와 경로 찾기
const convertToAccomImage = (data, path, viewAccomNum) => {
  let infoArray = path.split("/");
  infoArray[12] = "images";
  const accomImagePath = infoArray.join("/");

  findAccomImage(data, accomImagePath, viewAccomNum);
};

//찾은 경로와 숙소 데이터로 이미지의 이름을 읽는다.
const findAccomImage = (data, recurPath, viewAccomNum) => {
  fs.readdir(recurPath, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((imageName) => {
        accomImageData = `(${++accomImageNum}, "${imageName}", "${imageName}", ${viewAccomNum}),
        `;
        saveAccomImage(accomImageData);
      });
    }
  });
};

//숙소에 대한 sql문을 파일로 작성
const saveAccomInfo = (data, infoArray) => {
  fs.appendFile(`${__dirname}/accom.sql`, data, (err) => {
    if (err) throw err;
    // parseRoomPath(data, infoArray);
  });
};

//숙소 이미지에 대한 정보를 파일에 작성
const saveAccomImage = (data) => {
  fs.appendFile(`${__dirname}/imageAccom.sql`, data, (err) => {
    if (err) throw err;
  });
};

//메인 실행
category.map((region) => {
  findDataJson(`${filePath}${region}`);
});
