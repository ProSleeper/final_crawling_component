const fs = require("fs");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";

// const filePath = "C:\\Users\\ingn\\Documents\\crawling\\final_crawling_component\\src\\saveData\\";
const filePath = "/Users/kyw/Documents/projects/final_crawling_component/src/saveData/";

const category = ["motel", "hotel", "pension", "guestHouse"];

const regionValue = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];

//pk로 줄 값
let accomNum = 0;
let accomImageNum = 0;

let roomNum = 0;
let roomImageNum = 0;

let accomData = "";
let accomImageData = "";

let roomData = "";
let roomImageData = "";

const findDataJson = (recurPath) =>
  fs.readdir(recurPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((item) => {
        if (item.isDirectory()) {
          findDataJson(`${recurPath}/${item.name}`);
        } else if (item.name === "data.json") {
          //제일 처음 이 부분으로 들어오면 숙소의 data.json을 찾은 것
          //item이 data.json
          parseDataJson(`${recurPath}/${item.name}`);
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
  const infoArray = path.split("/");

  const categoryNum = category.indexOf(infoArray[8]) + 1;
  const regionNum = regionValue.indexOf(infoArray[9]) + 1;

  console.log();
  accomData = `(${++accomNum},"${infoArray[9]}","${infoArray[9]}","${data.address}","${data.title}",${data.rating / 10},${data.tel},${0},NULL,NULL,NULL,NULL,${data.lowPrice},${60},${1},${categoryNum},${regionNum}),
  `;
  saveAccomInfo(accomData, infoArray);
  convertToAccomImage(data, path, accomNum);
};

///////////////////////////////////////////////////
//룸 관련 함수

const parseRoomPath = (accomData, accomPathArray) => {
  accomPathArray[12] = "rooms";
  const roomPath = accomPathArray.join("/");

  findRoomDir(accomData, roomPath);
};

const findRoomDir = (accomData, recurRoomPath) =>
  fs.readdir(recurRoomPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((item) => {
        // console.log(item);
        if (item.isDirectory()) {
          findRoomDir(accomData, `${recurRoomPath}/${item.name}`);
        } else if (item.name === "roomData.json") {
          //제일 처음 이 부분으로 들어오면 숙소의 data.json을 찾은 것
          //item이 data.json
          parseRoomDataJson(accomData, `${recurRoomPath}/${item.name}`);
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
    } else {
      const room = JSON.parse(data);
      convertToRoom(accomData, room, path);
    }
  });
};

const convertToRoom = (accomData, room, path) => {
  const infoArray = path.split("/");
  room.basicInfo[0] = room.basicInfo[0].replaceAll("\n", "");

  //여기서부터 하면 됨. 룸 데이터와 룸 이미지만 출력하면 될듯
  console.log();
  roomData = `(${++roomNum},${room.defaultGuest},${room.maxGuest},${roomData.price},"${room.basicInfo}","${room.title}",${0},${0},NULL,NULL,${accomNum}),
  `;
  saveRoomInfo(roomData);
  convertToRoomImage(accomData, path);
};

const convertToRoomImage = (data, path, viewAccomNum) => {
  let infoArray = path.split("/");
  infoArray[14] = "images";
  const roomImagePath = infoArray.join("/");

  findRoomImage(data, roomImagePath, viewAccomNum);
};

const findRoomImage = (data, recurPath, viewAccomNum) => {
  fs.readdir(recurPath, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((imageName) => {
        roomImageData = `(${++roomImageNum}, "${imageName}", "${imageName}", ${roomNum}),
        `;
        saveRoomImage(roomImageData);
      });
    }
  });
};

const saveRoomInfo = (data) => {
  fs.appendFile(`${__dirname}/room.sql`, data, (err) => {
    if (err) throw err;
  });
};

const saveRoomImage = (data) => {
  fs.appendFile(`${__dirname}/imageRoom.sql`, data, (err) => {
    if (err) throw err;
  });
};

//룸 관련 함수
///////////////////////////////////////////////////

const convertToAccomImage = (data, path, viewAccomNum) => {
  let infoArray = path.split("/");
  infoArray[12] = "images";
  const accomImagePath = infoArray.join("/");

  findAccomImage(data, accomImagePath, viewAccomNum);
};

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

const saveAccomInfo = (data, infoArray) => {
  fs.appendFile(`${__dirname}/accom.sql`, data, (err) => {
    if (err) throw err;
    parseRoomPath(data, infoArray);
  });
};

const saveAccomImage = (data) => {
  fs.appendFile(`${__dirname}/imageAccom.sql`, data, (err) => {
    if (err) throw err;
  });
};

category.map((region) => {
  findDataJson(`${filePath}${region}`);
});

module.exports = {
  accomNum,
  accomImageNum,
  roomNum,
  roomImageNum,
  accomData,
  accomImageData,
  roomData,
  roomImageData,
};
