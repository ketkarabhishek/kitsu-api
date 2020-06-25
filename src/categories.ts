import { BASE_URL } from './constants'
import Axios from 'axios'
import QueryString from 'qs';

interface CategoryFilters{
    parentId?: string | number,
    slug?: string,
    nsfw?: boolean
}

const CATEGORIES_URL = BASE_URL + '/categories'

class FetchCategory{
    private url: string = CATEGORIES_URL
    private nextUrl?: string

    constructor(filters?: CategoryFilters) {
        if (filters) {
            const filterString: string = QueryString.stringify({filter: filters}, {encode: false})
            console.log(filterString);

            this.url = CATEGORIES_URL + '?' + filterString
        }
        
    }

    /**
     * Executes query and fetches the first page of results.
     */
    public async exec() {
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
    public async next() {
        console.log(this.nextUrl);
        if(!this.nextUrl){
            return Promise.resolve(null)
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



export default class Categories {

    /**
     * Search categories.
     * @param filters 
     */
    fetch(filters?: CategoryFilters): FetchCategory {
        return new FetchCategory(filters)
    }

    /**
     * Fetch category by id.
     * @param id The unique id of a category.
     */
    async fetchById(id: number | string): Promise<any> {
        try {
            const res = await Axios.get(CATEGORIES_URL + '/' + id)
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    
}