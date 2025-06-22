import { describe, it, expect } from 'vitest';
import { extractBody } from './extractBody';
import { JSDOM } from 'jsdom';
import mockBody from './mockBody.json'


describe('retrieve all data from binds', () => {
  it('should extract nodeset, type and calculate from binds', () => {
    const xmlString = `
 <body>
    <group ref="/bp_confirm/inputs">
      <label ref="jr:itext('/bp_confirm/inputs:label')"/>
      <group ref="/bp_confirm/inputs/contact">
        <input appearance="db-object" ref="/bp_confirm/inputs/contact/_id">
          <label ref="jr:itext('/bp_confirm/inputs/contact/_id:label')"/>
          <hint ref="jr:itext('/bp_confirm/inputs/contact/_id:hint')"/>
        </input>
        <group ref="/bp_confirm/inputs/contact/parent">
          <label ref="jr:itext('/bp_confirm/inputs/contact/parent:label')"/>
          <group ref="/bp_confirm/inputs/contact/parent/parent">
            <label ref="jr:itext('/bp_confirm/inputs/contact/parent/parent:label')"/>
          </group>
        </group>
      </group>
    </group>
    <group ref="/bp_confirm/group_clin_assess">
      <label ref="jr:itext('/bp_confirm/group_clin_assess:label')"/>
      <select1 ref="/bp_confirm/group_clin_assess/any_symptoms">
        <label ref="jr:itext('/bp_confirm/group_clin_assess/any_symptoms:label')"/>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/any_symptoms/1:label')"/>
          <value>1</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/any_symptoms/2:label')"/>
          <value>2</value>
        </item>
      </select1>
      <select ref="/bp_confirm/group_clin_assess/symptoms">
        <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms:label')"/>
        <hint ref="jr:itext('/bp_confirm/group_clin_assess/symptoms:hint')"/>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/1:label')"/>
          <value>1</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/2:label')"/>
          <value>2</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/3:label')"/>
          <value>3</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/4:label')"/>
          <value>4</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/5:label')"/>
          <value>5</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/6:label')"/>
          <value>6</value>
        </item>
        <item>
          <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms/99:label')"/>
          <value>99</value>
        </item>
      </select>
      <input ref="/bp_confirm/group_clin_assess/other_symptom">
        <label ref="jr:itext('/bp_confirm/group_clin_assess/other_symptom:label')"/>
      </input>
      <trigger ref="/bp_confirm/group_clin_assess/symptoms_warn">
        <label ref="jr:itext('/bp_confirm/group_clin_assess/symptoms_warn:label')"/>
      </trigger>
    </group>
    <group appearance="field-list" ref="/bp_confirm/bp_confirm">
      <group ref="/bp_confirm/bp_confirm/bp_consent_equipment">
        <select1 ref="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available:label')"/>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available/1:label')"/>
            <value>1</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available/2:label')"/>
            <value>2</value>
          </item>
        </select1>
        <input ref="/bp_confirm/bp_confirm/bp_consent_equipment/note_missing_bp_machine">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/note_missing_bp_machine:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/bp_consent_equipment/bp_information">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_information:label')"/>
        </input>
        <select1 ref="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent:label')"/>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/1:label')"/>
            <value>1</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/99:label')"/>
            <value>99</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent/2:label')"/>
            <value>2</value>
          </item>
        </select1>
        <input ref="/bp_confirm/bp_confirm/bp_consent_equipment/bp_refused">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_consent_equipment/bp_refused:label')"/>
        </input>
      </group>
      <group ref="/bp_confirm/bp_confirm/bp_measurement">
        <input ref="/bp_confirm/bp_confirm/bp_measurement/bp_setting">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/bp_setting:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/bp_measurement/sys_first">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/sys_first:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/bp_measurement/dia_first">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/dia_first:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/bp_measurement/sys_second">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/sys_second:label')"/>
        </input>
        <trigger ref="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec:label')"/>
          <hint ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec:hint')"/>
        </trigger>
        <input ref="/bp_confirm/bp_confirm/bp_measurement/dia_second">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/dia_second:label')"/>
        </input>
        <trigger ref="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec:label')"/>
          <hint ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec:hint')"/>
        </trigger>
        <input ref="/bp_confirm/bp_confirm/bp_measurement/sys_third">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/sys_third:label')"/>
        </input>
        <trigger ref="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third:label')"/>
          <hint ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third:hint')"/>
        </trigger>
        <input ref="/bp_confirm/bp_confirm/bp_measurement/dia_third">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/dia_third:label')"/>
        </input>
        <trigger ref="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third">
          <label ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third:label')"/>
          <hint ref="jr:itext('/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third:hint')"/>
        </trigger>
      </group>
      <group appearance="field-list" ref="/bp_confirm/bp_confirm/evaluation">
        <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation:label')"/>
        <input ref="/bp_confirm/bp_confirm/evaluation/normal_bp">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/normal_bp:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/evaluation/highnormal_bp">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/highnormal_bp:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t1">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t1:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t2">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t2:label')"/>
        </input>
        <input ref="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t3">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t3:label')"/>
        </input>
        <select1 ref="/bp_confirm/bp_confirm/evaluation/ref_bp_acc">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_acc:label')"/>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_acc/1:label')"/>
            <value>1</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_acc/2:label')"/>
            <value>2</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_acc/98:label')"/>
            <value>98</value>
          </item>
        </select1>
        <select ref="/bp_confirm/bp_confirm/evaluation/ref_bp_ref">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref:label')"/>
          <hint ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref:hint')"/>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref/1:label')"/>
            <value>1</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref/2:label')"/>
            <value>2</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref/3:label')"/>
            <value>3</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref/4:label')"/>
            <value>4</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref/5:label')"/>
            <value>5</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref/99:label')"/>
            <value>99</value>
          </item>
        </select>
        <input ref="/bp_confirm/bp_confirm/evaluation/ref_bp_ref_other">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_bp_ref_other:label')"/>
        </input>
        <select1 ref="/bp_confirm/bp_confirm/evaluation/ref_escort">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort:label')"/>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort/1:label')"/>
            <value>1</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort/2:label')"/>
            <value>2</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort/98:label')"/>
            <value>98</value>
          </item>
        </select1>
        <select ref="/bp_confirm/bp_confirm/evaluation/ref_escort_ref">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref:label')"/>
          <hint ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref:hint')"/>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref/1:label')"/>
            <value>1</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref/2:label')"/>
            <value>2</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref/3:label')"/>
            <value>3</value>
          </item>
          <item>
            <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref/99:label')"/>
            <value>99</value>
          </item>
        </select>
        <input ref="/bp_confirm/bp_confirm/evaluation/ref_escort_ref_other">
          <label ref="jr:itext('/bp_confirm/bp_confirm/evaluation/ref_escort_ref_other:label')"/>
        </input>
      </group>
      <input ref="/bp_confirm/bp_confirm/generated_note_name_95">
        <label ref="jr:itext('/bp_confirm/bp_confirm/generated_note_name_95:label')"/>
      </input>
    </group>
    <group appearance="field-list" ref="/bp_confirm/bukana_bp_confirmation">
      <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation:label')"/>
      <input ref="/bp_confirm/bukana_bp_confirmation/note_bp_confirmation">
        <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/note_bp_confirmation:label')"/>
      </input>
      <input ref="/bp_confirm/bukana_bp_confirmation/note_today">
        <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/note_today:label')"/>
      </input>
      <input ref="/bp_confirm/bukana_bp_confirmation/note_warn_symptom">
        <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/note_warn_symptom:label')"/>
        <hint ref="jr:itext('/bp_confirm/bukana_bp_confirmation/note_warn_symptom:hint')"/>
      </input>
      <group ref="/bp_confirm/bukana_bp_confirmation/confirmation_results">
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_equipment_missing">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_equipment_missing:label')"/>
        </input>
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_refused">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_refused:label')"/>
        </input>
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_value">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_value:label')"/>
        </input>
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_diagnosed">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_diagnosed:label')"/>
        </input>
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_normal">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_normal:label')"/>
        </input>
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_treatment_initiate">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_treatment_initiate:label')"/>
        </input>
        <input ref="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_ref_treatment_ini">
          <label ref="jr:itext('/bp_confirm/bukana_bp_confirmation/confirmation_results/note_ref_treatment_ini:label')"/>
        </input>
      </group>
    </group>
    <group appearance="hidden" ref="/bp_confirm/data"/>
  </body> `;

    const dom = new JSDOM(xmlString, { contentType: "text/xml" });
    const body = dom.window.document.querySelector("body");
    const result = body && extractBody(body);
    expect(result).toEqual(mockBody);
    // Clean up the DOM and body after the test
    dom.window.close();
  });
  it('should handle empty body', () => {
    const xmlString = `<body></body>`;
    const dom = new JSDOM(xmlString, { contentType: "text/xml" });
    const body = dom.window.document.querySelector("body");
    const result = body && extractBody(body);
    expect(result).toEqual([]);
  });
});
