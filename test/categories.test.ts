import KitsuApi from '../src';

describe('Categories', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch Categories', async () => {
    const categories = kitsuApi.categories.fetch();
    await categories.exec();
    const next = await categories.next();
    // expect(res.meta.count).toBe(217)
    expect(next.meta.count).toBe(217);
  });

  test('Fetch Category by Id', async () => {
    const res = await kitsuApi.categories.fetchById(1);

    expect(res.data.id).toBe('1');
  });
});
