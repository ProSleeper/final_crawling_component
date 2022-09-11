/* NodeJS를 설치 후 실행해야 실행된다. */

//드림코딩 미니미 쇼핑몰 만들기에서 사용할 json 데이터 만들기
//이 함수의 내용이 약간 길지만 크게 3개로 나눠진다.
//1. 데이터부분 2. 랜덤데이터 추출해서 저장 3. 파일로 출력
function initDraw() {
  console.log(99 % 100000);
  setTimeout(() => {
    console.log("complete");
  }, 3000);
  for (let index = 0; index < 10000000000; index++) {
    if (index % 100000000 == 0) {
      console.log("반복" + index);
    }
  }
}

initDraw();
