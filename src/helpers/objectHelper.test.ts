import { intersection } from './objectHelper';

describe('intersection', () => {
  it('should return an empty array when given empty arrays', () => {
    expect(intersection([], [])).toEqual([]);
  });

  it('should return the intersection of two arrays', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    expect(intersection(['a', 'b'], ['b', 'c'])).toEqual(['b']);
  });

  it('should handle arrays with duplicate values', () => {
    expect(intersection([1, 1, 2], [1, 2])).toEqual([1, 2]);
    expect(intersection(['a', 'b', 'b'], ['b', 'c'])).toEqual(['b']);
  });
});
