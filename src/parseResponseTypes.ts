export interface ParseResponse {
    error: Error;
    servedby: string;
    parse: Parse;
}

export interface Parse {
    title: string;
    pageid: number;
    revid: number;
    redirects: Redirect[];
    text: Text;
    langlinks: Langlink[];
    categories: Category[];
    links: Link[];
    templates: Template[];
    images: string[];
    externallinks: string[];
    sections: Section[];
    parsewarnings: string[];
    displaytitle: string;
    iwlinks: Iwlink[];
    properties: Property[];
}

export interface Property {
    name: string;
    "*": string;
}

export interface Iwlink {
    prefix: string;
    url: string;
    "*": string;
}

export interface Section {
    toclevel: number;
    level: string;
    line: string;
    number: string;
    index: string;
    fromtitle: string;
    byteoffset: number;
    anchor: string;
    linkAnchor: string;
}

export interface Template {
    ns: number;
    exists: string;
    "*": string;
}

export interface Link {
    ns: number;
    exists?: string;
    "*": string;
}

export interface Category {
    sortkey: string;
    hidden?: string;
    "*": string;
}

export interface Langlink {
    lang: string;
    url: string;
    langname: string;
    autonym: string;
    "*": string;
}

export interface Text {
    "*": string;
}

export interface Redirect {
    from: string;
    to: string;
}

export interface Error {
    code: string;
    info: string;
    "*": string;
}
