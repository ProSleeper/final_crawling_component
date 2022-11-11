function solution(ingredient) {
  var answer = 0;
  const ORIGIN_SIZE = ingredient.length;
  const HAMBERGER = "1231";
  let strIngredient = ingredient.join("");
  let prevStrIngredient = "";


  ingredient.reduce((a, b, index) => {
    const text = (a + "" + b);
    if (text.indexOf(HAMBERGER) !== -1) {
      text.replace()
    }

  })


  const RESULT_SIZE = strIngredient.length;

  answer = (ORIGIN_SIZE - RESULT_SIZE) / 4;

  return answer;
}

solution([2, 1, 1, 2, 3, 1, 2, 3, 1]);
// solution([1, 3, 2, 1, 2, 1, 3, 1, 2]);
