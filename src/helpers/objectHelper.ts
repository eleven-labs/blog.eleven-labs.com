export const intersection = (arrayA: unknown[], arrayB: unknown[]): unknown[] =>
  arrayA.filter((x) => arrayB.includes(x));

export const pick = <T extends object, U extends keyof T>(object: T, keys: U[]): Pick<T, U> =>
  keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as T);
