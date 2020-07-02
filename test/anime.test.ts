import KitsuApi from '../src'
describe('Anime', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch anime by id', async () => {
    const res = await kitsuApi.anime.fetchById(1);
    expect(res.data.id).toBe('1');
  });

  test('Fetch anime', async () => {
    const anime = kitsuApi.anime.fetch({filter: {text: 'uzumaki'}, page: {limit: 5}});
    const res = await anime.exec();
    const next = await anime.next();
    expect(res.data).toHaveLength(5);
    expect(next!.data).toHaveLength(5);
  });
});
