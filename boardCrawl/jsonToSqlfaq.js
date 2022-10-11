const fs = require("fs");
const { makeFolder } = require("../src/accoCrawl/CommonMethod");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";
// const filePath = "D:\\카테고리별 숙소\\guesthouse";

const readFolder = `${__dirname}\\faq`;
const writeFolder = `${__dirname}\\faqSql`;

const arrStr = [["account", 11], ["discount", 8], ["payment", 6], ["point", 9], ["product", 5], ["refund", 7], ["review", 10]];

arrStr.forEach((mkName) => {
  fs.readdir(`${readFolder}\\${mkName[0]}`, (err, files) => {
    files.forEach((item) => {
      fs.readFile(`${readFolder}\\${mkName[0]}\\${item}`, "utf8", (err, data) => {
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

    testData.content = testData.content.replaceAll(/\"/gi, "'");
    let sqlObject = `(${mkName[1]}, "${testData.title}", "${testData.content}", NOW() ),\n`;

    console.log(testData.title);

    // testData.title = testData.title.replaceAll(/[\/\:\*\?\"\<\>\|\\]/gi, "");
    testData.title = testData.title.replaceAll(/[\n\t\/\:\*\?\"\<\>\|]/gi, "");
    



    makeFolder(`${writeFolder}\\${mkName[0]}`);

    fs.appendFile(`${writeFolder}\\${mkName[0]}\\inputData.sql`, sqlObject, (err) => {
      try {
        if (err) throw err;
      } catch (error) {
        console.log(error);
      }
    });
  };
});
