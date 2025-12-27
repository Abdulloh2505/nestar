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