
import { useEffect, useRef } from 'react';
import { FormEditor } from '@bpmn-io/form-js-editor';



const schema = {
  type: 'default',
  components: [
    {
      key: 'creditor',
      label: 'Creditor',
      type: 'textfield',
      validate: {
        required: true,
      },
    },
  ],
};

const FormBuilder = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const formEditorInstance = useRef<any>(null);
  console

  useEffect(() => {
    if (!editorRef.current) return;

    const formEditor = new FormEditor({
      container: editorRef.current,
    });

    formEditor
      .importSchema(schema)
      .catch((err: any) => {
        console.error('Failed to import schema', err);
      });

    formEditorInstance.current = formEditor;

    // Optional: cleanup
    return () => {
      formEditorInstance.current?.detach();
    };
  }, []);

  return <>
    <p>Editor</p>
    <div id="form-editor" ref={editorRef} style={{ height: '500px' }} />
  </>
};

export default FormBuilder;
