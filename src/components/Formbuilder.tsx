// FormBuilder.jsx
import { useEffect, useRef } from "react";
// import "formeo/dist/formeo.min.css"; // Import Formeo styles
import Formeo from "formeo";

export default function FormBuilder() {
  const builderRef = useRef(null);
  const formeoInstanceRef = useRef(null);

  useEffect(() => {
    if (builderRef.current && !formeoInstanceRef.current) {
      formeoInstanceRef.current = new Formeo({
        container: builderRef.current,
        // optional: load a saved form here
        // svg sprite can be overridden or customized here if needed
      });
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Form Builder</h2>
      <div ref={builderRef} id="formeo-editor" />
    </div>
  );
}