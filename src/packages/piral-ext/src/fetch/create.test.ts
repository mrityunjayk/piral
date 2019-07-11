import 'url-polyfill';
import 'whatwg-fetch';
import { createFetchApi } from './create';

describe('Create fetch API Module', () => {
  it('works with default options against a JSON API', async () => {
    const { fetch } = createFetchApi({
      base: 'https://jsonplaceholder.typicode.com',
    });
    const result = await fetch('users').then(m => m.body);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(10);
    expect(result[0].name).toBe('Leanne Graham');
  });

  it('has the correct response code', async () => {
    const { fetch } = createFetchApi({
      base: 'https://jsonplaceholder.typicode.com',
    });
    const result = await fetch('users').then(m => m.code);
    expect(result).toBe(200);
  });

  it('works with default options against a non-JSON API', async () => {
    const { fetch } = createFetchApi({
      base: 'https://cdn.animenewsnetwork.com/encyclopedia/',
    });
    const result = await fetch('api.xml?anime=4658').then(m => m.body);
    expect(result.substr(0, 5)).toBe(`<ann>`);
  });
});
