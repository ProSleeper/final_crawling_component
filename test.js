


for (let index = 0; index < 161; index++) {
  for (let j = 0; j < 3; j++) {
    const number = Math.floor(Math.random() * 160 + 1)
    console.log(`(${index + 1}, "image${number}.jpg", "image${number}.jpg")`);
    
  }
  
}

// console.log(`(${index + 1}, "image${index}.jpg", "image${index}.jpg")`);