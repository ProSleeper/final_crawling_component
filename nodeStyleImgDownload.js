const fetch = require("node-fetch");
const fs = require("fs");

//NodeJS에서 이미지 URL로 다운받기
(async () => {
  const fetchResponse = await fetch("https://yaimg.yanolja.com/v5/2022/07/25/15/640/62deb1014e2c83.04408022.jpg");
  const myBlob = await fetchResponse.blob();
  const myArrayBuffer = await myBlob.arrayBuffer();
  const myImageArray = Buffer.from(myArrayBuffer);

  fs.appendFile("C:\\image\\asdfaasdff.jpg", myImageArray, () => {});
})();


