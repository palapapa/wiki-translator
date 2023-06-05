import { supportedLanguages } from "./googleTranslateSupportedLanguages";
import { WikiArticle } from "./wikiArticle";
import { TranslatedWikiArticle } from "./translatedWikiArticle";

const supportedCodes = supportedLanguages.map(language => language.codes).flat(Infinity);
const translationApiBaseUrl = new URL("https://translate.googleapis.com/translate_a/t?client=gfx&format=html");

async function translateArticle(article: WikiArticle, targetLanguage: string, sourceLanguage = article.language): Promise<TranslatedWikiArticle> {
    if (article.document == null) {
        return { language: article.language, document: null, length: 0 };
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
            q: article.document.documentElement.outerHTML,
        })
    });
    if (!response.ok) {
        return { language: article.language, document: null, length: 0 };
    }
    const translatedDocuments: string[] = await response.json();
    const translatedDocument = translatedDocuments[0];
    if (translatedDocument != undefined) {
        return {
            language: article.language,
            document: new DOMParser().parseFromString(translatedDocument, "text/html"),
            length: translatedDocument.length,
        };
    }
    else {
        return { language: article.language, document: null, length: 0 };
    }
}

/**
 * @returns {Promise<WikiArticle[]>} An array of translated {@link WikiArticle}s. If {@link WikiArticle.language} isn't a supported
 * language by Google, {@link WikiArticle.document} will be null.
 */
export async function translateArticles(articles: WikiArticle[], targetLanguage: string): Promise<TranslatedWikiArticle[]> {
    const result: TranslatedWikiArticle[] = [], promises: Promise<TranslatedWikiArticle>[] = [];
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        if (article != undefined) {
            if (!supportedCodes.includes(article.language)) {
                result.push({ language: article.language, document: null, length: 0 });
                continue;
            }
            if (article.document != null) {
                promises.push(translateArticle(article, targetLanguage));
            }
        }
    }
    const translatedArticles = await Promise.all(promises);
    for (let i = 0; i < translatedArticles.length; i++) {
        const translatedArticle = translatedArticles[i];
        if (translatedArticle != undefined) {
            result.push(translatedArticle);
        }
    }
    return result;
}
