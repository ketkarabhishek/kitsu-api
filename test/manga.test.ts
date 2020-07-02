import KitsuApi from '../src'
describe('Manga', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch manga by id', async () => {
    const res = await kitsuApi.manga.fetchById(1);
    expect(res.data.id).toBe('1');
  });

  test('Fetch manga', async () => {
    const anime = kitsuApi.manga.fetch({filter: {text: 'naruto'}, page: {limit: 5}});
    const res = await anime.exec();
    const next = await anime.next();
    expect(res.data).toHaveLength(5);
    expect(next!.data).toHaveLength(5);
  });
});
