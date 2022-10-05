const fs = require("fs");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";
const filePath = "D:\\카테고리별 숙소";
let facility = new Map();

fs.readdir(filePath, (err, files) => {
  files.forEach((item) => {
    // console.log(`${filePath}\\item\\data.json`);
    // convertJson(`${filePath}\\${item}\\roomData.json`);
    fs.readdir(`${filePath}\\${item}`, (err, category) => {
      category.map((innerItem) => {
        convertJson(`${filePath}\\${item}\\${innerItem}\\data.json`);
      });
    });
  });
});

const convertJson = (path) => {
  //console.log(path);
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    //console.log(data);
    const acco = JSON.parse(data);
    //console.log(acco.facility);
    acco.facility.map((item) => {
      // facility[item] = null;
      facility.set(item, 0);
    });
    facility.keys;
    //console.log(facility);
    console.log(facility);

    let fac = [];
    for (let key of facility.keys()) {
      fac.push(key);
    }
    fs.writeFile(`${__dirname}\\facData.sql`, JSON.stringify(fac), (err) => {
      if (err) throw err;
    });
    //const acco = JSON.parse(data);
    //console.log(acco);
  });
};
