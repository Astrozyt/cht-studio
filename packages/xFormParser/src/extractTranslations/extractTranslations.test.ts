import { describe, it, expect } from 'vitest';
import { extractITextTranslations } from './index.ts';
import { JSDOM } from 'jsdom';
import mockTranslations from './mockTranslations.json';

describe('IText', () => {
    it('should correctly parse translations', () => {
        const xmlString = `
        <main>
         <translation lang="en">
          <text id="/bp_confirm/age:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/1:label">
            <value>Yes</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/2:label">
            <value>Completely refuses it</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/99:label">
            <value>Considers it</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent:label">
            <value>Does the participant agree to have his/her blood pressure measured now?</value>
          </text>
            </translation>
            <translation lang="se">
          <text id="/bp_confirm/age:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/age:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/99:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent:label">
            <value>Vill deltagaren att blodtrycket mäts nu?</value>
          </text>
            </translation>
            </main>
        `;
        const dom = new JSDOM(xmlString);
        const translations = extractITextTranslations(dom.window.document.querySelectorAll('translation'));
        expect(translations).toEqual(mockTranslations);
    });
});