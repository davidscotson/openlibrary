import {
    detectTypeFromEditionId
} from '../../../openlibrary/plugins/openlibrary/js/idDetection.js';

const validEditionData = [
    {
        id: 'Q53828903',
        type: 'wikidata',
        comment: '',
    },
    {
        id: 'ba4d2cfd-4ed5-4b59-a1d5-0aaebbef005f',
        type: 'storygraph',
        comment: '',
    },
];

const invalidEditionData = [
    {
        id: 'Q5',
        comment: 'a valid wikidata id but too short/generic to match'
    },
    {
        id: '5976042',
        comment: 'a valid librarything work, but too generic to match'
    },
];

describe('detectTypeFromEditionId', () => {
    for (let i = 0; i < validEditionData.length; i += 1) {
        const testcase = validEditionData[i];
        it(`detect ${testcase.id} as ${testcase.type} ${testcase.comment}`, () => {
            expect(detectTypeFromEditionId(testcase.id)).toBe(testcase.type);
        });
    }
    for (let i = 0; i < invalidEditionData.length; i += 1) {
        const testcase = invalidEditionData[i];
        it(`not detect ${testcase.id} as a known id type ${testcase.comment}`, () => {
            expect(detectTypeFromEditionId(testcase.id)).toBe(null);
        });
    }
})
