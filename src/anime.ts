import { BASE_URL, ApiResponse } from './constants';
import Axios from 'axios';
import QueryString from 'qs';

interface AnimeFilters {
  text?: string;
  categories?: string;
  ageRating?: 'G' | 'PG' | 'R' | 'R18';
  season?: 'winter' | 'spring' | 'summer' | 'fall';
  year?: string;
}

interface AnimeAttributes {
  createdAt: string,
  updatedAt: string,
  slug: string | null,
  synopsis: string,
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
  subtype: 'ONA' | 'OVA' | 'TV' | 'movie' | 'music' | 'special',
  status: 'current' | 'finished' | 'tba' | 'unreleased' | 'upcoming',
  tba: string | null,
  posterImage: any | null,
  coverImage: any | null,
  episodeCount: number | null,
  episodeLength: number | null,
  youtubeVideoId: string | null,
  showType: 'ONA' | 'OVA' | 'TV' | 'movie' | 'music' | 'special',
  nsfw: boolean
}

interface AnimeItem {
  id: string
  type: 'anime',
  links: {self: string},
  attributes: AnimeAttributes,
  relationships: any,
}

const ANIME_URL = BASE_URL + '/anime';

class FetchAnime {
  private url: string;
  private nextUrl?: string;

  constructor(
    filters?: AnimeFilters,
    sort?: string,
    include?: 'categories' | 'mappings'
  ) {
    const queryString = QueryString.stringify(
      { filters: filters, sort: sort, include: include },
      { encode: false }
    );
    this.url = ANIME_URL + '?' + queryString;
  }

  /**
   * Executes query and fetches the first page of results.
   */
  public async exec(): Promise<ApiResponse<AnimeItem[]>> {
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
  public async next(): Promise<ApiResponse<AnimeItem[]> | undefined> {
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

export default class Anime {
  /**
   * Search Anime
   * @param filters Filter query results.
   * @param sort Sort by attributes (Prepend '-' to attribute for descending).
   * @param include Include related resources
   */
  fetch(
    filters?: AnimeFilters,
    sort?: string,
    include?: 'categories' | 'mappings'
  ): FetchAnime {
    return new FetchAnime(filters, sort, include);
  }

  /**
   * Fetches an anime by its id.
   * @param id Id of an anime.
   */
  async fetchById(id: string | number): Promise<ApiResponse<AnimeItem>> {
    try {
      const res = await Axios.get(ANIME_URL + '/' + id);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
