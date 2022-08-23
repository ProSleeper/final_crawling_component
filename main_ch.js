const axios = require('axios');
const cheerio = require('cheerio');


const origin = "https://www.yanolja.com/";
const shortCuts = "#__next > div.StyleComponent_container__1jS9A.index_container__3kY3K > section.index_contentWrapper__1a-is > section > section > section.ThemeStoreWidget_container__3kex- > div";
const category = [];

//아래 getHTML하고 getData를 조금만 수정하면 계속해서 타고타고 들어가는 메서드로 사용 가능 할거 같다.
const getHTML = (keyword) => {
    keyword = encodeURI(keyword);
    return axios({
        // 크롤링을 원하는 페이지 URL
        url: keyword,
        method: 'GET',
        responseType: 'arraybuffer',
    })
        // 성공했을 경우
        .then((response) => { return response.data; })
        // 실패했을 경우
        .catch(err => {
            console.error(err);
        });
}

const getData= async(keyword) =>{
    const html = await getHTML(keyword);
    const $ = cheerio.load(html);
    
    const contentList = $(shortCuts);
    const childrens = contentList.children();
    childrens.each((i, elem) => {
        const title = $(elem).attr('href');
        console.log(i + 1, title);
        category.push(title);
    });

}

getData(origin);


//설마 했는데 역시나였다.
//SPA를 크롤링하는 건 거의 안됐었고
//다행히 다른 방법이 있다고 하니 도전해보자.

















//파일로 저장하는 부분 종종 써보자.
// function initDraw() {
//     var fs = require("fs");
//     let data = {};
//     data.items = [];
  
//     fs.appendFile("data.txt", adr, function (err) {
//       if (err) throw err;
//       console.log("complete");
//     });
//   }
  
//   initDraw();




// const getHTML = (keyword)=>{
//     keyword = encodeURI(keyword);
//     try {
//         return axios.get(`https://kin.naver.com/search/list.nhn?query=`+keyword);
//     }catch(err){
//         console.log(err);
//     }
// }

// const getData = async(keyword) =>{
//     const html = await getHTML(keyword);
//     console.log(html);
//     const $ = cheerio.load(html.data);

//     const contentList = $('#container .basic1 li');
//     let titles = [];

//     contentList.each((idx,elem)=>{
//         titles.push($(elem).find('dl dt a').text());
//     });

//     titles.forEach(item => console.log(item));
// }

// getData('원하는 키워드 입력');