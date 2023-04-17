export const intersection = (arrayA: unknown[], arrayB: unknown[]): unknown[] => [
  ...new Set(arrayA.filter((x) => arrayB.includes(x))),
];
