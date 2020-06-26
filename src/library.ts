import { KitsuAuthToken } from './auth';
import QueryString from 'qs';
import Axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from './constants';

/**
 * @interface LibraryFilters
 *
 */
interface LibraryFilters {
  animeId?: string;
  mangaId?: string;
  kind?: 'anime' | 'manga';
  since?: string;
  status?: 'current' | 'completed' | 'planned' | 'dropped' | 'on_hold';
  title?: string;
  userId?: string;
}

interface CreateEntryData {
  animeId: number | string;
  status: 'current' | 'completed' | 'planned' | 'dropped' | 'on_hold';
  progress: number | string;
  ratingTwenty: number | null;
}

interface UpdateEntryData {
  libraryEntryId: number | string;
  status?: 'current' | 'completed' | 'planned' | 'dropped' | 'on_hold';
  progress: number | string;
  ratingTwenty: number | null;
}

interface DeleteEntryData {
  libraryEntryId: number | string;
}

const LIBRARY_URL: string = BASE_URL + '/library-entries';

class FetchLibrary {
  private url: string;
  private nextUrl?: string;

  private axiosOptions: AxiosRequestConfig = {
    method: 'GET',
    headers: {
      'cache-control': 'no-cache',
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  };

  constructor(
    filters?: LibraryFilters,
    sort?: string,
    include?: string,
    auth?: KitsuAuthToken
  ) {
    const filterString: string = QueryString.stringify(
      { filter: filters, sort: sort, include: include },
      { encode: false }
    );

    const url: string = LIBRARY_URL + '?' + filterString;
    this.url = url;
    if (auth) {
      this.axiosOptions.headers.Authorization = 'Bearer ' + auth.access_token;
    }
  }

  /**
   * Executes query and fetches the first page of results.
   */
  public async exec() {
    this.axiosOptions.url = this.url;
    try {
      const res = await Axios(this.axiosOptions);
      this.nextUrl = res.data.links.next || undefined;
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Fetches the next page of results if exists.
   */
  public async next() {
    if (!this.nextUrl) {
      return Promise.resolve(null);
    }
    this.axiosOptions.url = this.nextUrl;
    try {
      const res = await Axios(this.axiosOptions);
      this.nextUrl = res.data.links.next || undefined;
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default class Library {
  /**
   * Fetch library entries.
   * @param filters Filter query results.
   * @param sort Sort by attributes (Prepend '-' to attribute for descending).
   * @param include Include related resources.
   */
  fetch(
    filters?: LibraryFilters,
    sort?: string,
    include?: string,
    auth?: KitsuAuthToken
  ): FetchLibrary {
    return new FetchLibrary(filters, sort, include, auth);
  }

  /**
   * Fetches a library entry by its id.
   * @param id Id of the library entry.
   */
  async fetchById(
    libraryEntryId: number | string,
    auth?: KitsuAuthToken
  ): Promise<any> {
    const options: AxiosRequestConfig = {
      url: LIBRARY_URL + '/' + libraryEntryId,
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    };
    if (auth) {
      options.headers.Authorization = 'Bearer ' + auth.access_token;
    }

    try {
      const res = await Axios(options);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Create a library entry.
   * @param userId Kitsu user id.
   * @param data Data for the new library entry.
   * @param auth Kitsu auth token.
   */
  async create(
    userId: number | string,
    data: CreateEntryData,
    auth: KitsuAuthToken
  ): Promise<any> {
    const body = {
      data: {
        type: 'libraryEntries',
        attributes: {
          status: data.status,
          progress: data.progress,
          ratingTwenty: data.ratingTwenty,
        },
        relationships: {
          user: {
            data: {
              id: userId,
              type: 'users',
            },
          },
          media: {
            data: {
              id: data.animeId,
              type: 'anime',
            },
          },
        },
      },
    };

    const options: AxiosRequestConfig = {
      url: LIBRARY_URL,
      method: 'POST',
      headers: {
        'cache-control': 'no-cache',
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: 'Bearer ' + auth.access_token,
      },
      data: JSON.stringify(body),
    };

    try {
      const res = await Axios(options);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Update an existing library entry.
   * @param data Data for updating library entry.
   * @param auth Kitsu auth token.
   */
  async update(data: UpdateEntryData, auth: KitsuAuthToken): Promise<any> {
    const body = {
      data: {
        type: 'libraryEntries',
        id: data.libraryEntryId,
        attributes: {
          status: data.status,
          progress: data.progress,
          ratingTwenty: data.ratingTwenty,
        },
      },
    };

    const options: AxiosRequestConfig = {
      url: LIBRARY_URL + '/' + data.libraryEntryId,
      method: 'PATCH',
      headers: {
        'cache-control': 'no-cache',
        Authorization: 'Bearer ' + auth.access_token,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      data: JSON.stringify(body),
    };

    try {
      const res = await Axios(options);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Delete a library entry.
   * @param data Data for deleting library entry.
   * @param auth Kitsu auth token.
   */
  async delete(data: DeleteEntryData, auth: KitsuAuthToken): Promise<any> {
    const options: AxiosRequestConfig = {
      url: LIBRARY_URL + '/' + data.libraryEntryId,
      method: 'DELETE',
      headers: {
        'cache-control': 'no-cache',
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'application/vnd.api+json',
      },
    };

    try {
      const res = await Axios(options);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
