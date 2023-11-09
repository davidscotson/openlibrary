import {
    detectTypeFromAuthorId,
} from '../../../openlibrary/plugins/openlibrary/js/idDetection.js';

const validAuthorData = [
    {
        id: 'Q42',
        type: 'wikidata',
        comment: '',
    },
    {
        id: '79e1fcbf-ab67-4e33-a8bd-9ecf3caf5a9c',
        type: 'storygraph',
        comment: '',
    },
    {
        id: '0000 0001 2028 5224',
        type: 'isni',
        comment: 'with standard spacing',
    },
    {
        id: '0000000120285224',
        type: 'isni',
        comment: 'with no spaces',
    },
    {
        id: '0000 0001 2146 438X',
        type: 'isni',
        comment: 'with an X check digit',
    },
    {
        id: '@neilgaiman',
        type: 'youtube',
        comment: '',
    },
    {
        id: 'B004KNMPSI',
        type: 'amazon',
        comment: '',
    },
    {
        id: 'B000AQ2A84',
        type: 'amazon',
        comment: '',
    },
];

const invalidAuthorData = [
    {
        id: '113230702',
        comment: 'a valid viaf, but too generic to match'
    },
    {
        id: 'faganjenni',
        comment: 'a valid librarything id, but too generic to match'
    },
];

describe('detectTypeFromAuthorId', () => {
    for (let i = 0; i < validAuthorData.length; i += 1) {
        const testcase = validAuthorData[i];
        it(`detect ${testcase.id} as ${testcase.type} ${testcase.comment}`, () => {
            expect(detectTypeFromAuthorId(testcase.id)).toBe(testcase.type);
        });
    }
    for (let i = 0; i < invalidAuthorData.length; i += 1) {
        const testcase = invalidAuthorData[i];
        it(`not detect ${testcase.id} as a known id type ${testcase.comment}`, () => {
            expect(detectTypeFromAuthorId(testcase.id)).toBe(null);
        });
    }
})
