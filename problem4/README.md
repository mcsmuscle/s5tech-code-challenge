# Problem 4: Three ways to sum to n
Three different solutions to the problem of calculating the sum of all integers from 1 to a given number `n`.

### Problem

Given a non-negative integer `n`, write a function that returns the sum of all integers from 1 to `n`.

### Solutions

The `solution.ts` file provides three different implementations for this problem:

1.  **`sum_to_n_a(n: number): number`**
    *   **Method:** This function uses the mathematical formula for the sum of an arithmetic series: `sum = n * (n + 1) / 2`.
    *   **Time Complexity:** O(1) - This is the most efficient solution as it calculates the sum in a single operation, regardless of the value of `n`.

2.  **`sum_to_n_b(n: number): number`**
    *   **Method:** This function uses an iterative approach, looping from 1 to `n` and adding each number to a running total.
    *   **Time Complexity:** O(n) - The time taken to execute this function is directly proportional to the value of `n`.

3.  **`sum_to_n_c(n: number): number`**
    *   **Method:** This function uses a recursive approach. It calls itself with a decremented value of `n` until it reaches the base case (`n = 0`).
    *   **Time Complexity:** O(n) - Similar to the iterative approach, the number of recursive calls is proportional to `n`. This can also lead to a stack overflow for very large values of `n`.

### How to Run

To run the code and see the output for the example case (`n=5`), you can use `ts-node`:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' solution.ts
```

This will execute the `console.log` statements at the end of the file, demonstrating that all three functions produce the same result (15 for an input of 5).
