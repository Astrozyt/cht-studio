import React from "react";
import {
  defaultControlElements,
  QueryBuilder,
  type Field,
  // type Field,
  type RuleGroupType,
  type RuleType,
} from "react-querybuilder";

import "react-querybuilder/dist/query-builder.css";
// import { ExpressionBuilder } from "./ExpressionBuilder";

const LogicBuilder = ({
  formFields,
  saveFn,
  cancelFn = () => console.log("cancel"),
  existingQuery,
  updateFn,
}: {
  formFields?: any[];
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
  console.log("existing: ", formFields);

  const fields: Field[] = formFields?.map((field) => ({
    name: field.ref,
    label: field.ref, // Use field.ref as the label
    value: field.ref + 'value',
    type: field.bind?.type || "text",
    placeholder: "This is a placeholder",
    inputType: "number"
    // options: field.tag === 'select' && field.items?.map((item) => ({
    //   value: item.value,
    //   label: item.label,
    // })
    // ) || [],
  })) || [];
  return (
    <>
      {/* <ExpressionBuilder fields={formFields || []} /> */}

      <QueryBuilder
        fields={fields}
        query={query}
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
          <button type='button' onClick={() => saveFn(query)}>Save</button>
          <button onClick={() => { console.log(query); cancelFn(); }}>Cancel</button>
        </>
      )}
    </>
  );
};

export default LogicBuilder;
