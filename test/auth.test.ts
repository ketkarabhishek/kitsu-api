import KitsuApi from '../src';
import { CLIENTID, CLIENTSECRET } from '../src/auth';
import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';

describe('Kitsu Auth', () => {
  const mock = new MockAdapter(Axios);
  const kitsuApi = new KitsuApi();
  mock.onPost('https://kitsu.io/api/oauth/token').reply(config => {
    expect(JSON.parse(config.data)).toEqual({
      grant_type: 'password',
      client_id: CLIENTID,
      client_secret: CLIENTSECRET,
      username: 'username',
      password: 'password',
    });
    return [
      200,
      {
        access_token: '2353645765686545542',
        refresh_token: '43668634231353465',
        token_type: 'Bearer',
        expires_in: 3453465745,
        scope: 'public',
        created_at: 34657468454,
      },
    ];
  });
  it('Login', async () => {
    const auth = await kitsuApi.auth.login('username', 'password');
    expect(auth).toHaveProperty('access_token');
    expect(auth).toHaveProperty('refresh_token');
  });
});
