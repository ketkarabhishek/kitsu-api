import KitsuApi from '../src';

describe('Library Entries', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch entries', async () => {
    const res = await kitsuApi.library.fetch({filter: { userId: '123105' }, page: {limit: 5}}).exec();
    expect(res.data).toHaveLength(5)
    expect(res.meta.count).toBeGreaterThanOrEqual(0);
  });

  // test('Fetch entries with authenticated request', async () => {
  //   const auth = await kitsuApi.auth.login("username", "password")
  //   const res = await kitsuApi.library
  //     .fetch({ userId: '123105' }, '-updatedAt', undefined, auth)
  //     .exec();
  //   expect(res.meta.count).toBeGreaterThanOrEqual(0);
  // });

  test('Fetch entries next page', async () => {
    const library = kitsuApi.library.fetch({filter: {
      userId: '123105',
      kind: 'anime',
      status: 'current',
    }});
    const res = await library.exec();
    const nextRes = await library.next();
    expect(res.meta.count).toBeGreaterThanOrEqual(0);
    expect(nextRes!.meta.count).toBeGreaterThanOrEqual(0);
  });

  test('Fetch entries with no next page', async () => {
    const library = kitsuApi.library.fetch({filter: {
      userId: '123105',
      kind: 'anime',
      status: 'on_hold',
    }});
    const res = await library.exec();
    const nextRes = await library.next();
    expect(res.meta.count).toBeGreaterThanOrEqual(0);
    expect(nextRes).toBeUndefined();
  });

  test('Fetch by Id', async () => {
    const res = await kitsuApi.library.fetchById(12846019);
    expect(res.data.id).toBe('12846019');
  });

  // test("Create Library Entry", async () => {
  //     const kitsuApi  = KitsuApi()
  //     const auth = await kitsuApi.auth.login("username", "password")
  //     const create = await kitsuApi.library().create(123105, {
  //         animeId: 41083,
  //         progress: 0,
  //         ratingTwenty: null,
  //         status: 'planned'
  //     }, auth)

  //     expect(create.data).toHaveProperty("id")
  // })

  // test("Update Library Entry", async () => {
  //     const kitsuApi  = KitsuApi()
  //     const auth = await kitsuApi.auth.login("username", "password")
  //     const update = await kitsuApi.library().update({
  //         libraryEntryId: 55409153,
  //         progress: 0,
  //         ratingTwenty: null,
  //         status: 'on_hold'
  //     }, auth)

  //     expect(update.data.id).toBe("55409153")
  // })

  // test("Delete Library Entry", async () => {
  //     const kitsuApi  = KitsuApi()
  //     const auth = await kitsuApi.auth.login("username", "password")
  //     await kitsuApi.library().delete({
  //         libraryEntryId: 55409153,
  //     }, auth)

  // })
});
