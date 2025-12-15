export const isPrime = (num: number) => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  // 2부터 num-1까지 나누어 떨어지는 수가 있으면 소수가 아님님
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }

  return true;
};

export const findPrimeNumbers = (max: number) => {
  const primeNumbers: number[] = [];

  if (!Number.isFinite(max) || max < 2) return primeNumbers;

  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) primeNumbers.push(i);
  }

  return primeNumbers;
};
