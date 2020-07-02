import KitsuApi from '../src';

describe('Categories', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch Categories', async () => {
    const categories = kitsuApi.categories.fetch({page: {limit: 5}});
    const res = await categories.exec();
    const next = await categories.next();
    expect(res.meta.count).toBeGreaterThan(0)
    expect(res.data).toHaveLength(5)
    expect(next!.data).toHaveLength(5)
  });

  test('Fetch Category by Id', async () => {
    const res = await kitsuApi.categories.fetchById(1);

    expect(res.data.id).toBe('1');
  });
});
