import React, { useMemo } from "react";
import {
  defaultControlElements,
  QueryBuilder,
  type Field,
  type RuleGroupType,
  type RuleType,
} from "react-querybuilder";
import { useExistingContactFieldStore, useExistingContactSummaryFieldStore, useExistingNodesStore, useFormStore } from "../../../../../../stores/src/formStore.ts";
import "react-querybuilder/dist/query-builder.css";
import { mapNodesToFields } from "./mapNodesToFields.ts";

const LogicBuilder = ({
  saveFn,
  cancelFn = () => console.log("cancel"),
  existingQuery,
  updateFn,
}: {
  saveFn?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: RuleGroupType<RuleType<string, string, any, string>, string>
  ) => void;
  cancelFn?: () => void;
  existingQuery?: RuleGroupType<RuleType<string, string, any, string>, string>;
  updateFn?: (query: RuleGroupType<RuleType<string, string, any, string>, string>) => void;
}) => {
  const [query, setQuery] = React.useState<RuleGroupType>(
    existingQuery || {
      combinator: "and",
      rules: [],
    }
  );

  const formFields = useExistingNodesStore(state => state.existingNodes);
  const contactModelFields = useExistingContactFieldStore(state => state.existingContactFields);
  const defaultLang = useFormStore.getState().languages[0]?.short ?? 'en';
  const contactSummaryObjects = useExistingContactSummaryFieldStore(state => state.existingContactSummaryFields);
  console.log("zzz1:", contactSummaryObjects);
  const contactSummaryFields = contactSummaryObjects.map((obj): Field => ({
    name: obj.fieldPath,
    label: obj.key,
    type: obj.type || 'text',
    inputType: obj.type || 'text',
    valueEditorType: obj.type || 'text',
    //TODO: refine operators for other types
    operators: ['=', '!=', '<', '<=', '>', '>='],
  }));
  console.log("zzz2:", contactSummaryFields);


  const fields: Field[] = useMemo(
    () => mapNodesToFields(formFields, defaultLang),
    [formFields, defaultLang]
  );
  console.log("qqqLogicBuilder fields:", fields);

  return (
    <>
      <div data-cy="logicbuilder-field-count" data-count={fields.length} style={{ display: 'none' }} />
      <QueryBuilder
        fields={[...fields, ...contactModelFields, ...contactSummaryFields]}
        query={query}
        data-yc="logic-builder-query-builder"
        onQueryChange={(q) => {
          if (updateFn) {
            updateFn(q);
          }
          setQuery(q);
        }}
        controlElements={{ ...defaultControlElements }}
      />
      {saveFn && (
        <>
          <button data-cy="logic-builder-save" type='button' onClick={() => saveFn(query)}>Save</button>
          <button data-cy="logic-builder-cancel" onClick={() => { console.log(query); cancelFn(); }}>Cancel</button>
        </>
      )}
    </>
  );
};

export default LogicBuilder;
