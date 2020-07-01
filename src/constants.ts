export const BASE_URL: string = 'https://kitsu.io/api/edge';

export interface ApiResponse <T> {
    data: T,
    included?: any,
    meta?: any,
    links?: {
        first: string,
        next?: string,
        prev?: string,
        last: string
    }
}