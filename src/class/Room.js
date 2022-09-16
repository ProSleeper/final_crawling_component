module.exports = class Room {
  constructor(title, basicInfo, roomRules, price) {
    this.title = title;
    this.basicInfo = basicInfo;
    const arrRules = roomRules[0].match(/\d/gi);
    this.defaultGuest = arrRules[0];
    this.maxGuest = arrRules[1];
    this.checkIn = roomRules[1];
    this.checkOut = roomRules[2];
    this.price = price;
  }
};
