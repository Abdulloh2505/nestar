// //  function printNumbers(): void {
// //   let count = 1;

// //   const interval = setInterval(() => {
// //     console.log(count);
// //     count++;

// //     if (count > 5) {
// //       clearInterval(interval);
// //     }
// //   }, 1000);
// // }

// // printNumbers();
// //natija ishlayaptigit 
// //TASK-ZM
// function reverseInteger(num: number): number {
//   let result = 0;

//   while (num > 0) {
//     result = result * 10 + (num % 10);
//     num = Math.floor(num / 10);
//   }

//   return result;
// }

// // test
// console.log(reverseInteger(123456789));
// //TASK-ZL
// function stringToKebab(str: string): string {
//   return str
//     .trim()                 
//     .toLowerCase()        
//     .replace(/\s+/g, "-");
// }


// console.log(stringToKebab("I love Kebab")); 
// // natija: "i-love-kebab"



// ////TASK-ZN
// function rotateArray(arr: number[], index: number): number[] {
//   const firstPart = arr.slice(0, index);
//   const secondPart = arr.slice(index);

//   return secondPart.concat(firstPart);
// }

// // natija
// console.log(rotateArray([1, 2, 3, 4, 5, 6], 3));
// // [5, 6, 1, 2, 3, 4]



// //// TASK-
// function areArraysEqual(a: number[], b: number[]): boolean {
//   for (let i = 0; i < a.length; i++) {
//     if (b.indexOf(a[i]) === -1) return false;
//   }
//   return true;
// }
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2]));    // true
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1])); // true
// console.log(areArraysEqual([1, 2, 3], [4, 1, 2]));    // false

// ///task-ZP
// function groupAnagrams(strs: string[]): string[][] {
//   const map = new Map<string, string[]>();

//   for (const word of strs) {
   
//     const key = word.split('').sort().join('');

//     if (!map.has(key)) {
//       map.set(key, []);
//     }

//     map.get(key)!.push(word);
//   }

//   return Array.from(map.values());
// }
// const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];

// const result = groupAnagrams(strs);

// console.log(result);

// function findDuplicates(arr: number[]): number[] {
//   const counts: { [key: number]: number } = {};
//   const duplicates: number[] = [];

//   for (const num of arr) {
//     counts[num] = (counts[num] || 0) + 1;
//   }

//   for (const num in counts) {
//     if (counts[num] >= 2) {
//       duplicates.push(Number(num));
//     }
//   }

//   return duplicates;
// }

// // natija
// console.log(findDuplicates([1, 2, 3, 4, 5, 4, 3, 4])); // [3, 4]
// console.log(findDuplicates([1, 1, 1, 2, 2, 3])); // [1, 2]
// console.log(findDuplicates([1, 2, 3, 4, 5])); // []
// console.log(findDuplicates([5, 5, 5, 5])); // [5]
// //


//TASK-ZR
function countNumberAndLetters(str: string): { number: number; letter: number } {
  let numberCount = 0;
  let letterCount = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (char >= '0' && char <= '9') {
      numberCount++;
    }
    else if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      letterCount++;
    }
  }

  return { number: numberCount, letter: letterCount };
}

console.log(countNumberAndLetters("string152%¥"));
console.log(countNumberAndLetters("Hello123World456!"));
console.log(countNumberAndLetters("Test2024@#$"));