import KitsuApi from '../src';

describe('Mappings', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch mappings with filter', async () => {
    const mappings = kitsuApi.mappings.fetch(
      { externalSite: 'myanimelist/anime' },
      'item'
    );
    const res = await mappings.exec();
    const next = await mappings.next();

    expect(res.data[0].attributes.externalSite).toBe('myanimelist/anime');
    expect(next!.data).toHaveLength(10);
  });
});
