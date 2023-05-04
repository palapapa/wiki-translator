export type { Langlink, QueriedPage, ParsedPage };

interface Langlink {
    lang: string;
    url: string;
}

interface QueriedPage {
    langlinks: Langlink[];
}

interface ParsedPage {
    text: AsteriskContent;
}

type AsteriskContent = Record<"*", string>;
