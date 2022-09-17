module.exports = class Room {
  constructor(title, basicInfo, roomRules, price) {
    this.title        = title;
    this.basicInfo    = basicInfo;
    this.defaultGuest = roomRules[0][0];
    this.maxGuest     = roomRules[0][1];
    this.checkIn      = roomRules[1];
    this.checkOut     = roomRules[2];
    this.price        = price;
  }
};
