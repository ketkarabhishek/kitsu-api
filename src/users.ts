import { BASE_URL, ApiResponse } from './constants';
import QueryString from 'qs';
import Axios, { AxiosRequestConfig } from 'axios';
import { KitsuAuthToken } from './auth';

interface UserAttributes {
  createdAt: string,
  updatedAt: string,
  name: string,
  pastNames: string[],
  slug: string | null,
  about: string,
  location: string | null,
  waifuOrHusbando: string | null,
  followersCount: number,
  followingCount: number,
  /**
   * Depreciated
   */
  lifeSpentOnAnime: number,
  birthday: string | null,
  gender: string | null,
  commentsCount: number,
  favoritesCount: number,
  likesGivenCount: number,
  reviewsCount: number,
  likesReceivedCount: number,
  postsCount: number,
  ratingsCount: number,
  mediaReactionsCount: number,
  proExpiresAt: string | null,
  title: string | null,
  profileCompleted: boolean,
  feedCompleted: boolean,
  website: string | null,
  proTier: string | null,
  avatar: any,
  coverImage: any,
  status: string,
  subscribedToNewsletter: boolean
}

interface UserItem {
  id: string
  type: 'users',
  links: {self: string},
  attributes: UserAttributes,
  relationships: any,
}

const USERS_URL = BASE_URL + '/users';

class FetchUser {
  private url: string;
  private nextUrl?: string;

  constructor(query?: string) {
    const queryString = QueryString.stringify(
      { query: query },
      { encode: false }
    );
    this.url = USERS_URL + '?' + queryString;
  }

  /**
   * Executes query and fetches the first page of results.
   */
  public async exec(): Promise<ApiResponse<UserItem[]>> {
    try {
      const res = await Axios.get(this.url);
      this.nextUrl = res.data.links.next || undefined;
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Fetches the next page of results if exists.
   */
  public async next(): Promise<ApiResponse<UserItem[]> | void> {
    if (!this.nextUrl) {
      return Promise.resolve();
    }
    try {
      const res = await Axios.get(this.nextUrl);
      this.nextUrl = res.data.links.next || undefined;
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default class Users {
  /**
   * Search user resource.
   * @param query Your seach term.
   */
  fetch(query?: string): FetchUser {
    return new FetchUser(query);
  }

  /**
   * Get a user by slug (case insensitive).
   * @param slug Unique slug of user.
   */
  async fetchBySlug(slug: string): Promise<UserItem> {
    const queryString = QueryString.stringify(
      { filter: { slug: slug } },
      { encode: false }
    );
    try {
      const res = await Axios.get(USERS_URL + '?' + queryString);
      return Promise.resolve(res.data.data[0]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Get the currently logged in user.
   * @param auth Auth token of user.
   */
  async fetchSelf(auth: KitsuAuthToken): Promise<UserItem> {
    const queryString = QueryString.stringify(
      { filter: { self: true } },
      { encode: false }
    );
    const options: AxiosRequestConfig = {
      url: USERS_URL + '?' + queryString,
      headers: {
        'cache-control': 'no-cache',
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: 'Bearer ' + auth.access_token,
      },
    };

    try {
      const res = await Axios(options);
      return Promise.resolve(res.data.data[0]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Get the user by Id.
   * @param id Id of the user (Not Username).
   */
  async fetchById(id: string | number): Promise<UserItem> {
    try {
      const res = await Axios.get(USERS_URL + '/' + id);
      return Promise.resolve(res.data.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
