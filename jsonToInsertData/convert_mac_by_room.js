const fs = require("fs");

//pk로 줄 값
let accomNum = 0;
let accomImageNum = 0;
let accomData = "";
let accomImageData = "";

//룸 정보 추출 시 사용할 값
let roomNum = 0;
let roomImageNum = 0;
let roomData = "";
let roomImageData = "";

//파일을 저장해둔 기본 경로
const filePath = "/Users/kyw/Documents/projects/final_crawling_component/src/saveData/";

//숙소 카테고리 4개를 체크할 배열
const category = ["motel", "hotel", "pension", "guestHouse"];

//지역 대도시 분류 배열
const regionValue = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];

//룸 정보와 경로를 이용해서 객실 폴더를 찾는다.
const parseRoomPath = (accomData, accomPathArray, inAccomNum) => {
  accomPathArray[12] = "rooms";
  const roomPath = accomPathArray.join("/");

  findRoomDir(accomData, roomPath, inAccomNum);
};

//숙소폴더 하위에 있는 객식 폴더의 데이터를 가져온다.
const findRoomDir = (accomData, recurRoomPath, inAccomNum) =>
  fs.readdir(recurRoomPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((item) => {
        // console.log(item);
        if (item.isDirectory()) {
          findRoomDir(accomData, `${recurRoomPath}/${item.name}`, inAccomNum);
        } else if (item.name === "roomData.json") {
          //제일 처음 이 부분으로 들어오면 숙소의 data.json을 찾은 것
          //item이 data.json
          parseRoomDataJson(accomData, `${recurRoomPath}/${item.name}`, inAccomNum);
        }
      });
    }
  });

//roomData.json파일을 읽어서 객체로 만드나.
const parseRoomDataJson = (accomData, path, inAccomNum) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    } else {
      const room = JSON.parse(data);
      convertToRoom(accomData, room, path, inAccomNum);
    }
  });
};

//객실의 정보를 sql문으로 출력되도록 바꾼다.
const convertToRoom = (accomData, room, path, inAccomNum) => {
  room.basicInfo[0] = room.basicInfo[0].replaceAll("\n", "");

  roomData = `(${++roomNum},${room.defaultGuest},${room.maxGuest},${room.price},"${room.basicInfo}","${room.title}",${0},${0},NULL,NULL,${inAccomNum}),
  `;
  saveRoomInfo(roomData);
  convertToRoomImage(accomData, path, roomNum);
};

//객실의 이미지 경로를 찾는다.
const convertToRoomImage = (data, path, roomNum) => {
  let infoArray = path.split("/");
  infoArray[14] = "images";
  const roomImagePath = infoArray.join("/");

  findRoomImage(data, roomImagePath, roomNum);
};

//객식을 순회하면서 해당 객실의 이미지를 읽어온다.
const findRoomImage = (data, recurPath, roomNum) => {
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

//읽어온 데이터를 파일로 저장한다.
const saveRoomInfo = (data) => {
  fs.appendFile(`${__dirname}/room.sql`, data, (err) => {
    if (err) throw err;
  });
};

//찾은 객실의 상세 사진 저장
const saveRoomImage = (data) => {
  fs.appendFile(`${__dirname}/imageRoom.sql`, data, (err) => {
    if (err) throw err;
  });
};

//순환참조를 막기 위해서 하ㄴ
module.exports = {
  //함수
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
};
