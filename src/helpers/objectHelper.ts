export const intersection = (
  arrayA: unknown[] | readonly unknown[],
  arrayB: unknown[] | readonly unknown[]
): unknown[] => [...new Set(arrayA.filter((x) => arrayB.includes(x)))];
