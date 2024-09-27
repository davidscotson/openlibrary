import {
    extractEditionIdFromUrl,
} from '../../../openlibrary/plugins/openlibrary/js/idExtraction.js';

const validEditionData = [
    {
        desc: 'wikidata url',
        url: 'https://www.wikidata.org/wiki/Q24704731',
        type: 'wikidata',
        id: 'Q24704731',
    },
    {
        desc: 'storygraph edition',
        url: 'https://app.thestorygraph.com/books/1df3abd0-184c-4016-8fe7-8e22d7fcb265',
        type: 'storygraph',
        id: '1df3abd0-184c-4016-8fe7-8e22d7fcb265',
    },
    {
        desc: 'goodreads version/edition',
        url: 'https://www.goodreads.com/book/show/33299154-rotherweird',
        type: 'goodreads',
        id: '33299154',
    },
    {
        desc: 'project gutenberg edition',
        url: 'https://www.gutenberg.org/ebooks/1906',
        type: 'project_gutenberg',
        id: '1906',
    },
];

const invalidEditionData = [
    {
        desc: 'storygraph author',
        url: 'https://app.thestorygraph.com/authors/79e1fcbf-ab67-4e33-a8bd-9ecf3caf5a9c',
        comment: 'not a edition so should return null',
    },
    {
        desc: 'goodreads work',
        url: 'https://www.goodreads.com/en/book/show/33299154',
        comment: 'not a edition so should return null',
    },
    {
        desc: 'random string',
        url: 'Anything random',
        comment: 'not a url so should return null',
    },
    {
        desc: 'goodreads author',
        url: 'https://www.goodreads.com/author/show/16616431.Andrew_Caldecott',
        comment: 'not an edition so should return null',
    },
    {
        desc: 'librarything author',
        url: 'https://www.librarything.com/author/faganjenni',
        comment: 'not an edition so should return null',
    },
];

describe('extractEditionIdFromUrl', () => {
    for (let i = 0; i < validEditionData.length; i += 1) {
        const testcase = validEditionData[i];
        it(`parse ${testcase.desc} e.g. ${testcase.url}`, () => {
            expect(extractEditionIdFromUrl(testcase.url)).toStrictEqual([testcase.id, testcase.type]);
        });
    }
    for (let i = 0; i < invalidEditionData.length; i += 1) {
        const testcase = invalidEditionData[i];
        it(`reject ${testcase.desc} e.g. ${testcase.url}`, () => {
            expect(extractEditionIdFromUrl(testcase.url)).toStrictEqual([null, null]);
        });
    }
})
