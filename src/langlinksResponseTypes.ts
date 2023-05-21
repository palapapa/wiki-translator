export interface LanglinksResponse {
    batchcomplete?: string;
    query?: Query;
    limits?: Limits;
}

export interface Limits {
    langlinks?: number;
}

export interface Query {
    normalized?: Normalized[];
    pages?: Pages;
}

export interface Pages {
    [key: string]: Page
}

export interface Page {
    pageid?: number;
    ns?: number;
    title?: string;
    langlinks?: Langlink[];
}

export interface Langlink {
    lang?: string;
    url?: string;
    "*"?: string;
}

export interface Normalized {
    from?: string;
    to?: string;
}
