String.prototype.toNumber = function () {
  return Number(this.match(/\d/gi).join().replaceAll(",", ""));
};

module.exports = String.prototype.toNumber;

/**
 * 숙소에서 크롤링할 데이터
 *
 * 숙소명
 * 평점
 * 평점인원
 * 인기시설 및 서비스(편의시설)
 * 전화번호
 * 주소
 * 최저가격
 * 이미지
 */

/**
 * 객실에서 크롤링할 데이터
 *
 * 객실명
 * 기본정보(인원수, 금연 등)
 * 기준인원
 * 최대인원
 * 숙박 시작일
 * 숙박 종료일
 * 가격
 * 이미지
 *
 */
