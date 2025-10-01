function sum_to_n_a(n: number): number {
  if (!Number.isInteger(n)) {
    throw new Error("n must be an integer");
  }

  if (n < 0) {
    throw new Error("n must be greater than or equal to 0");
  }

  // Method 1: Mathematical Formula (O(1) complexity)
  return (n * (n + 1)) / 2;
}

function sum_to_n_b(n: number): number {
  if (!Number.isInteger(n)) {
    throw new Error("n must be an integer");
  }

  if (n < 0) {
    throw new Error("n must be greater than or equal to 0");
  }

  // Method 2: Iterative Approach (O(n) complexity)
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}

function sum_to_n_c(n: number): number {
  if (!Number.isInteger(n)) {
    throw new Error("n must be an integer");
  }

  if (n < 0) {
    throw new Error("n must be greater than or equal to 0");
  }

  if (n === 0) {
    // Base case for recursion
    return 0;
  }

  // Method 3: Recursive Approach (O(n) complexity)
  return n + sum_to_n_c(n - 1);
}

console.log(sum_to_n_a(5)); // 15
console.log(sum_to_n_b(5)); // 15
console.log(sum_to_n_c(5)); // 15
