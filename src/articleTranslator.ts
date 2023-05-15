import { WikiArticle } from "./wikiArticle";

export async function translateArticles(articles: WikiArticle[]): Promise<WikiArticle[]> {
    // The API url without the sl and tl parameters
    const translationApiBaseUrl = new URL("https://translate.googleapis.com/translate_a/t?client=gfx&format=html");
    const result: WikiArticle[] = [], promises: Promise<Document>[] = [];
    return [];
}
