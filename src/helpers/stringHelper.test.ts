import { capitalize, getTextSummaryFromHtml } from './stringHelper';

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

describe('getTextSummaryFromHtml', () => {
  it('should strip the html tags and collapse the whitespaces', () => {
    expect(getTextSummaryFromHtml('<p>Hello  <strong>world</strong></p>\n<p>!</p>', 100)).toBe('Hello world !');
  });

  it('should cut on a word boundary and add an ellipsis', () => {
    expect(getTextSummaryFromHtml('<p>Lorem ipsum dolor sit amet</p>', 15)).toBe('Lorem ipsum…');
  });

  it('should return an empty string when there is no text', () => {
    expect(getTextSummaryFromHtml('<img src="foo.png" />', 100)).toBe('');
  });
});
