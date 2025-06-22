import { describe, it, expect } from 'vitest';
import { extractBinds } from './extractBinds';
import { JSDOM } from 'jsdom';

describe('retrieve all data from binds', () => {
    it('should extract nodeset, type and calculate from binds', () => {
        const xmlString = `
            <root>
               <bind nodeset="/bp_confirm/group_clin_assess/lbl_any_symptoms" type="string" calculate="jr:choice-name( /bp_confirm/group_clin_assess/any_symptoms ,' /bp_confirm/group_clin_assess/any_symptoms ')"></bind>
            </root>
        `;
        const dom = new JSDOM(xmlString);
        const binds = extractBinds(dom.window.document.querySelectorAll('bind'));
        expect(binds).toEqual([
            {
                nodeset: '/bp_confirm/group_clin_assess/lbl_any_symptoms',
                type: 'string',
                required: undefined,
                relevant: undefined,
                constraint: undefined,
                constraintMsg: undefined,
                readonly: undefined,
                calculate: 'jr:choice-name( /bp_confirm/group_clin_assess/any_symptoms ,\' /bp_confirm/group_clin_assess/any_symptoms \')',
                preload: undefined,
                preloadParams: undefined
            }
        ]);
    });

    it('should extract all attributes from binds', () => {
        const xmlString = `
            <root>
                <bind nodeset="/bp_confirm/group_clin_assess/lbl_any_symptoms" type="string" required="true" relevant="true" constraint="constraint" jr:constraintMsg="constraint message" readonly="true" calculate="calculate expression" jr:preload="preload expression" jr:preloadParams="preload params"></bind>
            </root>
        `;
        const dom = new JSDOM(xmlString);
        const binds = extractBinds(dom.window.document.querySelectorAll('bind'));
        expect(binds).toEqual([
            {
                nodeset: '/bp_confirm/group_clin_assess/lbl_any_symptoms',
                type: 'string',
                required: 'true',
                relevant: 'true',
                constraint: 'constraint',
                constraintMsg: 'constraint message',
                readonly: 'true',
                calculate: 'calculate expression',
                preload: 'preload expression',
                preloadParams: 'preload params'
            }
        ]);
    });
});