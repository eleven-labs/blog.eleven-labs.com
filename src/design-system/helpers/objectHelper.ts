export const get = <TObject extends Record<string, unknown>, TValue = unknown, TDefaultValue = unknown>(
  object: TObject,
  path: string,
  defaultValue?: TDefaultValue
): TValue => {
  const travel = (regexp: RegExp): TObject =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce<TObject>(
        (currentResult, key) =>
          currentResult !== null && currentResult !== undefined ? (currentResult[key] as TObject) : currentResult,
        object
      );
  const result = travel(/[,[\]]+?/) || travel(/[,.[\]]+?/);
  return (result === undefined || result === object ? defaultValue : result) as TValue;
};
