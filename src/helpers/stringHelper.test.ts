import { capitalize } from './stringHelper';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
    expect(capitalize('foo bar')).toBe('Foo bar');
  });

  it('should return an empty string if the input is empty', () => {
    expect(capitalize('')).toBe('');
  });
});
