export type { Langlink, Page };

type Langlink = {
    lang: string;
    url: string;
}

type Page = {
    langlinks: Langlink[];
}
