import axios, { AxiosRequestConfig } from 'axios';

const TOKEN_URL: string = 'https://kitsu.io/api/oauth/token';

export const CLIENTID: string =
  'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd';
export const CLIENTSECRET: string =
  '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151';

export interface KitsuAuthToken {
  access_token: string;
  token_type?: string;
  expires_in?: string | number;
  refresh_token: string;
  scope?: string;
  created_at?: string | number;
}

export default class Auth {
  private axiosOptions: AxiosRequestConfig = {
    url: TOKEN_URL,
    method: 'post',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };
  /**
   * Get Kitsu Authentication token.
   * @param username Kitsu Username
   * @param password Kitsu Passowrd
   */
  async login(username: string, password: string): Promise<KitsuAuthToken> {
    const options: AxiosRequestConfig = {
      ...this.axiosOptions,
      data: JSON.stringify({
        grant_type: 'password',
        client_id: CLIENTID,
        client_secret: CLIENTSECRET,
        username: username,
        password: password,
      }),
    };

    try {
      const res = await axios(options);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * 
   * @param refresh_token Your refresh token.
   */
  async refreshAccessToken(refresh_token: string): Promise<KitsuAuthToken> {
    const options: AxiosRequestConfig = {
      ...this.axiosOptions,
      data: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: CLIENTID,
        client_secret: CLIENTSECRET,
      }
    }

    try {
      const res = await axios(options);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
