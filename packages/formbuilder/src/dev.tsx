import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FormEditor } from './Formbuilder'

function App() {

  const onSave = async (data: any) => {
    // TODO: Implement Tauri-independent save logic here
    console.log("Data to save:", data);
  }

  const body = [{ "uid": "h1TnqteWmZIPPcZqSoJB_", "ref": "Example Input", "labels": [], "hints": [], "items": [], "tag": "input", "bind": { "required": false, "readonly": false, "constraint": "", "constraintMsg": "", "calculate": "", "preload": "", "preloadParams": "", "type": "string" } }];


  const cancelFn = () => {
    console.log("Cancel function called");
  }


  return (
    <StrictMode>
      Formbuilder in package mode:

      <FormEditor onSave={onSave} cancelFn={cancelFn} formInput={{ title: 'Example Form', body }} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
