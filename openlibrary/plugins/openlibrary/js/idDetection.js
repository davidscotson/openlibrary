const commonRegex  = {
    wikidata: /^Q[1-9]\d+$/, // ignore single digit matches to reduce false positives
    storygraph: /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i,
    amazon: /^B[0-9A-Za-z]{9}$/,

}
const workIdentifierPatterns  = {
    wikidata: commonRegex.wikidata,
    amazon: commonRegex.amazon,
    storygraph: commonRegex.storygraph,
}
const authorIdentifierPatterns  = {
    wikidata: commonRegex.wikidata,
    storygraph: commonRegex.storygraph,
    amazon: commonRegex.amazon,
    storygraph: commonRegex.storygraph,
    isni: /^[0]{4} ?[0-9]{4} ?[0-9]{4} ?[0-9]{3}[0-9X]$/i,
    youtube: /^@[A-Za-z0-9_\-.]{3,30}/,
}
const editionIdentifierPatterns  = {
    wikidata: commonRegex.wikidata,
    amazon: commonRegex.amazon,
    storygraph: commonRegex.storygraph,
}

/**
 * Compares url string against regex patters to extract work identifier.
 * @param {String} id string to test
 * @returns {String} identifier type name e.g. 'wikidata' or null
 */
export function detectTypeFromWorkId(id) {
    return detectTypeFromId(id, workIdentifierPatterns);
}
/**
 * Compares url string against regex patters to extract author identifier.
 * @param {String} id string to test
 * @returns {String} identifier type name e.g. 'wikidata' or null
 */
export function detectTypeFromAuthorId(id) {
    return detectTypeFromId(id, authorIdentifierPatterns);
}
/**
 * Compares url string against regex patters to extract author identifier.
 * @param {String} id string to test
 * @returns {String} identifier type name e.g. 'wikidata' or null
 */
export function detectTypeFromEditionId(id) {
    return detectTypeFromId(id, editionIdentifierPatterns);
}
/**
 * Compares url string against regex patters to extract identifier.
 * @param {String} id string to test
 * @param {Object} named regexs to match against
 * @returns {String} identifier type name e.g. 'wikidata' or null
 */
function detectTypeFromId(id, patterns) {
    for (const idtype in patterns) {
        const detectPattern = patterns[idtype];
        if (detectPattern.test(id) === true) {
            return idtype;
        }
    }
    return null;
}
