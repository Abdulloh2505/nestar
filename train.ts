 function printNumbers(): void {
  let count = 1;

  const interval = setInterval(() => {
    console.log(count);
    count++;

    if (count > 5) {
      clearInterval(interval);
    }
  }, 1000);
}

printNumbers();
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
reverseInteger(123456789); // 987654321
