# Kitsu Api
A Javasctipt / Typescript api wrapper for [Kitsu](https://kitsu.io/) .

![Build](https://github.com/ketkar203040/kitsu-api/workflows/Build/badge.svg?branch=develop)
[![GitHub](https://img.shields.io/github/license/ketkar203040/kitsu-api)]()
[![npm](https://img.shields.io/npm/v/kitsu-api-wrapper)](https://www.npmjs.com/package/kitsu-api-wrapper)

Visit [Kitsu API Docs](https://kitsu.docs.apiary.io/) for all available resources with their attributes & relationships.

## Install
    // npm
    $ npm i kitsu-api-wrapper 

    // yarn
    $ yarn add kitsu-api-wrapper 

## Available Api Endpoints
- Auth
- Anime
- Library entries
- Users
- Categories
- Mappings

## Features
- Use `filter` to query data.
- Use `include` to fetch related resources.
- Sort data by attributes in ascending or descending order.
- Pagination.


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
