import React from "react";
import LogicBuilder from "./LogicBuilder";

const App = () => {
  const sourceFormFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "age", label: "Age", type: "number" },
    { name: "email", label: "Email", type: "email" },
    { name: "birthday", label: "Birthday", type: "date" },
    {
      name: "country",
      label: "Country",
      type: "select",
      options: ["USA", "Canada", "Mexico"],
    },
  ];
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Logic Builder</h1>
      <LogicBuilder
        formFields={sourceFormFields}
        saveFn={(query) => console.log("I saved: ", query)}
      />
    </div>
  );
};

export default App;
