import QueryString from 'qs';
import { BASE_URL, ApiResponse } from './constants';
import Axios from 'axios';

interface MappingFilters{
    externalSite?: 'myanimelist/anime' | 'myanimelist/manga' | 'anilist/anime' | 'anilist/manga' | 'anidb' | 'thetvdb/season' | 'thetvdb/series',
    externalId?: number | string
}

interface MappingAttributes {
    createdAt: string | null,
    updatedAt: string | null,
    externalSite: string,
    externalId: string
  }
  
  interface MappingItem {
    id: string
    type: 'mappings',
    links: {self: string},
    attributes: MappingAttributes,
    relationships: any,
  }

const MAPPINGS_URL = BASE_URL + '/mappings'

class FetchMappings {
    private url: string = MAPPINGS_URL
    private nextUrl?: string

    constructor(filters?: MappingFilters, include?: string) {
        if (filters) {
            const filterString: string = QueryString.stringify({filter: filters, include: include}, {encode: false})
            this.url = MAPPINGS_URL + '?' + filterString
        }
        
    }

    /**
     * Executes query and fetches the first page of results.
     */
    public async exec(): Promise<ApiResponse<MappingItem[]>> {
        try {
            const res = await Axios.get(this.url)
            this.nextUrl = res.data.links.next || undefined
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    /**
     * Fetches the next page of results if exists.
     */
    public async next(): Promise<ApiResponse<MappingItem[]> | undefined> {
        if(!this.nextUrl){
            return Promise.resolve(undefined)
        }
        try {
            const res = await Axios.get(this.nextUrl)
            this.nextUrl = res.data.links.next || undefined
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default class Mappings {
    /**
     * Search mappings.
     * @param filters 
     */
    fetch(filters?: MappingFilters, include?: string): FetchMappings{
        return new FetchMappings(filters, include)
    }


    /**
     * Fetch Mapping by id.
     * @param id The unique id of a Mapping.
     */
    async fetchById(id: number | string): Promise<ApiResponse<MappingItem>> {
        try {
            const res = await Axios.get(MAPPINGS_URL + '/' + id)
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}