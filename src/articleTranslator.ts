import { supportedLanguages } from "./googleTranslateSupportedLanguages";
import { WikiArticle } from "./wikiArticle";
import { TranslatedWikiArticle } from "./translatedWikiArticle";

const supportedCodes = supportedLanguages.map(language => language.codes).flat(Infinity),
    translationApiBaseUrl = new URL("https://translate.googleapis.com/translate_a/t?client=gfx&format=html");

async function translateArticle(article: WikiArticle, abortSignal: AbortSignal, targetLanguage: string, sourceLanguage = article.languageCode): Promise<TranslatedWikiArticle> {
    if (article.document === null) {
        return { ...article, length: 0 };
    }
    // The API url without the sl and tl parameters
    const translationApiUrl = new URL(translationApiBaseUrl);
    translationApiUrl.searchParams.append("sl", sourceLanguage);
    translationApiUrl.searchParams.append("tl", targetLanguage);
    const response = await fetch(translationApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            q: article.document.documentElement.outerHTML
        }),
        signal: abortSignal
    });
    if (!response.ok) {
        return { ...article, document: null, length: 0 };
    }
    const translatedDocuments: string[] = await response.json() as string[],
        translatedDocument = translatedDocuments[0];
    if (translatedDocument !== undefined) {
        return {
            ...article,
            document: new DOMParser().parseFromString(translatedDocument, "text/html"),
            length: translatedDocument.length
        };
    }
    else {
        return { ...article, document: null, length: 0 };
    }
}

/**
 * @returns {Promise<WikiArticle[]>} An array of translated {@link WikiArticle}s. If {@link WikiArticle.languageCode} isn't a supported
 * language by Google, {@link WikiArticle.document} will be null and {@link WikiArticle.langth} will be 0.
 */
export async function translateArticles(articles: WikiArticle[], targetLanguage: string, abortSignal: AbortSignal): Promise<TranslatedWikiArticle[]> {
    const result: TranslatedWikiArticle[] = [], promises: Promise<TranslatedWikiArticle>[] = [];
    for (const article of articles) {
        if (!supportedCodes.includes(article.languageCode)) {
            result.push({ ...article, document: null, length: 0 });
            continue;
        }
        if (article.document !== null) {
            promises.push(translateArticle(article, abortSignal, targetLanguage));
        }
    }
    const translatedArticles = await Promise.all(promises);
    for (const translatedArticle of translatedArticles) {
        result.push(translatedArticle);
    }
    return result;
}
