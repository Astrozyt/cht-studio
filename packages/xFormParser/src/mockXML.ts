

export const mockXML = `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:orx="http://openrosa.org/xforms">
  <h:head>
    <h:title>Hypertension Confirmation</h:title>
    <model>
      <itext>
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
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_information:label">
            <value>Explain the participant that you would like to measure his/her blood pressure. It will not hurt.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available/1:label">
            <value>Yes</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available/2:label">
            <value>No</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available:label">
            <value>Do you have a functioning blood pressure machine with you?</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_refused:label">
            <value>Tell the participant that it would be very important to measure the blood pressure. The procedure is not painful. If the participant changes his/her mind go back one question and correct it. Submit this form if he/ she still refuses the measurement.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/note_missing_bp_machine:label">
            <value>Finish and submit the form and then call you supervisor to inform him/her that you do not have a functioning blood pressure machine. Tell the participant that you will return and offer a measurement as soon as the blood pressure device is available again.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/bp_setting:label">
            <value>Make sure the participant is seated, with the back supported and the arm rested on his/her lap or on a table. Place the cuff around the upper arm. Make sure the patient is sitting without moving and talking during the measurements.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_first:jr:constraintMsg">
            <value>Diastolic blood pressure must be between 40 and 180 and cannot be higher than the systolic blood pressure. Make sure all measurements are noted correctly.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_first:label">
            <value>Diastolic BP <output value=" /bp_confirm/reference_arm "/> arm, first measurement:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_second:jr:constraintMsg">
            <value>Diastolic blood pressure must be between 40 and 180 and cannot be higher than the systolic blood pressure. Make sure all measurements are noted correctly.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_second:label">
            <value>Diastolic BP <output value=" /bp_confirm/reference_arm "/> arm, second measurement:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_third:jr:constraintMsg">
            <value>Diastolic blood pressure must be between 40 and 180 and cannot be higher than the systolic blood pressure. Make sure all measurements are noted correctly.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_third:label">
            <value>Diastolic BP <output value=" /bp_confirm/reference_arm "/> arm, third measurement:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_first:jr:constraintMsg">
            <value>Systolic blood pressure cannot be lower than 60 or higher than 300</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_first:label">
            <value>Systolic BP <output value=" /bp_confirm/reference_arm "/> arm, first measurement:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_second:jr:constraintMsg">
            <value>Systolic blood pressure cannot be lower than 60 or higher than 300</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_second:label">
            <value>Systolic BP <output value=" /bp_confirm/reference_arm "/> arm, second measurement:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_third:jr:constraintMsg">
            <value>Systolic blood pressure cannot be lower than 60 or higher than 300</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_third:label">
            <value>Systolic BP <output value=" /bp_confirm/reference_arm "/> arm, third measurement:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec:hint">
            <value>If the value is not correct, adjust it.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec:label">
            <value>Confirm that the second diastolic BP measured was: <output value=" /bp_confirm/bp_confirm/bp_measurement/dia_second "/></value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third:hint">
            <value>If the value is not correct, adjust it.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third:label">
            <value>Confirm that the third diastolic BP measured was: <output value=" /bp_confirm/bp_confirm/bp_measurement/dia_third "/></value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec:hint">
            <value>If the value is not correct, adjust it.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec:label">
            <value>Confirm that the second systolic BP measured was: <output value=" /bp_confirm/bp_confirm/bp_measurement/sys_second "/></value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third:hint">
            <value>If the value is not correct, adjust it.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third:label">
            <value>Confirm that the third systolic BP measured was: <output value=" /bp_confirm/bp_confirm/bp_measurement/sys_third "/></value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/highnormal_bp:label">
            <value>The participant has a highnormal blood pressure. Advice the participant to keep adhering to a healthy life-style with a balanced diet, no smoking and regular physical activity. The blood pressure should be checked again in one year.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/normal_bp:label">
            <value>The participant has a normal blood pressure. No further action is required. Congratulate the participant to the good value and tell him to keep adhering to a healthy life-style with a balanced diet, no smoking and regular physical activity. The blood pressure should be checked again in one year.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t1:label">
            <value>The participant has arterial hypertension, because he/she has had two elevated blood pressure measurements. Treatment is recommended. Finish this form, submit it and then open the Hypertension Treatment Initiation Form in the task list</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t2:label">
            <value>The participant has arterial hypertension, because he/she has had two elevated blood pressure measurements. Treatment is recommended. Finish this form, submit it and then refer the participant to the health facility for initiation of hypertension treatment</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t3:label">
            <value>The participant has arterial hypertension, because he/she has had two elevated blood pressure measurements. Treatment is recommended. Finish this form, submit it and then refer the participant to the health facility for initiation of hypertension treatment. Offer the participant that you would accompany him/her to the Health Center.</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc/1:label">
            <value>Yes</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc/2:label">
            <value>No</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc/98:label">
            <value>Does not know yet</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc:label">
            <value>Does the participant agree to go to the Health Center?</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/1:label">
            <value>No money for transport</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/2:label">
            <value>No time</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/3:label">
            <value>Does not trust the CCW</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/4:label">
            <value>Does not believe to get good care at the HC / Hospital</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/5:label">
            <value>Does not believe arterial hypertension is dangerous</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/99:label">
            <value>Other</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref:hint">
            <value>You may select several reasons</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref:label">
            <value>Why does the participant refuse to go to the Health Center / Hospital?</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref_other:label">
            <value>Specifiy the other reason for refusing to go to the Health Center / Hospital:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort/1:label">
            <value>Yes</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort/2:label">
            <value>No</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort/98:label">
            <value>Does not know yet</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort:label">
            <value>Does the participant want you to accompany him/her to the Health Center?</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/1:label">
            <value>Does not think it is necessary</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/2:label">
            <value>Prefers to go alone</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/3:label">
            <value>Does not trust the CCW</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/99:label">
            <value>Other</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref:hint">
            <value>You may select several reasons</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref:label">
            <value>Why does the participant not want to be accompanied by you?</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref_other:label">
            <value>Specifiy the other reason:</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation:label">
            <value>Evaluation of measurement</value>
          </text>
          <text id="/bp_confirm/bp_confirm/generated_note_name_95:label">
            <value>BP diagnostic status: <output value=" /bp_confirm/bp_confirm/bp_diagnostic_status "/></value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_diagnosed:label">
            <value>Diagnosis: Arterial Hypertension</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_normal:label">
            <value>Normal blood pressure, next check in 1 year</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_refused:label">
            <value>Blood pressure measurement refused</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_value:label">
            <value>Blood pressure: <output value=" /bp_confirm/bp_confirm/evaluation/sys_average "/> / <output value=" /bp_confirm/bp_confirm/evaluation/dia_average "/></value></text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_equipment_missing:label">
            <value>Equipment for blood pressure measurement was missing</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_ref_treatment_ini:label">
            <value>Referral to health facility for initiation of hypertension treatment</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_treatment_initiate:label">
            <value>After submission of this form, directly open the Hypertension Treatment Initiation Form from the task list.</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_bp_confirmation:label">
            <value>Combacal Hypertension Confirm Visit</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_today:label">
            <value><output value=" /bp_confirm/bukana_bp_confirmation/today "/></value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_warn_symptom:hint">
            <value>Write down the warn symptom(s):</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_warn_symptom:label">
            <value>Referral due to warn symptom:</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation:label">
            <value>Bukana Note</value>
          </text>
          <text id="/bp_confirm/date_t_weight_dummy:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/any_symptoms/1:label">
            <value>Yes</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/any_symptoms/2:label">
            <value>No</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/any_symptoms:label">
            <value>Does the participant currently have any medical complaint?</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/other_symptom:label">
            <value>Specify the symptom:</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/1:label">
            <value>Severe headache</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/2:label">
            <value>Persistent pain or pressure in the chest</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/3:label">
            <value>Difficulty in breathing</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/4:label">
            <value>New confusion defined as new episode of irrelevant speech</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/5:label">
            <value>New pronounced tiredness defined as inability to stay awake</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/6:label">
            <value>Looking very ill</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/99:label">
            <value>Other symptom</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms:hint">
            <value>You may select several symptoms</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms:label">
            <value>What kind of symptoms does the client report. You can also select more than one symptom.</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms_warn:label">
            <value>The reported symptom is a danger sign. Please refer this client immediately to the health facility, organise transport and call the health facility and your supervisor.</value>
          </text>
          <text id="/bp_confirm/group_clin_assess:label">
            <value>General Symptom Screening</value>
          </text>
          <text id="/bp_confirm/height_dummy:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/inputs/contact/_id:hint">
            <value>db-object</value>
          </text>
          <text id="/bp_confirm/inputs/contact/_id:label">
            <value>What is the patient's name?</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent:label">
            <value>Grandparent</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent:label">
            <value>Parent</value>
          </text>
          <text id="/bp_confirm/inputs/source_id:label">
            <value>Source_ID</value>
          </text>
          <text id="/bp_confirm/inputs/task_id:label">
            <value>Task_ID</value>
          </text>
          <text id="/bp_confirm/inputs:jr:constraintMsg">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/inputs:label">
            <value>Patient</value>
          </text>
          <text id="/bp_confirm/patient_id:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/patient_name:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/patient_uuid:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/reference_arm:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/t_bp_diagnostic_status:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/t_weight_dummy:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/trial_arm:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/weight_expiry:hint">
            <value>hidden</value>
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
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_information:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/bp_refused:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_consent_equipment/note_missing_bp_machine:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/bp_setting:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_first:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_first:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_second:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_second:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_third:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/dia_third:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_first:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_first:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_second:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_second:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_third:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/sys_third:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_sec:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_dia_third:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_sec:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/bp_measurement/trigger_sys_third:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/highnormal_bp:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/normal_bp:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t3:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc/98:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_acc:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/3:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/4:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/5:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref/99:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_bp_ref_other:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort/98:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/3:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref/99:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation/ref_escort_ref_other:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/evaluation:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bp_confirm/generated_note_name_95:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_diagnosed:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_normal:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_refused:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_value:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_equipment_missing:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_ref_treatment_ini:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_treatment_initiate:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_bp_confirmation:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_today:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_warn_symptom:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation/note_warn_symptom:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/bukana_bp_confirmation:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/data/_bp_diagnostic_status:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/data/_warn_symptom:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/data:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/date_t_weight_dummy:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/date_t_weight_dummy:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/any_symptoms/1:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/any_symptoms/2:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/any_symptoms:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/other_symptom:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/1:label">
            <value>Ho opeloa ke hlooho haholo</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/2:label">
            <value>Bohloko bo sa feleng kapa khatello ea sefuba</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/3:label">
            <value>Bothata ba ho hema</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/4:label">
            <value>Pherekano e ncha e hlalosoang e le karolo e ncha ea puo e sa amaneng</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/5:label">
            <value>Mokhathala o mocha o hlalosoang o sa khone ho lula o falimehile</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/6:label">
            <value>Ho shebahala o kula haholo</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms/99:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess/symptoms_warn:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/group_clin_assess:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/height_dummy:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/height_dummy:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/_id:hint">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/name:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/address:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/name:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent/_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent/address:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent/cluster_trial_arm:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent/contact_type:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent/name:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent/parent:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/parent:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact/patient_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/contact:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/source:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/source_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs/task_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs:jr:constraintMsg">
            <value>-</value>
          </text>
          <text id="/bp_confirm/inputs:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/patient_id:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/patient_id:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/patient_name:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/patient_name:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/patient_uuid:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/patient_uuid:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/reference_arm:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/reference_arm:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/t_bp_diagnostic_status:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/t_bp_diagnostic_status:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/t_weight_dummy:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/t_weight_dummy:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/trial_arm:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/trial_arm:label">
            <value>-</value>
          </text>
          <text id="/bp_confirm/weight_expiry:hint">
            <value>hidden</value>
          </text>
          <text id="/bp_confirm/weight_expiry:label">
            <value>-</value>
          </text>
        </translation>
      </itext>
      <instance>
        <bp_confirm id="bp_confirm" prefix="J1!bp_confirm!" delimiter="#">
          <inputs>
            <meta>
              <location>
                <lat/>
                <long/>
                <error/>
                <message/>
              </location>
            </meta>
            <source/>
            <source_id/>
            <task_id/>
            <contact>
              <_id/>
              <patient_id/>
              <name/>
              <parent>
                <_id/>
                <name/>
                <address/>
                <parent>
                  <_id/>
                  <name/>
                  <contact_type/>
                  <address/>
                  <cluster_trial_arm/>
                </parent>
              </parent>
            </contact>
          </inputs>
          <patient_uuid/>
          <patient_id/>
          <patient_name/>
          <trial_arm/>
          <reference_arm/>
          <t_bp_diagnostic_status/>
          <t_weight_dummy/>
          <date_t_weight_dummy/>
          <weight_expiry/>
          <height_dummy/>
          <age/>
          <group_clin_assess>
            <any_symptoms/>
            <lbl_any_symptoms/>
            <symptoms/>
            <lbl_symptoms/>
            <other_symptom/>
            <symptoms_warn/>
            <warn_symptom/>
          </group_clin_assess>
          <bp_confirm>
            <bp_consent_equipment>
              <bp_machine_available/>
              <lbl_bp_machine_available/>
              <note_missing_bp_machine/>
              <bp_information/>
              <bp_consent/>
              <lbl_bp_consent/>
              <bp_refused/>
              <bp_equipment_consent/>
            </bp_consent_equipment>
            <bp_measurement>
              <bp_setting/>
              <sys_first/>
              <dia_first/>
              <sys_second/>
              <trigger_sys_sec/>
              <dia_second/>
              <trigger_dia_sec/>
              <sys_third/>
              <trigger_sys_third/>
              <dia_third/>
              <trigger_dia_third/>
            </bp_measurement>
            <evaluation>
              <sys_average/>
              <dia_average/>
              <normal_bp/>
              <highnormal_bp/>
              <note_bp_diagnosed_t1/>
              <note_bp_diagnosed_t2/>
              <note_bp_diagnosed_t3/>
              <ref_bp_acc/>
              <lbl_ref_bp_acc/>
              <ref_bp_ref/>
              <lbl_ref_bp_ref/>
              <ref_bp_ref_other/>
              <ref_escort/>
              <lbl_ref_escort/>
              <ref_escort_ref/>
              <lbl_ref_escort_ref/>
              <ref_escort_ref_other/>
            </evaluation>
            <bp_diagnostic_status/>
            <generated_note_name_95/>
          </bp_confirm>
          <bukana_bp_confirmation>
            <note_bp_confirmation/>
            <today/>
            <note_today/>
            <note_warn_symptom/>
            <confirmation_results>
              <note_equipment_missing/>
              <note_bp_refused/>
              <note_bp_value/>
              <note_bp_diagnosed/>
              <note_bp_normal/>
              <note_treatment_initiate/>
              <note_ref_treatment_ini/>
            </confirmation_results>
          </bukana_bp_confirmation>
          <data>
            <_bp_diagnostic_status/>
            <_warn_symptom/>
          </data>
          <meta tag="hidden">
            <instanceID/>
          </meta>
        </bp_confirm>
      </instance>
      <instance id="contact-summary"/>
      <bind nodeset="/bp_confirm/inputs" relevant="./source = 'user'" jr:constraintMsg="jr:itext('/bp_confirm/inputs:jr:constraintMsg')"/>
      <bind nodeset="/bp_confirm/inputs/source" type="string" constraint="user"/>
      <bind nodeset="/bp_confirm/inputs/source_id" type="string"/>
      <bind nodeset="/bp_confirm/inputs/task_id" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact" readonly="field-list"/>
      <bind nodeset="/bp_confirm/inputs/contact/_id" type="db:person"/>
      <bind nodeset="/bp_confirm/inputs/contact/patient_id" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/name" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/_id" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/name" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/address" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/parent/_id" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/parent/name" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/parent/contact_type" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/parent/address" type="string"/>
      <bind nodeset="/bp_confirm/inputs/contact/parent/parent/cluster_trial_arm" type="string"/>
      <bind nodeset="/bp_confirm/patient_uuid" type="string" calculate="../inputs/contact/_id"/>
      <bind nodeset="/bp_confirm/patient_id" type="string" calculate="../inputs/contact/patient_id"/>
      <bind nodeset="/bp_confirm/patient_name" type="string" calculate="../inputs/contact/name"/>
      <bind nodeset="/bp_confirm/trial_arm" type="string" calculate="../inputs/contact/parent/parent/cluster_trial_arm"/>
      <bind nodeset="/bp_confirm/reference_arm" type="string"/>
      <bind nodeset="/bp_confirm/t_bp_diagnostic_status" type="string"/>
      <bind nodeset="/bp_confirm/t_weight_dummy" type="string"/>
      <bind nodeset="/bp_confirm/date_t_weight_dummy" type="string"/>
      <bind nodeset="/bp_confirm/weight_expiry" type="string"/>
      <bind nodeset="/bp_confirm/height_dummy" type="string"/>
      <bind nodeset="/bp_confirm/age" type="string"/>
      <bind nodeset="/bp_confirm/group_clin_assess/any_symptoms" type="select1" required="true()"/>
      <bind nodeset="/bp_confirm/group_clin_assess/lbl_any_symptoms" type="string" calculate="jr:choice-name( /bp_confirm/group_clin_assess/any_symptoms ,' /bp_confirm/group_clin_assess/any_symptoms ')"/>
      <bind nodeset="/bp_confirm/group_clin_assess/symptoms" type="select" required="true()" relevant=" /bp_confirm/group_clin_assess/any_symptoms  = '1'"/>
      <bind nodeset="/bp_confirm/group_clin_assess/lbl_symptoms" type="string" calculate="jr:choice-name( /bp_confirm/group_clin_assess/symptoms ,' /bp_confirm/group_clin_assess/symptoms ')"/>
      <bind nodeset="/bp_confirm/group_clin_assess/other_symptom" type="string" required="true()" relevant="selected( /bp_confirm/group_clin_assess/symptoms ,'99')"/>
      <bind nodeset="/bp_confirm/group_clin_assess/symptoms_warn" required="true()" relevant="(selected( /bp_confirm/group_clin_assess/symptoms ,'1')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'2')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'3')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'4')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'5')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'6'))"/>
      <bind nodeset="/bp_confirm/group_clin_assess/warn_symptom" type="string" calculate="if((selected( /bp_confirm/group_clin_assess/symptoms ,'1')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'2')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'3')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'4')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'5')) or (selected( /bp_confirm/group_clin_assess/symptoms ,'6')), '1', '2')"/>
      <bind nodeset="/bp_confirm/bp_confirm" relevant=" /bp_confirm/group_clin_assess/warn_symptom ='2'"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available" type="select1" required="true()"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/lbl_bp_machine_available" type="string" calculate="jr:choice-name( /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ,' /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ')"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/note_missing_bp_machine" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ='2' and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/bp_information" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ='1' and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/bp_consent" type="select1" required="true()" relevant=" /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ='1' and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/lbl_bp_consent" type="string" calculate="jr:choice-name( /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ,' /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ')"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/bp_refused" readonly="true()" type="string" relevant="( /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='2' or  /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='99') and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_consent_equipment/bp_equipment_consent" type="string" calculate="if( /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ='1' and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='1', '1', '2')"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement" relevant=" /bp_confirm/bp_confirm/bp_consent_equipment/bp_equipment_consent ='1' and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_equipment_consent !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/bp_setting" readonly="true()" type="string"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/sys_first" type="int" required="true()" jr:constraintMsg="jr:itext('/bp_confirm/bp_confirm/bp_measurement/sys_first:jr:constraintMsg')" constraint=". &gt; 60 and . &lt; 300"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/dia_first" type="int" required="true()" jr:constraintMsg="jr:itext('/bp_confirm/bp_confirm/bp_measurement/dia_first:jr:constraintMsg')" constraint=". &gt; 40 and . &lt; 180 and .&lt; int( /bp_confirm/bp_confirm/bp_measurement/sys_first )"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/sys_second" type="int" required="true()" jr:constraintMsg="jr:itext('/bp_confirm/bp_confirm/bp_measurement/sys_second:jr:constraintMsg')" constraint=". &gt; 60 and . &lt; 300"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/dia_second" type="int" required="true()" jr:constraintMsg="jr:itext('/bp_confirm/bp_confirm/bp_measurement/dia_second:jr:constraintMsg')" constraint=". &gt; 40 and . &lt; 180 and .&lt; int( /bp_confirm/bp_confirm/bp_measurement/sys_second )"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/sys_third" type="int" required="true()" jr:constraintMsg="jr:itext('/bp_confirm/bp_confirm/bp_measurement/sys_third:jr:constraintMsg')" constraint=". &gt; 60 and . &lt; 300"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_measurement/dia_third" type="int" required="true()" jr:constraintMsg="jr:itext('/bp_confirm/bp_confirm/bp_measurement/dia_third:jr:constraintMsg')" constraint=". &gt; 40 and . &lt; 180 and .&lt; int( /bp_confirm/bp_confirm/bp_measurement/sys_third )"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation" relevant=" /bp_confirm/bp_confirm/bp_consent_equipment/bp_equipment_consent ='1' and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_equipment_consent !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/sys_average" type="string" calculate="(int( /bp_confirm/bp_confirm/bp_measurement/sys_second ) + int( /bp_confirm/bp_confirm/bp_measurement/sys_third )) div 2"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/dia_average" type="string" calculate="(int( /bp_confirm/bp_confirm/bp_measurement/dia_second ) + int( /bp_confirm/bp_confirm/bp_measurement/dia_third )) div 2"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/normal_bp" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/evaluation/sys_average  &lt; 130 and  /bp_confirm/bp_confirm/evaluation/dia_average  &lt; 85 and  /bp_confirm/bp_confirm/evaluation/sys_average  !='' and  /bp_confirm/bp_confirm/evaluation/dia_average  !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/highnormal_bp" readonly="true()" type="string" relevant="( /bp_confirm/bp_confirm/evaluation/sys_average  &lt; 140 and  /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 130 and  /bp_confirm/bp_confirm/evaluation/dia_average  &lt; 90) or ( /bp_confirm/bp_confirm/evaluation/dia_average  &lt; 90 and  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 85 and  /bp_confirm/bp_confirm/evaluation/sys_average  &lt; 140) and  /bp_confirm/bp_confirm/evaluation/sys_average  !='' and  /bp_confirm/bp_confirm/evaluation/dia_average  !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t1" readonly="true()" type="string" relevant="( /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 140 or  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 90) and  /bp_confirm/trial_arm ='1'"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t2" readonly="true()" type="string" relevant="( /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 140 or  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 90) and  /bp_confirm/trial_arm ='2'"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/note_bp_diagnosed_t3" readonly="true()" type="string" relevant="( /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 140 or  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 90) and  /bp_confirm/trial_arm ='3'"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/ref_bp_acc" type="select1" required="true()" relevant="( /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 140 or  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 90) and ( /bp_confirm/trial_arm ='3' or  /bp_confirm/trial_arm ='2')"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/lbl_ref_bp_acc" type="string" calculate="jr:choice-name( /bp_confirm/bp_confirm/evaluation/ref_bp_acc ,' /bp_confirm/bp_confirm/evaluation/ref_bp_acc ')"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/ref_bp_ref" type="select" required="true()" relevant=" /bp_confirm/bp_confirm/evaluation/ref_bp_acc ='2' and  /bp_confirm/bp_confirm/evaluation/ref_bp_acc !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/lbl_ref_bp_ref" type="string" calculate="jr:choice-name( /bp_confirm/bp_confirm/evaluation/ref_bp_ref ,' /bp_confirm/bp_confirm/evaluation/ref_bp_ref ')"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/ref_bp_ref_other" type="string" required="true()" relevant="selected( /bp_confirm/bp_confirm/evaluation/ref_bp_ref , '99')"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/ref_escort" type="select1" required="true()" relevant="( /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 140 or  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 90) and  /bp_confirm/trial_arm ='3' and  /bp_confirm/bp_confirm/evaluation/ref_bp_acc  ='1' and  /bp_confirm/bp_confirm/evaluation/ref_bp_acc  !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/lbl_ref_escort" type="string" calculate="jr:choice-name( /bp_confirm/bp_confirm/evaluation/ref_escort ,' /bp_confirm/bp_confirm/evaluation/ref_escort ')"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/ref_escort_ref" type="select" required="true()" relevant=" /bp_confirm/bp_confirm/evaluation/ref_escort ='2' and  /bp_confirm/bp_confirm/evaluation/ref_escort !=''"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/lbl_ref_escort_ref" type="string" calculate="jr:choice-name( /bp_confirm/bp_confirm/evaluation/ref_escort_ref ,' /bp_confirm/bp_confirm/evaluation/ref_escort_ref ')"/>
      <bind nodeset="/bp_confirm/bp_confirm/evaluation/ref_escort_ref_other" type="string" required="true()" relevant="selected( /bp_confirm/bp_confirm/evaluation/ref_escort_ref , '99')"/>
      <bind nodeset="/bp_confirm/bp_confirm/bp_diagnostic_status" type="string" calculate="if( /bp_confirm/bp_confirm/evaluation/sys_average  &lt; 140 and  /bp_confirm/bp_confirm/evaluation/dia_average  &lt; 90 and  /bp_confirm/bp_confirm/evaluation/sys_average  !='' and  /bp_confirm/bp_confirm/evaluation/dia_average  !='', 'highnormal', if( /bp_confirm/bp_confirm/evaluation/sys_average  &gt;= 140 or  /bp_confirm/bp_confirm/evaluation/dia_average  &gt;= 90, 'diagnosed', if( /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='2', 'refused', if( /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='99', 'considering',  /bp_confirm/t_bp_diagnostic_status ))))"/>
      <bind nodeset="/bp_confirm/bp_confirm/generated_note_name_95" readonly="true()" type="string"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation" required="true()"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/note_bp_confirmation" readonly="true()" type="string"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/today" jr:preload="date" type="date" jr:preloadParams="today"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/note_today" readonly="true()" type="string"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/note_warn_symptom" readonly="true()" type="string" relevant=" /bp_confirm/group_clin_assess/warn_symptom ='1'"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results" relevant=" /bp_confirm/group_clin_assess/warn_symptom ='2'"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_equipment_missing" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_consent_equipment/bp_machine_available ='2'"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_refused" readonly="true()" type="string" relevant="( /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='2' or  /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent ='99') and  /bp_confirm/bp_confirm/bp_consent_equipment/bp_consent !=''"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_value" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/evaluation/sys_average !='' and  /bp_confirm/bp_confirm/evaluation/dia_average  != ''"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_diagnosed" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_diagnostic_status ='diagnosed'"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_bp_normal" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_diagnostic_status ='highnormal'"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_treatment_initiate" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_diagnostic_status ='diagnosed' and  /bp_confirm/trial_arm ='1'"/>
      <bind nodeset="/bp_confirm/bukana_bp_confirmation/confirmation_results/note_ref_treatment_ini" readonly="true()" type="string" relevant=" /bp_confirm/bp_confirm/bp_diagnostic_status ='diagnosed' and ( /bp_confirm/trial_arm ='3' or  /bp_confirm/trial_arm ='2')"/>
      <bind nodeset="/bp_confirm/data/_bp_diagnostic_status" type="string" calculate=" /bp_confirm/bp_confirm/bp_diagnostic_status "/>
      <bind nodeset="/bp_confirm/data/_warn_symptom" type="string" calculate=" /bp_confirm/group_clin_assess/warn_symptom "/>
      <bind nodeset="/bp_confirm/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
    </model>
  </h:head>
  <h:body>
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
  </h:body>
</h:html>
<?xml version="1.0" encoding="UTF-8"?>`;