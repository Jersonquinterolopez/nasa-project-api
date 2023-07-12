import { QueryParams } from "../controllers/launches.controller";

// in mongo if we pass 0 as argument for the limit() function.
// it will return all the documents in our collection
const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

export interface Options {
    skip: number;
    limit: number;
}

function getPagination(query: QueryParams): Options {
    const page = Math.abs(Number(query.page)) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(Number(query.limit)) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    };
}

export { getPagination };
