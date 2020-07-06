# Kitsu Api
A Javasctipt / Typescript api wrapper for [Kitsu](https://kitsu.io/) .

![Build](https://github.com/ketkar203040/kitsu-api/workflows/Build/badge.svg?branch=develop)
[![GitHub](https://img.shields.io/github/license/ketkar203040/kitsu-api)]()
[![npm](https://img.shields.io/npm/v/kitsu-api-wrapper)](https://www.npmjs.com/package/kitsu-api-wrapper)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Visit [Kitsu API Docs](https://kitsu.docs.apiary.io/) for all available resources with their attributes & relationships.

## Install
    // npm
    $ npm i kitsu-api-wrapper 

    // yarn
    $ yarn add kitsu-api-wrapper 

## Available Api Endpoints
- Auth
- Anime
- Manga
- Library
- Users
- Categories
- Mappings

## Features
- Use `filter` to query data.
- Use `include` to fetch related resources.
- Sort data by attributes in ascending or descending order.
- Pagination limit and offset.

## Getting Started
    // ES Modules
    import KitsuApi from 'kitsu-api-wrapper'

    // CommonJS
    const KitsuApi = require('kitsu-api-wrapper').default

## Examples

### Auth
    const kitsuApi = new KitsuApi();
    const authToken = await kitsuApi.auth.login('username', 'password');

### Fetch Resources
    const kitsuApi = new KitsuApi();

    // Anime
    const animeQuery = kitsuApi.anime.fetch({filter: {text: 'naruto'}, page: {limit: 5}, include: 'categories', sort: '-updatedAt'});

    // Execute query and get first page of results.
    const res = await animeQuery.exec();

    // Get next page
    const nextPage2 = await animeQuery.next();
    const nextPage3 = await animeQuery.next();

    // Anime by id
    const res = await kitsuApi.anime.fetchById(1);

> `next()` will return `undefined` after it reaches the last page.

Fetching other resources is similar to the above example.

For example replace `kitsu.anime` with `kitsu.manga` for manga.

### Library (Create, Update and Delete)
These requests require authentication token. 

    const kitsuApi = new KitsuApi();

    // Create
    const create = await kitsuApi.library.create(userId, {
        animeId: 1,
        status: 'current',
        progress: 5,
        ratingTwenty: 12
    }, auth)

    // Update
    const update = await kitsuApi.library.update({
        libraryEntryId: 4357345,
        progress: 8,
        ratingTwenty: 12,
        status: 'on_hold'
    }, auth)

    // Delete
    await kitsuApi.library.delete({
        libraryEntryId: 4357345,
    }, auth)

> `auth` is the object returned from the `login` function or an object containing property `access_token` with a valid token.

### Users

    const kitsuApi = new KitsuApi();

    // Fetch users by Id
    const user = await kitsuApi.users.fetchById(344647);

    // Fetch users by Slug
    const user = await kitsuApi.users.fetchBySlug('akai34');

    // Fetch current logged in user (Fetch self)
    const user = await kitsuApi.users.fetchSelf(auth);

    // Search User
    const userQuery = kitsuApi.users.fetch('myuser');

    const users = await userQuery.exec(); // First page.

    const nextUsers = await userQuey.next() // Next page



---
This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).


### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
