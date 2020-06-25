import KitsuApi from '../src';

describe('Anime', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch anime by id', async () => {
    const res = await kitsuApi.anime.fetchById(1);
    expect(res.data.id).toBe('1');
  });

  test('Fetch anime', async () => {
    const anime = kitsuApi.anime.fetch();
    const res = await anime.exec();
    const next = await anime.next();
    expect(res.data).toHaveLength(10);
    expect(next.data).toHaveLength(10);
  });
});
