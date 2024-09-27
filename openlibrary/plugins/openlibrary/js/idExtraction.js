const commonRegex = {
    wikidata: /^https?:\/\/www\.wikidata\.org\/wiki\/(Q[1-9]\d*)$/,
    // viaf regex from https://www.wikidata.org/wiki/Property:P214#P8966
    viaf: /^https?:\/\/(?:www\.)?viaf\.org\/viaf\/([1-9]\d(?:\d{0,7}|\d{17,20}))($|\/|\?|#)/,
    // note: storygraph seems to use the same format for works and editions
    storygraph: /^https?:\/\/app\.thestorygraph\.com\/books\/([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})$/,

}
const workIdentifierExtractionPatterns = {
    wikidata: commonRegex.wikidata,
    viaf: commonRegex.viaf,
    storygraph: commonRegex.storygraph,
    // librarything regex from https://www.wikidata.org/wiki/Property:P1085#P8966
    librarything: /^https?:\/\/www\.librarything\.(?:com|nl)\/work\/(\d+)/,
    // goodreads regex from https://www.wikidata.org/wiki/Property:P8383#P8966
    goodreads: /^https?:\/\/www\.goodreads\.com\/work\/editions\/(\d+)/,

}
const editionIdentifierExtractionPatterns = {
    wikidata: commonRegex.wikidata,
    storygraph: commonRegex.storygraph,
    // goodreads regex from https://www.wikidata.org/wiki/Property:P2969#P8966
    goodreads: /^https?:\/\/www\.goodreads\.com\/book\/show\/(\d+)/,
    // lccn regex from https://www.wikidata.org/wiki/Property:P1144#P8966
    lccn: /^https?:\/\/(?:www\.)?loc\.gov\/item\/(((a(c|fl?|gr)?|b[irs]|c(a?d?|lc|[sxy])|do?|es?|f(i[ae]?)?|g[ms]?|h(a|e[wx]?)?|in?t|j[ax]?|kx?|l(lh|tf)?|m([ams]|ap|ed|i[cdef]|pa?|us)?|n(cn|ex?|[tu]c)|or|p([aop]|h[opq])|r[aceu]?|s(ax?|[cdfgnsu])?|t(b|mp)|u(m|nk)|w(ar)?|[xz])(\b|-)?|20)?\d\d(-\d{1,5}|(\b|-)?\d{6}))\//,
    // oclc regex from https://www.wikidata.org/wiki/Property:P243#P8966
    // there are three regexes given, we could in theory check them all
    oclc_numbers: /^https?:\/\/(?:www\.)?worldcat\.org\/title\/(\d+)/,
    // isfdb regex from https://www.wikidata.org/wiki/Property:P1234#P8966
    isfdb: /^https?:\/\/www\.isfdb\.org\/cgi-bin\/pl\.cgi\?(\d+)/,
    // project gutenberg regex from https://www.wikidata.org/wiki/Property:P2034#P8966
    project_gutenberg: /^https?:\/\/(?:www\.)?gutenberg\.org\/ebooks\/([1-9]\d*)/,
}

/**
 * Compares url string against regex patters to extract work identifier.
 * @param {String} url
 * @returns {Array} [work identifier, identifier type] or null, null
 */
export function extractWorkIdFromUrl(url) {
    return extractIdFromUrl(url, workIdentifierExtractionPatterns);
}
/**
 * Compares url string against regex patters to extract edition identifier.
 * @param {String} url
 * @returns {Array} [edition identifier, identifier type] or null, null
 */
export function extractEditionIdFromUrl(url) {
    return extractIdFromUrl(url, editionIdentifierExtractionPatterns);
}
/**
 * Compares url string against regex patters to extract identifier.
 * @param {String} url
 * @param {Object} patters - object of regex patterns
 * @returns {Array} [identifier, identifier type] or null, null
 */
function extractIdFromUrl(url, patterns) {
    for (const idtype in patterns) {
        const extractPattern = patterns[idtype];
        const id = extractPattern.exec(url);
        if (id && id[1]) {
            return [id[1], idtype];
        }
    }
    return [null, null];
}
