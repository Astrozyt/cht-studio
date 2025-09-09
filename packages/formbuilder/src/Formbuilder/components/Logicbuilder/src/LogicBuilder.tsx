import React from "react";
import {
  defaultControlElements,
  QueryBuilder,
  type Field,
  type RuleGroupType,
  type RuleType,
} from "react-querybuilder";
import { useExistingNodesStore } from "../../../../../../stores/src/formStore.ts";
import "react-querybuilder/dist/query-builder.css";

const LogicBuilder = ({
  // formFields,
  saveFn,
  cancelFn = () => console.log("cancel"),
  existingQuery,
  updateFn,
}: {
  // formFields?: any[];
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

  const fields: Field[] = formFields?.map((field) => ({
    name: field.ref,
    label: field.ref, // Use field.ref as the label
    value: field.ref + 'value',
    type: field.bind?.type || "text",
    placeholder: "This is a placeholder",
    inputType: "number"
  })) || [];

  // const fields = (
  //   [
  //     {
  //       name: 'firstName',
  //       label: 'First Name',
  //       placeholder: 'Enter first name',
  //     },
  //   ]
  // )

  return (
    <>
      <QueryBuilder
        fields={fields}
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
