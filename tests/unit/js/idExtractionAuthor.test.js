import {
    extractAuthorIdFromUrl,
} from '../../../openlibrary/plugins/openlibrary/js/idExtraction.js';

const validAuthorData = [
    {
        desc: 'wikidata url',
        url: 'https://www.wikidata.org/wiki/Q42',
        type: 'wikidata',
        id: 'Q42',
    },
    {
        desc: 'viaf url with #',
        url: 'https://viaf.org/viaf/113230702/#Adams,_Douglas,_1952-2001.',
        type: 'viaf',
        id: '113230702',
    },
    {
        desc: 'viaf url with /',
        url: 'https://viaf.org/viaf/113230702/',
        type: 'viaf',
        id: '113230702',
    },
    {
        desc: 'viaf url without /',
        url: 'https://viaf.org/viaf/113230702',
        type: 'viaf',
        id: '113230702',
    },
    {
        desc: 'goodreads author',
        url: 'https://www.goodreads.com/author/show/16616431.Andrew_Caldecott',
        type: 'goodreads',
        id: '16616431',
    },
    {
        desc: 'storygraph author',
        url: 'https://app.thestorygraph.com/authors/79e1fcbf-ab67-4e33-a8bd-9ecf3caf5a9c',
        type: 'storygraph',
        id: '79e1fcbf-ab67-4e33-a8bd-9ecf3caf5a9c'
    },
    {
        desc: 'librarything author',
        url: 'https://www.librarything.com/author/faganjenni',
        type: 'librarything',
        id: 'faganjenni',
    },
    {
        desc: 'youtube handle',
        url: 'https://www.youtube.com/@neilgaiman',
        type: 'youtube',
        id: '@neilgaiman',
    },
    {
        desc: 'isni url',
        url: 'https://isni.org/isni/0000000120285224',
        type: 'isni',
        id: '0000000120285224',
    },
    {
        desc: 'project gutenberg author',
        url: 'https://www.gutenberg.org/ebooks/author/120',
        type: 'project_gutenberg',
        id: '120',
    },
];

const invalidAuthorData = [
    {
        desc: 'storygraph work',
        url: 'https://app.thestorygraph.com/books/1df3abd0-184c-4016-8fe7-8e22d7fcb265',
        comment: 'not a work so should return null',
    },
    {
        desc: 'goodreads edition',
        url: 'https://www.goodreads.com/en/book/show/33299154',
        comment: 'not an author so should return null',
    },
    {
        desc: 'random string',
        url: 'Anything random',
        comment: 'not a url so should return null',
    },
    {
        desc: 'librarything work',
        url: 'https://www.librarything.com/work/12241832',
        comment: 'not an author so should return null',
    },
    {
        desc: 'goodreads work',
        url: 'https://www.goodreads.com/work/editions/54031496-rotherweird',
    },
];

describe('extractAuthorIdFromUrl', () => {
    for (let i = 0; i < validAuthorData.length; i += 1) {
        const testcase = validAuthorData[i];
        it(`parse ${testcase.desc} e.g. ${testcase.url}`, () => {
            expect(extractAuthorIdFromUrl(testcase.url)).toStrictEqual([testcase.id, testcase.type]);
        });
    }
    for (let i = 0; i < invalidAuthorData.length; i += 1) {
        const testcase = invalidAuthorData[i];
        it(`reject ${testcase.desc} e.g. ${testcase.url}`, () => {
            expect(extractAuthorIdFromUrl(testcase.url)).toStrictEqual([null, null]);
        });
    }
})
