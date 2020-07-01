import KitsuApi from '../src';
import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';

describe('Users', () => {
  const kitsuApi = new KitsuApi();
  test('Fetch users by slug.', async () => {
    const user = await kitsuApi.users.fetchBySlug('akai34');
    expect(user.id).toBe('123105');
  });

  test('Fetch users by Id.', async () => {
    const user = await kitsuApi.users.fetchById(123105);
    expect(user.id).toBe('123105');
  });

  test('Fetch current logged in user', async () => {
    const auth = {
      access_token: '2353645765686545542',
      refresh_token: '43668634231353465',
      token_type: 'Bearer',
      expires_in: 3453465745,
      scope: 'public',
      created_at: 34657468454,
    };

    const mock = new MockAdapter(Axios);
    mock
      .onGet('https://kitsu.io/api/edge/users?filter[self]=true')
      .reply(config => {
        expect(config.headers.Authorization).toBe('Bearer 2353645765686545542');

        return [
          200,
          {
            data: [{ id: '123105', attributes: {email: 'efwrg'} }],
          },
        ];
      });
    const user = await kitsuApi.users.fetchSelf(auth);
    expect(user.id).toBe('123105');
  });
});
