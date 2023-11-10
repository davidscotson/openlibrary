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
const authorIdentifierExtractionPatterns = {
    wikidata: commonRegex.wikidata,
    viaf: commonRegex.viaf,
    storygraph: /^https?:\/\/app\.thestorygraph\.com\/authors\/([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})$/,
    // librarything regex from https://www.wikidata.org/wiki/Property:P7400#P8966
    librarything: /^https?:\/\/www\.librarything\.(?:com|nl)\/author\/(\S+)/,
    // goodreads regex from https://www.wikidata.org/wiki/Property:P2963#P8966
    goodreads: /^https?:\/\/www\.goodreads\.com\/author\/(?:show|list)\/(\d+)/,
    // youtube handle regex from https://www.wikidata.org/wiki/Property:P11245#P8966
    // note: we adjust the regex to keep the @ symbol, which wikidata skips
    youtube: /^https:\/\/www\.youtube\.com\/(@[A-Za-z0-9_\-.]{3,30})/,
    // librivox regex from https://www.wikidata.org/wiki/Property:P1899#P8966
    librivox: /^https?:\/\/librivox\.org\/author\/(\d+)/,
    // project gutenberg author regex from https://www.wikidata.org/wiki/Property:P1938#P8966
    project_gutenberg: /^https?:\/\/www\.gutenberg\.org\/ebooks\/author\/([1-9]\d{0,4})/,
    // isni regex from https://www.wikidata.org/wiki/Property:P213#P8966
    // note we adjust the regex as we don't care about the spaces
    isni: /^https?:\/\/(?:www\.)?isni\.org\/isni\/(\d{4}\d{4}\d{4}\d{3}[\dX])$/,
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
    // I'ts not clear how to access these urls from the site, so not sure how useful this is
    // e.g. https://librivox.org/through-the-looking-glass-dramatic-reading-by-lewis-carroll/
    // is the same as https://librivox.org/5231 but with no obvious link except the RSS feed
    librivox: /^https?:\/\/librivox\.org\/(?:rss\/)?(\d+)($|\/|\?|#)/,
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
 * Compares url string against regex patters to extract author identifier.
 * @param {String} url
 * @returns {Array} [author identifier, identifier type] or null, null
 */
export function extractAuthorIdFromUrl(url) {
    return extractIdFromUrl(url, authorIdentifierExtractionPatterns);
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
