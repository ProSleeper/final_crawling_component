const fs = require("fs");

// const filePath = "D:\\카테고리별 숙소\\motel\\역삼 컬리넌\\data.json";
// const filePath = "D:\\카테고리별 숙소\\guesthouse";

const readFolder = `${__dirname}\\notice`;
const writeFolder = `${__dirname}\\noticeSql`;

fs.readdir(readFolder, (err, files) => {
  console.log(files.length);
  files.forEach((item) => {
    fs.readFile(readFolder + "\\" + item, "utf8", (err, data) => {

      if (err) {
        console.error(err);
      } else {
        //console.log(typeof item);
        convertJson(data);
      }
    });
    
    // console.log(`${filePath}\\item\\data.json`);
    
  });
});

//공지 1

const convertJson = (item) => {

  const testData = JSON.parse(item);
  // //console.log(testData.title);

  //const jsonItem = JSON.stringify(item);
  let sqlObject = "INSERT INTO `T_BOARD` (`boardCategoryNum`,`boardTitle`,`boardContent`, `boardCreate`) VALUES ";

  sqlObject = `( 1, "${testData.title}", "${testData.content}", "${testData.date}" )`;

  console.log(testData.title);

  // testData.title = testData.title.replaceAll(/[\/\:\*\?\"\<\>\|\\]/gi, "");
  testData.title = testData.title.replaceAll(/[\n\t\/\:\*\?\"\<\>\|]/gi, "");

  sqlObject += ",";

  fs.appendFile(`${writeFolder}\\inputData.sql`, sqlObject, (err) => {
    try {
      if (err) throw err;
    } catch (error) {
      console.log(error);
    }
    
  });
};





