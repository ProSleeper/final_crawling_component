const fs = require("fs");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";

const filePath = "C:\\Users\\ingn\\Documents\\crawling\\final_crawling_component\\src\\saveData\\";

const category = ["motel", "hotel", "pension", "guestHouse"];

const regionValue = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

//pk로 줄 값
let accomNum = 0;
let roomNum = 0;
let accomImageNum = 0;

let strData = "";
let imageData = "";

const findDataJson = (recurPath) =>
  fs.readdir(recurPath, { withFileTypes: true }, (err, files) => {
    if(err){
      console.error(err)
    }
    else {
      files.forEach((item) => {
        if (item.isDirectory()) {
          findDataJson(`${recurPath}\\${item.name}`);
        } else if (item.name === "data.json") {
          //제일 처음 이 부분으로 들어오면 숙소의 data.json을 찾은 것
          //item이 data.json
          parseDataJson(`${recurPath}\\${item.name}`);
        }
      });
    }

  });

const parseDataJson = (path) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const acco = JSON.parse(data);
    // console.log(acco.title);
    convertToAccom(acco, path);
  });
};

const convertToAccom = (data, path) => {
  const infoArray = path.split("\\");

  const categoryNum = category.indexOf(infoArray[8]) + 1;
  const regionNum = regionValue.indexOf(infoArray[9]) + 1;

  console.log();
  strData = `(${++accomNum},"${infoArray[9]}","${infoArray[9]}","${infoArray[9]}","${data.title}",${data.rating / 10},${
    data.tel
  },${0},NULL,NULL,NULL,NULL,${data.lowPrice},${60},${1},${categoryNum},${regionNum}),
  `;
  saveAccomInfo(strData);
  convertToAccomImage(data, path, accomNum);
  // parseRoomDataJson();
  parseRoomPath(data, infoArray);
};


///////////////////////////////////////////////////
//룸 관련 함수

const parseRoomPath = (accomData, accomPathArray) => {
  accomPathArray[12] = 'rooms';
  const roomPath = accomPathArray.join("\\");

  findRoomDir(accomData, roomPath)
}

const findRoomDir = (accomData, recurRoomPath) =>
  fs.readdir(recurRoomPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    }
    else{
      files.forEach((item) => {
        // console.log(item);
        if (item.isDirectory()) {
          findRoomDir(accomData, `${recurRoomPath}\\${item.name}`);
        } else if (item.name === "roomData.json") {
          //제일 처음 이 부분으로 들어오면 숙소의 data.json을 찾은 것
          //item이 data.json
          parseRoomDataJson(accomData, `${recurRoomPath}\\${item.name}`);
        }
      });
    }
  });

// const roomDataTest = (data, path) => {
//   findDataJson(path)
// }


const parseRoomDataJson = (accomData, path) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    else {
      const room = JSON.parse(data);
      convertToRoom(accomData, room, path);
    }
  });
};

const convertToRoom = (accomData, roomData, path) => {
  const infoArray = path.split("\\");

//여기서부터 하면 됨. 룸 데이터와 룸 이미지만 출력하면 될듯
  console.log();
  // strData = `(${++accomNum},"${infoArray[9]}","${infoArray[9]}","${infoArray[9]}","${data.title}",${data.rating / 10},${
  //   data.tel
  // },${0},NULL,NULL,NULL,NULL,${data.lowPrice},${60},${1},${categoryNum},${regionNum}),
  // `;
  // saveAccomInfo(strData);
  // convertToAccomImage(data, path, accomNum);
};


//룸 관련 함수
///////////////////////////////////////////////////

const convertToAccomImage = (data, path, viewAccomNum) => {
  let infoArray = path.split("\\");
  infoArray[12] = "images";
  const accomImagePath = infoArray.join("\\");

  findAccomImage(data, accomImagePath, viewAccomNum);
};

const findAccomImage = (data, recurPath, viewAccomNum) => {
  fs.readdir(recurPath, (err, files) => {
    if (err) {
      console.error(err)
    }
    else {
      files.forEach((imageName) => {
        imageData = `(${++accomImageNum}, "${imageName}", "${imageName}", ${viewAccomNum}),
        `;
        saveAccomImage(imageData);
      });
    }
  });
};

const saveAccomInfo = (data) => {
  fs.appendFile(`${__dirname}\\accom.sql`, data, (err) => {
    if (err) throw err;
  });
};

const saveAccomImage = (data) => {
  fs.appendFile(`${__dirname}\\imageAccom.sql`, data, (err) => {
    if (err) throw err;
  });
};

category.map((region) => {
  findDataJson(`${filePath}${region}`);
});


