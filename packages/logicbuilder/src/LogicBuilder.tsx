import React from "react";
import {
  QueryBuilder,
  type Field,
  type RuleGroupType,
  type RuleType,
} from "react-querybuilder";

import "react-querybuilder/dist/query-builder.css";
// import { ExpressionBuilder } from "./ExpressionBuilder";

const LogicBuilder = ({
  formFields,
  saveFn,
}: {
  formFields?: Field[];
  saveFn: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: RuleGroupType<RuleType<string, string, any, string>, string>
  ) => void;
}) => {
  const [query, setQuery] = React.useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });

  return (
    <>
      {/* <ExpressionBuilder fields={formFields || []} /> */}

      <QueryBuilder
        fields={formFields}
        query={query}
        onQueryChange={(q) => setQuery(q)}
        controlElements={{}}
      />
      <button onClick={() => saveFn(query)}>Save</button>
    </>
  );
};

export default LogicBuilder;
