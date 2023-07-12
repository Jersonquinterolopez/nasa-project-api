export interface Launch {
    flightNumber: number;
    launchDate: Date;
    mission: string;
    rocket: string;
    target?: string;
    customers: string[];
    upcoming: boolean;
    success: boolean;
}

export type Filter = Partial<Launch>;

export interface Payload {
    customers: string[];
    id: string;
}

export type Payloads = Payload[];

export interface Document {
    fairings: {
        reused: boolean;
        recovery_attempt: boolean;
        recovered: boolean;
        ships: string[];
    };
    links: {
        patch: {
            small: string;
            large: string;
        };
        reddit: {
            campaign: string | null;
            launch: string | null;
            media: string | null;
            recovery: string | null;
        };
        flickr: {
            small: string[];
            original: string[];
        };
        presskit: string | null;
        webcast: string;
        youtube_id: string;
        article: string;
        wikipedia: string;
    };
    static_fire_date_utc: string | null;
    static_fire_date_unix: number | null;
    net: boolean;
    window: number;
    rocket: {
        name: string;
        id: string;
    };
    success: boolean;
    failures: {
        time: number;
        altitude: number | null;
        reason: string;
    }[];
    details: string;
    crew: string[];
    ships: string[];
    capsules: string[];
    payloads: {
        customers: string[];
        id: string;
    }[];
    launchpad: string;
    flight_number: number;
    name: string;
    date_utc: string;
    date_unix: number;
    date_local: Date;
    date_precision: string;
    upcoming: boolean;
    cores: {
        core: string;
        flight: number;
        gridfins: boolean;
        legs: boolean;
        reused: boolean;
        landing_attempt: boolean;
        landing_success: boolean | null;
        landing_type: string | null;
        landpad: string | null;
    }[];
    auto_update: boolean;
    tbd: boolean;
    launch_library_id: string | null;
    id: string;
}

export type Documents = Array<Document>;

export interface Pagination {
    docs: Documents;
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export type LaunchMock = Pick<Launch, "flightNumber" | "mission" | "rocket" | "target" | "launchDate">;
