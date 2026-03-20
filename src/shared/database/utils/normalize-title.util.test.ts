import { normalizeTitle } from './normalize-title.util';

describe('normalizeTitle', () => {
  it('normalizes provided value', () => {
    expect(normalizeTitle('Lorem')).toEqual('lorem');
  });
});
