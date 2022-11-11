const fs = require("fs");

const facility = ["주차가능", "바다전망", "조식운영뷔페", "해수욕장 인근", "유료세탁", "수화물보관", "PC라운지", "피트니스", "비즈니스", "루프탑", "흡연구역", "부티크 브랜드", "레스토랑", "24시간 데스크", "커피숍", "스파/월풀/욕조", "식사가능", "노래방", "게임", "수영장", "바베큐", "매점/편의점", "독채객실", "기본양념", "풀빌라"];

const ACCOM_SIZE = 78;
const EXCLUDE_NUMBER = [49, 55];
let accomViewFacilityNum = 0;

//객실의 정보를 sql문으로 출력되도록 바꾼다.
const createAccomViewFacilityData = (saveData) => {
  const INSERT_QUERY_STRING = "INSERT INTO `accom_view_facilities` (`accom_viewfacilities_num`, `accom_num`, `facilities_num`)VALUES\n";
  saveData(INSERT_QUERY_STRING);
  let myFacility;

  for (let accomNum = 1; accomNum <= ACCOM_SIZE; accomNum++) {
    if (EXCLUDE_NUMBER[0] === accomNum || EXCLUDE_NUMBER[1] === accomNum) {
      continue;
    }

    saveData(mappedFacility(myFacility, accomNum));
  }
};

const saveAccomViewFacilityData = (data) => {
  fs.appendFileSync(`${__dirname}/accomViewFacility.sql`, data, (err) => {
    if (err) throw err;
  });
};

const checkDuplicateFacility = (array, inputNum) => {
  return array.indexOf(inputNum) === -1 ? false : true;
};

const randFacilityNum = () => {
  return Math.floor(Math.random() * facility.length + 1);
};

const randFromThreeToEight = () => {
  return Math.floor(Math.random() * 5 + 3);
};
function mappedFacility(myFacility, accomNum) {
  let roomData = "";
  myFacility = [];
  const numOfFacility = randFromThreeToEight();
  for (let j = 0; j < numOfFacility; j++) {
    const facilNum = randFacilityNum();
    if (checkDuplicateFacility(myFacility, facilNum)) {
      j--;
      continue;
    }
    myFacility.push(facilNum);
    roomData += `(${++accomViewFacilityNum},${accomNum},${facilNum}),
    `;
  }
  return roomData;
}

createAccomViewFacilityData(saveAccomViewFacilityData);
