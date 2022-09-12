let title = "파<티?룸 A *???/ 2인실>>";

(() => {
  title = title.replaceAll(/[\/\:\*\?\"\<\>\|]/gi, "");
  console.log(title);
})();

// 오류 로그
// Windows PowerShell
// Copyright (C) Microsoft Corporation. All rights reserved.

// 새로운 크로스 플랫폼 PowerShell 사용 https://aka.ms/pscore6

// PS C:\Users\ingn\Documents\crawling\final_crawling_component> node AccoDataCrawling
// 룸 시작
// 숙소명: 대구 팔공산 스타탄생 드라이브인
// 객실명: 1실 1주차 A
// 객실명: 1실 1주차 B
// 객실명: 파티룸 A  2인실
// 객실명: 파티룸 B  2인실
// 룸 끝
// 숙소 시작
// 숙소 크롤링 끝
// 룸 시작
// 숙소명: 인천(검단) 3S BOTIQUE HOTEL
// 객실명: 스탠다드 오픈특가
// 객실명: 프리미엄 디럭스 오픈특가
// 객실명: 프리미엄 스위트 오픈특가
// 객실명: 미러 스위트 오픈특가
// 객실명: 스탠다드 OTT룸
// 객실명: 스탠다드 트윈 오픈특가
// 객실명: 디럭스 오픈특가
// 객실명: 무비룸 오픈특가
// 객실명: 스탠다드 롱타임
// 객실명: 트윈 스위트 오픈특가
// 객실명: 디럭스 롱타임
// 객실명: 당일특가
// 객실명: 디럭스 트윈 오픈특가
// 객실명: 프리미엄 스위트 3PC
// 객실명: 스탠다드 게임룸
// 룸 끝
// 숙소 시작
// 숙소 크롤링 끝
// 룸 시작
// 숙소명: 호텔 라트리 의정부
// 객실명: 스탠다드
// TimeoutError: waiting for selector `#__next > div > div > main > article > section.css-1wpv5ik > div.carousel-root > div > div.css-ln49wb` failed: timeout 30000ms exceeded
//     at new WaitTask (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\IsolatedWorld.js:609:34)
//     at IsolatedWorld._waitForSelectorInPage (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\IsolatedWorld.js:504:26)
//     at Object.internalHandler.waitFor (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\QueryHandler.js:34:29)
//     at IsolatedWorld.waitForSelector (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\IsolatedWorld.js:234:36)
//     at Frame.waitForSelector (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\Frame.js:394:78)
//     at Page.waitForSelector (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\Page.js:2307:39)
//     at startDownloadPicture (C:\Users\ingn\Documents\crawling\final_crawling_component\RoomBasicInfo.js:109:30)
//     at Object.roomConnect (C:\Users\ingn\Documents\crawling\final_crawling_component\RoomBasicInfo.js:41:11)
//     at runMicrotasks (<anonymous>)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
// 룸 시작
// 숙소명: 베어스타운
// 객실명:  프리미엄 디럭스 저층
// 객실명:  프리미엄 디럭스 고층
// 객실명:  패밀리 트윈
// 객실명:  패밀리 더블
// 객실명:  디럭스 온돌 저층
// 객실명:  디럭스 온돌 고층
// 객실명:  스탠다드 트윈
// 객실명:  스탠다드 더블
// 객실명:  패밀리 트윈580
// 객실명:  스탠다드 트윈405
// TimeoutError: waiting for selector `#__next > div > div > main > article > section.css-1wpv5ik > div.carousel-root > div > div.css-ln49wb` failed: timeout 30000ms exceeded
//     at new WaitTask (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\IsolatedWorld.js:609:34)
//     at IsolatedWorld._waitForSelectorInPage (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\IsolatedWorld.js:504:26)
//     at Object.internalHandler.waitFor (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\QueryHandler.js:34:29)
//     at IsolatedWorld.waitForSelector (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\IsolatedWorld.js:234:36)
//     at Frame.waitForSelector (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\Frame.js:394:78)
//     at Page.waitForSelector (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\Page.js:2307:39)
//     at startDownloadPicture (C:\Users\ingn\Documents\crawling\final_crawling_component\RoomBasicInfo.js:109:30)
//     at Object.roomConnect (C:\Users\ingn\Documents\crawling\final_crawling_component\RoomBasicInfo.js:41:11)
//     at runMicrotasks (<anonymous>)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
// 룸 시작
// 숙소명: 보령(대천) 너울펜션
// 객실명: B동-카페월풀A
// 객실명: R동 로뎀패밀리
// 객실명: C동 2층독채
// 객실명: A동-NO1
// 객실명: A동-NO2
// 객실명: A동-NO2-1
// 객실명: A동-NO3
// 객실명: A동 -NO4
// 객실명: A동-NO5
// 객실명: A동-NO5-1
// 객실명: A동 No6
// 객실명: A동 No7 독채방3+거실+개별테라스
// 객실명: A동-No8옥탑
// 객실명: B동- NO1
// 객실명: B동-No4-1
// 객실명: B동-No4-2
// 객실명: B- 카페월풀B
// 객실명: B동-카페월풀C
// 객실명: B동-월풀A
// 객실명: B동-월풀B-1
// 객실명: B동-월풀B-2
// 객실명: B동-월풀C-1
// 객실명: B동-월풀C-2
// 객실명: B동-핑크월풀-1
// 객실명: B동-핑크월풀-2
// 객실명: B동-화이트월풀
// 객실명: B동-트윈베드
// 객실명: S동 No1 침대
// 객실명: S동 No2 침대
// 객실명: S동 No3 침대
// 객실명: R동 로뎀커플-1
// 객실명: R동 로뎀커플-2
// 객실명: R동 로뎀커플-3
// 객실명: R동 로뎀 트윈침대
// 객실명: R동 로뎀옥탑투룸
// 룸 끝
// 숙소 시작
// 숙소 크롤링 끝
// 룸 시작
// 숙소명: 보령(대천) 도로시펜션
// 객실명: 102호 에메랄드의성
// 객실명: 203호 나무꾼의심장
// 객실명: 103호 토토의시간
// 객실명: 201호 오즈의길
// 객실명: 202호 캔자스농장
// 객실명: 204호 착한마녀
// 객실명: 301호 사자의 용기
// 객실명: 302호 무지개파티
// 객실명: 303호 노란벽돌
// 객실명: 304호 허수아비의지혜
// 룸 끝
// 숙소 시작
// 숙소 크롤링 끝
// 룸 시작
// 숙소명: 제주 동백바다
// 객실명: 403호
// 객실명: 402호
// 객실명: 401호
// 객실명: 303호
// 객실명: 302호
// 객실명: 301호
// 룸 끝
// 숙소 시작
// Error: Evaluation failed: TypeError: Cannot read properties of null (reading 'textContent')
//     at pptr://__puppeteer_evaluation_script__:1:13
//     at ExecutionContext._ExecutionContext_evaluate (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:271:15)
//     at runMicrotasks (<anonymous>)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async ExecutionContext.evaluate (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:118:16)
//     at async Object.crawlRating (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoBasicInfo.js:23:19)
//     at async startCrawl (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:71:20)
//     at async C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:163:7
// TypeError: Cannot read properties of null (reading 'join')
//     at String.toNumber (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoBasicInfo.js:2:35)
//     at Object.crawlRating (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoBasicInfo.js:30:23)
//     at runMicrotasks (<anonymous>)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async startCrawl (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:71:20)
//     at async C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:163:7
// 룸 시작
// 숙소명: 제주 귤하우스
// 객실명: 23평
// 객실명: 20평
// 객실명: 13평
// 룸 끝
// 숙소 시작
// Error: Evaluation failed: TypeError: Cannot read properties of null (reading 'textContent')
//     at pptr://__puppeteer_evaluation_script__:1:13
//     at ExecutionContext._ExecutionContext_evaluate (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:271:15)
//     at runMicrotasks (<anonymous>)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async ExecutionContext.evaluate (C:\Users\ingn\Documents\crawling\final_crawling_component\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:118:16)
//     at async Object.crawlRating (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoBasicInfo.js:23:19)
//     at async startCrawl (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:71:20)
//     at async C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:163:7
// TypeError: Cannot read properties of null (reading 'join')
//     at String.toNumber (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoBasicInfo.js:2:35)
//     at Object.crawlRating (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoBasicInfo.js:30:23)
//     at runMicrotasks (<anonymous>)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async startCrawl (C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:71:20)
//     at async C:\Users\ingn\Documents\crawling\final_crawling_component\AccoDataCrawling.js:163:7
// PS C:\Users\ingn\Documents\crawling\final_crawling_component>
