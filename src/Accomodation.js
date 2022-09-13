module.exports = class Accomodation {
  constructor(title, rating, facility, lowPrice, basicInfo, url) {
    this.title = title;
    this.rating = rating[0];
    this.ratingCount = rating[1]; //평가한 인원
    this.facility = facility;
    this.lowPrice = lowPrice;
    this.tel = basicInfo[0];
    this.address = basicInfo[1];
    this.url = url;
  }
};
