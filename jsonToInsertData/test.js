const fs = require("fs");
const path = require("path");

const getAllFiles = (dir) =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

const filearray = getAllFiles(
  "C:\\Users\\ingn\\Documents\\crawling\\final_crawling_component\\src\\saveData\\guestHouse"
);
console.log(filearray);
