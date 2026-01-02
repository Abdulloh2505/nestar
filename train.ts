//  function printNumbers(): void {
//   let count = 1;

//   const interval = setInterval(() => {
//     console.log(count);
//     count++;

//     if (count > 5) {
//       clearInterval(interval);
//     }
//   }, 1000);
// }

// printNumbers();
//natija ishlayaptigit 
//TASK-ZM
function reverseInteger(num: number): number {
  let result = 0;

  while (num > 0) {
    result = result * 10 + (num % 10);
    num = Math.floor(num / 10);
  }

  return result;
}

// test
console.log(reverseInteger(123456789));
//TASK-ZL
function stringToKebab(str: string): string {
  return str
    .trim()                 
    .toLowerCase()        
    .replace(/\s+/g, "-");
}


console.log(stringToKebab("I love Kebab")); 
// natija: "i-love-kebab"



////TASK-ZN
function rotateArray(arr: number[], index: number): number[] {
  const firstPart = arr.slice(0, index);
  const secondPart = arr.slice(index);

  return secondPart.concat(firstPart);
}

// natija
console.log(rotateArray([1, 2, 3, 4, 5, 6], 3));
// [5, 6, 1, 2, 3, 4]
