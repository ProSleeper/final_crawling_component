const fs = require("fs");

const amenities = ["무료영화(OTT)", "파티룸", "와이파이", "파티가능", "객실금연", "공용주방", "공용거실", "도미토리", "커플룸", "트윈베드", "야외수영장", "객실내PC", "VOD", "고사양PC", "공기청정기", "야외테라스", "거울룸", "커플PC", "개별바베큐", "복층구조", "이벤트가능"];

const ROOM_SIZE = 665;
const EXCLUDE_ROOM_NUMBER = [490, 491, 494, 495, 544, 545, 546, 547, 548];
let ROOMViewamenitiesNum = 0;

//객실의 정보를 sql문으로 출력되도록 바꾼다.
const createROOMViewamenitiesData = (saveData) => {
  const INSERT_QUERY_STRING = "INSERT INTO `room_view_amenities` (`room_view_amenities_num`,`amenities_num`, `room_num`)VALUES\n";
  saveData(INSERT_QUERY_STRING);
  let myamenities;

  for (let ROOMNum = 1; ROOMNum <= ROOM_SIZE; ROOMNum++) {
    if (EXCLUDE_ROOM_NUMBER.indexOf(ROOMNum) !== -1 ) {
      continue;
    }
    saveData(mappedamenities(myamenities, ROOMNum));
  }
};

const saveROOMViewamenitiesData = (data) => {
  fs.appendFileSync(`${__dirname}/ROOMViewamenities.sql`, data, (err) => {
    if (err) throw err;
  });
};

const checkDuplicateamenities = (array, inputNum) => {
  return array.indexOf(inputNum) === -1 ? false : true;
};

const randamenitiesNum = () => {
  return Math.floor(Math.random() * amenities.length + 1);
};

const randFromThreeToEight = () => {
  return Math.floor(Math.random() * 5 + 3);
};
function mappedamenities(myamenities, ROOMNum) {
  let roomData = "";
  myamenities = [];
  const numOfamenities = randFromThreeToEight();
  for (let j = 0; j < numOfamenities; j++) {
    const amenNum = randamenitiesNum();
    if (checkDuplicateamenities(myamenities, amenNum)) {
      j--;
      continue;
    }
    myamenities.push(amenNum);
    roomData += `(${++ROOMViewamenitiesNum},${amenNum},${ROOMNum}),
    `;
  }
  return roomData;
}

createROOMViewamenitiesData(saveROOMViewamenitiesData);
