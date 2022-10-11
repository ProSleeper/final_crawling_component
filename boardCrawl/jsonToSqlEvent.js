const fs = require("fs");
const { makeFolder } = require("../src/accoCrawl/CommonMethod");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";
// const filePath = "D:\\카테고리별 숙소\\guesthouse";

const readFolder = `${__dirname}\\event`;
const writeFolder = `${__dirname}\\eventSql`;

const arrStr = ["account", "discount", "payment", "point", "product", "refund", "review"];

arrStr.forEach((mkName) => {
  fs.readdir(`${readFolder}\\${mkName}`, (err, files) => {
    files.forEach((item) => {
      fs.readFile(`${readFolder}\\${mkName}\\${item}`, "utf8", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          //console.log(data);
          convertJson(data);
        }
      });

      // console.log(`${filePath}\\item\\data.json`);
    });
  });

  //공지 1

  const convertJson = (item) => {
    const testData = JSON.parse(item);
    //console.log(testData.title);

    //const jsonItem = JSON.stringify(item);
    // let sqlObject = "INSERT INTO `T_BOARD` (`boardCategoryNum`,`boardTitle`,`boardContent`, `boardCreate`) VALUES ";

    let sqlObject = `(3, "${testData.title}", "${testData.content}" )`;

    console.log(testData.title);

    // testData.title = testData.title.replaceAll(/[\/\:\*\?\"\<\>\|\\]/gi, "");
    testData.title = testData.title.replaceAll(/[\n\t\/\:\*\?\"\<\>\|]/gi, "");

    sqlObject += ",";
    makeFolder(`${writeFolder}\\${mkName}`);

    fs.appendFile(`${writeFolder}\\${mkName}\\inputData.sql`, sqlObject, (err) => {
      try {
        if (err) throw err;
      } catch (error) {
        console.log(error);
      }
    });
  };
});
