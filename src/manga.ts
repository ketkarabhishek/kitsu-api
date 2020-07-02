import { BASE_URL, ApiResponse } from './constants';
import Axios from 'axios';
import QueryString from 'qs';

interface MangaFilters {
  text?: string;
  categories?: string;
  chapterCount?: number;
  year?: string;
}

interface MangaAttributes {
  createdAt: string,
  updatedAt: string,
  slug: string | null,
  synopsis: string,
  /**
   * @deprecated
   */
  coverImageTopOffset: number,
  titles: { en?: string, en_jp?: string, ja_jp?: string },
  canonicalTitle: string
  abbreviatedTitles: string[],
  averageRating: string | null,
  ratingFrequencies: {[key: number]: string},
  userCount: number
  favoritesCount: number,
  startDate: string | null,
  endDate: string | null,
  popularityRank: number | null,
  ratingRank: number | null,
  ageRating: 'G' | 'PG' | 'R' | 'R18' | null,
  ageRatingGuide: string | null,
  subtype: 'doujin' | 'manga' | 'manhua' | 'manhwa' | 'novel' | 'oel' | 'oneshot',
  status: 'current' | 'finished' | 'tba' | 'unreleased' | 'upcoming',
  tba: string | null,
  posterImage: any | null,
  coverImage: any | null,
  chapterCount: number | null,
  volumeCount: number | null,
  serialization: string | null,
  mangaType: 'doujin' | 'manga' | 'manhua' | 'manhwa' | 'novel' | 'oel' | 'oneshot',
}

interface MangaItem {
  id: string
  type: 'manga',
  links: {self: string},
  attributes: MangaAttributes,
  relationships: any,
}

const ANIME_URL = BASE_URL + '/manga';

class FetchManga {
  private url: string;
  private nextUrl?: string;

  constructor(
    options?: {
      filter?: MangaFilters,
      sort?: string,
      include?: 'categories' | 'mappings',
      page?: {limit?: number, offset?: number}
    } 
  ) {
    const queryString = QueryString.stringify(
      options,
      { encode: false }
    );
    this.url = ANIME_URL + '?' + queryString;
  }

  /**
   * Executes query and fetches the first page of results.
   */
  public async exec(): Promise<ApiResponse<MangaItem[]>> {
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
  public async next(): Promise<ApiResponse<MangaItem[]> | undefined> {
    if (!this.nextUrl) {
      return Promise.resolve(undefined);
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

export default class Manga {
  /**
   * Search Manga
   * @param filters Filter query results.
   * @param sort Sort by attributes (Prepend '-' to attribute for descending).
   * @param include Include related resources.
   * @param page Pagination parameters.
   */
  fetch(
    options?: {
      filter?: MangaFilters,
      sort?: string,
      include?: 'categories' | 'mappings',
      page?: {limit?: number, offset?: number}
    } 
  ): FetchManga {
    return new FetchManga(options);
  }

  /**
   * Fetches an manga by its id.
   * @param id Id of an manga.
   */
  async fetchById(id: string | number): Promise<ApiResponse<MangaItem>> {
    try {
      const res = await Axios.get(ANIME_URL + '/' + id);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
